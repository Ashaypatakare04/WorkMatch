import { AIProvider, AIProviderOptions, AIGenerateResult } from './AIProvider.js';

export class OpenAIProvider implements AIProvider {
  public readonly name = 'OpenAIProvider';
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(apiKey?: string, model?: string, baseUrl?: string) {
    const rawKey = apiKey !== undefined ? apiKey : (process.env.OPENAI_API_KEY || '');
    this.apiKey = (rawKey || '').trim();
    this.model = model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
    this.baseUrl = baseUrl || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  }

  public async generateText(prompt: string, options?: AIProviderOptions): Promise<AIGenerateResult<string>> {
    const startTime = Date.now();
    if (!this.apiKey) {
      throw new Error('[OpenAIProvider] Missing OPENAI_API_KEY in environment');
    }

    const url = `${this.baseUrl}/chat/completions`;
    const payload = {
      model: this.model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
      stop: options?.stopSequences
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`[OpenAIProvider] API Error (${response.status}): ${errText}`);
    }

    const json = await response.json() as any;
    const rawText = json?.choices?.[0]?.message?.content || '';
    const tokensIn = json?.usage?.prompt_tokens || Math.round(prompt.length / 4);
    const tokensOut = json?.usage?.completion_tokens || Math.round(rawText.length / 4);

    return {
      data: rawText,
      rawText,
      tokensIn,
      tokensOut,
      durationMs: Date.now() - startTime,
      provider: 'openai',
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
      throw new Error('[OpenAIProvider] Missing OPENAI_API_KEY in environment');
    }

    const systemPrompt = `You are a structured data processing agent. Output valid JSON ONLY matching schema: ${schemaDescription}.`;
    const url = `${this.baseUrl}/chat/completions`;
    const payload = {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: options?.temperature ?? 0.2,
      max_tokens: options?.maxTokens ?? 2048,
      response_format: { type: 'json_object' }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`[OpenAIProvider] API Error (${response.status}): ${errText}`);
    }

    const json = await response.json() as any;
    let rawText = json?.choices?.[0]?.message?.content || '{}';

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
      throw new Error(`[OpenAIProvider] Failed to parse model output as JSON: ${err.message}. Raw text: ${rawText}`);
    }

    const tokensIn = json?.usage?.prompt_tokens || Math.round(prompt.length / 4);
    const tokensOut = json?.usage?.completion_tokens || Math.round(rawText.length / 4);

    return {
      data: parsedData,
      rawText,
      tokensIn,
      tokensOut,
      durationMs: Date.now() - startTime,
      provider: 'openai',
      model: this.model
    };
  }
}
