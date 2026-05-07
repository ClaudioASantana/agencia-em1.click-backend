/**
 * Ollama Service
 *
 * Provides high-level interface for Ollama operations
 * including model management, generation, and caching.
 */

import {
  Injectable,
  Logger,
  OnModuleInit,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OllamaProvider, OllamaMessage } from './ollama.provider';

@Injectable()
export class OllamaService implements OnModuleInit {
  private readonly logger = new Logger(OllamaService.name);
  private provider: OllamaProvider;
  private isReady = false;

  constructor(
    private configService: ConfigService,
    private ollamaProvider: OllamaProvider,
  ) {
    this.provider = ollamaProvider;
  }

  async onModuleInit() {
    try {
      const isHealthy = await this.provider.isHealthy();
      if (isHealthy) {
        this.isReady = true;
        this.logger.log('✅ Ollama server is healthy and ready');

        // Ensure model is available
        const models = await this.provider.listModels();
        const requiredModel = process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b';

        if (!models.includes(requiredModel)) {
          this.logger.warn(`Model ${requiredModel} not found. Available models: ${models.join(', ')}`);
          this.logger.warn(`Pull model with: ollama pull ${requiredModel}`);
        }
      } else {
        this.isReady = false;
        this.logger.warn('⚠️ Ollama server is not reachable');
        this.logger.warn('Make sure Ollama is running: ollama serve');
      }
    } catch (error) {
      this.isReady = false;
      this.logger.error(`Failed to initialize Ollama: ${error.message}`);
    }
  }

  /**
   * Check if Ollama is ready
   */
  isHealthy(): boolean {
    return this.isReady;
  }

  /**
   * Get list of available models
   */
  async listModels(): Promise<string[]> {
    if (!this.isReady) {
      throw new BadRequestException('Ollama service is not available');
    }

    try {
      return await this.provider.listModels();
    } catch (error) {
      this.logger.error(`Error listing models: ${error.message}`);
      throw new BadRequestException('Failed to list Ollama models');
    }
  }

  /**
   * Pull a model from registry
   */
  async pullModel(modelName: string): Promise<void> {
    if (!this.isReady) {
      throw new BadRequestException('Ollama service is not available');
    }

    try {
      this.logger.log(`Pulling model: ${modelName}...`);
      await this.provider.pullModel(modelName);
      this.logger.log(`✅ Model pulled successfully: ${modelName}`);
    } catch (error) {
      this.logger.error(`Error pulling model: ${error.message}`);
      throw new BadRequestException(`Failed to pull model: ${error.message}`);
    }
  }

  /**
   * Generate text response
   */
  async generate(
    prompt: string,
    options?: {
      system?: string;
      temperature?: number;
      model?: string;
    },
  ): Promise<string> {
    if (!this.isReady) {
      throw new BadRequestException('Ollama service is not available');
    }

    try {
      this.logger.debug(`Generating response for: ${prompt.substring(0, 100)}...`);
      const response = await this.provider.generate(prompt, options);
      return response;
    } catch (error) {
      this.logger.error(`Generation failed: ${error.message}`);
      throw new BadRequestException(`Generation failed: ${error.message}`);
    }
  }

  /**
   * Generate code with context
   */
  async generateCode(
    prompt: string,
    context?: string,
    options?: {
      temperature?: number;
      model?: string;
    },
  ): Promise<string> {
    if (!this.isReady) {
      throw new BadRequestException('Ollama service is not available');
    }

    try {
      this.logger.debug(`Generating code: ${prompt.substring(0, 100)}...`);
      return await this.provider.completeCode(prompt, context);
    } catch (error) {
      this.logger.error(`Code generation failed: ${error.message}`);
      throw new BadRequestException(`Code generation failed: ${error.message}`);
    }
  }

  /**
   * Chat with Ollama model
   */
  async chat(
    message: string,
    conversationHistory?: OllamaMessage[],
    options?: {
      temperature?: number;
      model?: string;
    },
  ): Promise<string> {
    if (!this.isReady) {
      throw new BadRequestException('Ollama service is not available');
    }

    try {
      this.logger.debug(`Chat: ${message.substring(0, 100)}...`);
      return await this.provider.chat(message, conversationHistory);
    } catch (error) {
      this.logger.error(`Chat failed: ${error.message}`);
      throw new BadRequestException(`Chat failed: ${error.message}`);
    }
  }

  /**
   * Stream generation (for long responses)
   */
  async *streamGenerate(
    prompt: string,
    options?: {
      system?: string;
      temperature?: number;
      model?: string;
    },
  ): AsyncGenerator<string> {
    if (!this.isReady) {
      throw new BadRequestException('Ollama service is not available');
    }

    this.logger.debug(`Streaming generation: ${prompt.substring(0, 100)}...`);

    try {
      yield* this.provider.generateStream(prompt, options);
    } catch (error) {
      this.logger.error(`Stream generation failed: ${error.message}`);
      throw new BadRequestException(`Stream generation failed: ${error.message}`);
    }
  }

  /**
   * Get current model info
   */
  async getModelInfo(): Promise<any> {
    if (!this.isReady) {
      throw new BadRequestException('Ollama service is not available');
    }

    try {
      return await this.provider.getModelInfo();
    } catch (error) {
      this.logger.error(`Error getting model info: ${error.message}`);
      throw new BadRequestException('Failed to get model info');
    }
  }

  /**
   * Delete a model
   */
  async deleteModel(modelName: string): Promise<void> {
    if (!this.isReady) {
      throw new BadRequestException('Ollama service is not available');
    }

    try {
      await this.provider.deleteModel(modelName);
      this.logger.log(`Model deleted: ${modelName}`);
    } catch (error) {
      this.logger.error(`Error deleting model: ${error.message}`);
      throw new BadRequestException(`Failed to delete model: ${error.message}`);
    }
  }
}
