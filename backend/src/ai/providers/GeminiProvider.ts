import { AIProvider, AIProviderOptions, AIGenerateResult } from './AIProvider.js';

export class GeminiProvider implements AIProvider {
  public readonly name = 'GeminiProvider';
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(apiKey?: string, model?: string) {
    const rawKey = apiKey !== undefined ? apiKey : (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '');
    this.apiKey = (rawKey || '').trim();
    this.model = model || process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    this.baseUrl = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
  }

  public async generateText(prompt: string, options?: AIProviderOptions): Promise<AIGenerateResult<string>> {
    const startTime = Date.now();
    if (!this.apiKey) {
      throw new Error('[GeminiProvider] Missing GEMINI_API_KEY or GOOGLE_API_KEY in environment');
    }

    const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 2048,
        stopSequences: options?.stopSequences
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`[GeminiProvider] API Error (${response.status}): ${errText}`);
    }

    const json = await response.json() as any;
    const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const tokensIn = json?.usageMetadata?.promptTokenCount || Math.round(prompt.length / 4);
    const tokensOut = json?.usageMetadata?.candidatesTokenCount || Math.round(rawText.length / 4);

    return {
      data: rawText,
      rawText,
      tokensIn,
      tokensOut,
      durationMs: Date.now() - startTime,
      provider: 'google-gemini',
      model: this.model
    };
  }

  public async generateStructured<T>(
    prompt: string,
    schemaDescription: string,
    options?: AIProviderOptions
  ): Promise<AIGenerateResult<T>> {
    const startTime = Date.now();
    if (!this.apiKey) {
      throw new Error('[GeminiProvider] Missing GEMINI_API_KEY or GOOGLE_API_KEY in environment');
    }

    const enhancedPrompt = `${prompt}\n\nStrict Output Requirements:
You must respond with valid JSON ONLY conforming to: ${schemaDescription}.
Do NOT output markdown backticks, explanations, or text outside the JSON object.`;

    const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: enhancedPrompt }]
        }
      ],
      generationConfig: {
        temperature: options?.temperature ?? 0.2,
        maxOutputTokens: options?.maxTokens ?? 2048,
        responseMimeType: 'application/json'
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`[GeminiProvider] API Error (${response.status}): ${errText}`);
    }

    const json = await response.json() as any;
    let rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Strip markdown code fences if model returned them despite responseMimeType
    rawText = rawText.trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsedData: T;
    try {
      parsedData = JSON.parse(rawText) as T;
    } catch (err: any) {
      throw new Error(`[GeminiProvider] Failed to parse model output as JSON: ${err.message}. Raw text: ${rawText}`);
    }

    const tokensIn = json?.usageMetadata?.promptTokenCount || Math.round(enhancedPrompt.length / 4);
    const tokensOut = json?.usageMetadata?.candidatesTokenCount || Math.round(rawText.length / 4);

    return {
      data: parsedData,
      rawText,
      tokensIn,
      tokensOut,
      durationMs: Date.now() - startTime,
      provider: 'google-gemini',
      model: this.model
    };
  }
}
