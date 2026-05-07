/**
 * Ollama LLM Integration
 *
 * Provides integration with local Ollama instances for cost-free
 * model inference using models like Qwen, Mistral, Llama2, etc.
 *
 * @see https://ollama.ai
 */

import axios, { AxiosInstance } from 'axios';

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  message: OllamaMessage;
  done: boolean;
  done_reason?: string;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaStreamChunk {
  model: string;
  created_at: string;
  message: OllamaMessage;
  done: boolean;
}

export interface OllamaGenerateOptions {
  model: string;
  messages: OllamaMessage[];
  stream?: boolean;
  temperature?: number;
  top_k?: number;
  top_p?: number;
  repeat_last_n?: number;
  num_predict?: number;
  system?: string;
}

export class OllamaProvider {
  private client: AxiosInstance;
  private baseUrl: string;
  private model: string;
  private temperature: number;

  /**
   * Initialize Ollama provider
   * @param baseUrl - Ollama server URL (default: http://localhost:11434)
   * @param model - Model name to use (default from env or qwen2.5-coder:7b)
   * @param temperature - Response temperature (0-1, default: 0.7)
   */
  constructor(
    baseUrl: string = process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: string = process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b',
    temperature: number = parseFloat(process.env.OLLAMA_TEMPERATURE || '0.7'),
  ) {
    this.baseUrl = baseUrl;
    this.model = model;
    this.temperature = temperature;

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 300000, // 5 minutes for long-running generations
    });
  }

  /**
   * Check if Ollama server is accessible
   */
  async isHealthy(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/tags');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get list of available models
   */
  async listModels(): Promise<string[]> {
    try {
      const response = await this.client.get('/api/tags');
      return response.data.models?.map((m: any) => m.name) || [];
    } catch (error) {
      throw new Error(`Failed to list Ollama models: ${error.message}`);
    }
  }

  /**
   * Pull a model from Ollama registry
   */
  async pullModel(modelName: string): Promise<void> {
    try {
      await this.client.post('/api/pull', { name: modelName });
    } catch (error) {
      throw new Error(`Failed to pull model ${modelName}: ${error.message}`);
    }
  }

  /**
   * Generate response from Ollama (streaming or non-streaming)
   */
  async generate(
    prompt: string,
    options?: Partial<OllamaGenerateOptions>,
  ): Promise<string> {
    const fullOptions: OllamaGenerateOptions = {
      model: options?.model || this.model,
      messages: [
        ...(options?.messages || [
          {
            role: 'system' as const,
            content: options?.system || 'You are a helpful coding assistant.',
          },
        ]),
        {
          role: 'user',
          content: prompt,
        },
      ],
      stream: false,
      temperature: options?.temperature ?? this.temperature,
      top_k: options?.top_k,
      top_p: options?.top_p,
      repeat_last_n: options?.repeat_last_n,
      num_predict: options?.num_predict,
    };

    try {
      const response = await this.client.post<OllamaResponse>(
        '/api/chat',
        fullOptions,
      );

      if (response.data.message?.content) {
        return response.data.message.content;
      }

      throw new Error('No content in response');
    } catch (error) {
      throw new Error(`Ollama generation failed: ${error.message}`);
    }
  }

  /**
   * Generate response with streaming
   * Yields chunks as they arrive
   */
  async *generateStream(
    prompt: string,
    options?: Partial<OllamaGenerateOptions>,
  ): AsyncGenerator<string> {
    const fullOptions: OllamaGenerateOptions = {
      model: options?.model || this.model,
      messages: [
        ...(options?.messages || [
          {
            role: 'system' as const,
            content: options?.system || 'You are a helpful coding assistant.',
          },
        ]),
        {
          role: 'user',
          content: prompt,
        },
      ],
      stream: true,
      temperature: options?.temperature ?? this.temperature,
    };

    try {
      const response = await this.client.post('/api/chat', fullOptions, {
        responseType: 'stream',
      });

      let buffer = '';

      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk: Buffer) => {
          buffer += chunk.toString();
          const lines = buffer.split('\n');

          // Process complete lines
          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (line) {
              try {
                const parsed = JSON.parse(line) as OllamaStreamChunk;
                if (parsed.message?.content) {
                  resolve((async function* gen() {
                    yield parsed.message.content;
                  })());
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }

          // Keep incomplete line in buffer
          buffer = lines[lines.length - 1];
        });

        response.data.on('end', () => {
          resolve((async function* gen() {
            yield '';
          })());
        });

        response.data.on('error', (error: Error) => {
          reject(new Error(`Stream error: ${error.message}`));
        });
      });
    } catch (error) {
      throw new Error(`Ollama stream failed: ${error.message}`);
    }
  }

  /**
   * Complete code generation
   * Optimized for code tasks
   */
  async completeCode(prompt: string, context?: string): Promise<string> {
    const systemPrompt = `You are an expert coding assistant. ${context ? `Context: ${context}` : ''}
Generate high-quality, well-structured code.`;

    return this.generate(prompt, { system: systemPrompt });
  }

  /**
   * Chat-style interaction
   */
  async chat(message: string, conversationHistory?: OllamaMessage[]): Promise<string> {
    return this.generate(message, {
      messages: conversationHistory,
    });
  }

  /**
   * Get model info
   */
  async getModelInfo(): Promise<any> {
    try {
      const response = await this.client.post('/api/show', {
        name: this.model,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to get model info for ${this.model}: ${error.message}`,
      );
    }
  }

  /**
   * Delete/remove a model
   */
  async deleteModel(modelName: string): Promise<void> {
    try {
      await this.client.delete('/api/delete', {
        data: { name: modelName },
      });
    } catch (error) {
      throw new Error(`Failed to delete model ${modelName}: ${error.message}`);
    }
  }
}

/**
 * Singleton instance
 */
let ollamaInstance: OllamaProvider | null = null;

export function getOllamaProvider(): OllamaProvider {
  if (!ollamaInstance) {
    ollamaInstance = new OllamaProvider();
  }
  return ollamaInstance;
}

export function createOllamaProvider(
  baseUrl?: string,
  model?: string,
  temperature?: number,
): OllamaProvider {
  return new OllamaProvider(baseUrl, model, temperature);
}
