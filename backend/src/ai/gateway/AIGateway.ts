import { AIProvider, AIProviderOptions, AIGenerateResult } from '../providers/AIProvider.js';
import { MockAIProvider } from '../providers/MockAIProvider.js';
import { GeminiProvider } from '../providers/GeminiProvider.js';
import { OpenAIProvider } from '../providers/OpenAIProvider.js';
import { Database } from '../../database/connection.js';

export class AIGateway {
  private static providerInstance: AIProvider | null = null;
  private static fallbackProvider: AIProvider = new MockAIProvider();

  public static getProvider(): AIProvider {
    if (!AIGateway.providerInstance) {
      const explicitProvider = (process.env.AI_PROVIDER || '').toLowerCase();

      if (explicitProvider === 'gemini' || (!explicitProvider && (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY))) {
        try {
          AIGateway.providerInstance = new GeminiProvider();
          console.log('[AIGateway] Initialized GeminiProvider as primary AI engine');
        } catch (err) {
          console.warn('[AIGateway] Failed to initialize GeminiProvider, falling back to mock:', err);
          AIGateway.providerInstance = new MockAIProvider();
        }
      } else if (explicitProvider === 'openai' || (!explicitProvider && process.env.OPENAI_API_KEY)) {
        try {
          AIGateway.providerInstance = new OpenAIProvider();
          console.log('[AIGateway] Initialized OpenAIProvider as primary AI engine');
        } catch (err) {
          console.warn('[AIGateway] Failed to initialize OpenAIProvider, falling back to mock:', err);
          AIGateway.providerInstance = new MockAIProvider();
        }
      } else {
        AIGateway.providerInstance = new MockAIProvider();
      }
    }
    return AIGateway.providerInstance;
  }

  public static setProvider(provider: AIProvider): void {
    AIGateway.providerInstance = provider;
  }

  public static getActiveProviderInfo(): { name: string; isLive: boolean } {
    const provider = AIGateway.getProvider();
    const isLive = provider.name === 'GeminiProvider' || provider.name === 'OpenAIProvider';
    return {
      name: provider.name,
      isLive
    };
  }

  public static async executePrompt<T = string>(params: {
    userId?: string;
    endpoint: string;
    promptName: string;
    promptVersion: string;
    renderedPrompt: string;
    isStructured: boolean;
    schemaDescription?: string;
    options?: AIProviderOptions;
  }): Promise<AIGenerateResult<T>> {
    let provider = AIGateway.getProvider();
    let result: AIGenerateResult<any>;

    try {
      if (params.isStructured) {
        result = await provider.generateStructured<T>(
          params.renderedPrompt,
          params.schemaDescription || '',
          params.options
        );
      } else {
        result = await provider.generateText(params.renderedPrompt, params.options);
      }
    } catch (primaryErr: any) {
      if (provider.name !== 'MockAIProvider') {
        console.warn(`[AIGateway] Primary provider ${provider.name} failed (${primaryErr.message}). Engaging resilient MockAIProvider fallback.`);
        if (params.isStructured) {
          result = await AIGateway.fallbackProvider.generateStructured<T>(
            params.renderedPrompt,
            params.schemaDescription || '',
            params.options
          );
        } else {
          result = await AIGateway.fallbackProvider.generateText(params.renderedPrompt, params.options);
        }
      } else {
        throw primaryErr;
      }
    }

    // Record token and usage tracking in database
    try {
      const userExists = params.userId ? Database.queryOne('SELECT id FROM users WHERE id = ?', [params.userId]) : null;
      const validUserId = userExists ? params.userId : null;

      Database.execute(
        `INSERT INTO ai_usage_logs (
          id, user_id, endpoint, provider, model, prompt_name, prompt_version,
          tokens_in, tokens_out, duration_ms, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `ai_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          validUserId,
          params.endpoint,
          result.provider,
          result.model,
          params.promptName,
          params.promptVersion,
          result.tokensIn,
          result.tokensOut,
          result.durationMs,
          new Date().toISOString()
        ]
      );
    } catch (e) {
      console.warn('[AIGateway] Failed to write usage log:', e);
    }

    return result as AIGenerateResult<T>;
  }
}
