export interface AIProviderOptions {
  maxTokens?: number;
  temperature?: number;
  stopSequences?: string[];
}

export interface AIGenerateResult<T = string> {
  data: T;
  rawText: string;
  tokensIn: number;
  tokensOut: number;
  durationMs: number;
  provider: string;
  model: string;
}

export interface AIProvider {
  readonly name: string;
  generateText(prompt: string, options?: AIProviderOptions): Promise<AIGenerateResult<string>>;
  generateStructured<T>(prompt: string, schemaDescription: string, options?: AIProviderOptions): Promise<AIGenerateResult<T>>;
}
