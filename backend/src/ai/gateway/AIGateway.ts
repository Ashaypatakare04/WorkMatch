import { AIProvider, AIProviderOptions, AIGenerateResult } from '../providers/AIProvider.js';
import { MockAIProvider } from '../providers/MockAIProvider.js';
import { Database } from '../../database/connection.js';

export class AIGateway {
  private static providerInstance: AIProvider | null = null;

  public static getProvider(): AIProvider {
    if (!AIGateway.providerInstance) {
      // Default to MockAIProvider for zero-cost, instant, reliable local performance
      AIGateway.providerInstance = new MockAIProvider();
    }
    return AIGateway.providerInstance;
  }

  public static setProvider(provider: AIProvider): void {
    AIGateway.providerInstance = provider;
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
    const provider = AIGateway.getProvider();
    let result: AIGenerateResult<any>;

    if (params.isStructured) {
      result = await provider.generateStructured<T>(
        params.renderedPrompt,
        params.schemaDescription || '',
        params.options
      );
    } else {
      result = await provider.generateText(params.renderedPrompt, params.options);
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
