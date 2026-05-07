/**
 * Ollama Controller
 *
 * Provides REST endpoints for Ollama integration
 * - Health check
 * - List models
 * - Generate text
 * - Generate code
 * - Chat
 */

import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OllamaService } from './ollama.service';

@ApiTags('Ollama')
@Controller('api/ollama')
export class OllamaController {
  constructor(private ollamaService: OllamaService) {}

  /**
   * GET /api/ollama/health
   * Check Ollama server health
   */
  @Get('health')
  @ApiOperation({ summary: 'Check Ollama server health' })
  @ApiResponse({
    status: 200,
    description: 'Ollama server is healthy',
    schema: { example: { status: 'ok', ready: true } },
  })
  @ApiResponse({
    status: 503,
    description: 'Ollama server is not available',
  })
  health() {
    if (!this.ollamaService.isHealthy()) {
      throw new BadRequestException('Ollama server is not available');
    }

    return {
      status: 'ok',
      ready: true,
      message: 'Ollama is ready for requests',
    };
  }

  /**
   * GET /api/ollama/models
   * List available models
   */
  @Get('models')
  @ApiOperation({ summary: 'List available Ollama models' })
  @ApiResponse({
    status: 200,
    description: 'List of available models',
    schema: { example: { models: ['qwen2.5-coder:7b', 'mistral', 'llama2'] } },
  })
  async listModels() {
    const models = await this.ollamaService.listModels();
    return { models };
  }

  /**
   * POST /api/ollama/pull-model
   * Pull a model from registry
   */
  @Post('pull-model')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Pull a model from Ollama registry' })
  @ApiResponse({
    status: 202,
    description: 'Model pull started',
  })
  async pullModel(@Body() { model }: { model: string }) {
    if (!model) {
      throw new BadRequestException('Model name is required');
    }

    // Start async pull
    this.ollamaService.pullModel(model).catch((err) => {
      console.error(`Failed to pull model ${model}:`, err.message);
    });

    return {
      status: 'pulling',
      model,
      message: `Model pull started in background: ${model}`,
    };
  }

  /**
   * POST /api/ollama/generate
   * Generate text from prompt
   */
  @Post('generate')
  @ApiOperation({ summary: 'Generate text from prompt' })
  @ApiResponse({
    status: 200,
    description: 'Generated text',
    schema: { example: { response: 'Generated text here...' } },
  })
  async generate(
    @Body()
    {
      prompt,
      system,
      temperature,
      model,
    }: {
      prompt: string;
      system?: string;
      temperature?: number;
      model?: string;
    },
  ) {
    if (!prompt) {
      throw new BadRequestException('Prompt is required');
    }

    const response = await this.ollamaService.generate(prompt, {
      system,
      temperature,
      model,
    });

    return { response };
  }

  /**
   * POST /api/ollama/code
   * Generate code
   */
  @Post('code')
  @ApiOperation({ summary: 'Generate code from prompt' })
  @ApiResponse({
    status: 200,
    description: 'Generated code',
    schema: { example: { code: 'function hello() { ... }' } },
  })
  async generateCode(
    @Body()
    {
      prompt,
      context,
      temperature,
      model,
    }: {
      prompt: string;
      context?: string;
      temperature?: number;
      model?: string;
    },
  ) {
    if (!prompt) {
      throw new BadRequestException('Prompt is required');
    }

    const code = await this.ollamaService.generateCode(prompt, context, {
      temperature,
      model,
    });

    return { code };
  }

  /**
   * POST /api/ollama/chat
   * Chat with model
   */
  @Post('chat')
  @ApiOperation({ summary: 'Chat with Ollama model' })
  @ApiResponse({
    status: 200,
    description: 'Chat response',
    schema: { example: { response: 'Response text...' } },
  })
  async chat(
    @Body()
    {
      message,
      conversationHistory,
      temperature,
      model,
    }: {
      message: string;
      conversationHistory?: Array<{ role: 'user' | 'system' | 'assistant'; content: string }>;
      temperature?: number;
      model?: string;
    },
  ) {
    if (!message) {
      throw new BadRequestException('Message is required');
    }

    const response = await this.ollamaService.chat(message, conversationHistory, {
      temperature,
      model,
    });

    return { response };
  }

  /**
   * POST /api/ollama/generate-stream
   * Stream generation for long responses
   */
  @Post('generate-stream')
  @ApiOperation({ summary: 'Stream generated text' })
  @ApiResponse({
    status: 200,
    description: 'Streamed text response',
  })
  async generateStream(
    @Body()
    {
      prompt,
      system,
      temperature,
      model,
    }: {
      prompt: string;
      system?: string;
      temperature?: number;
      model?: string;
    },
    @Res() res: Response,
  ) {
    if (!prompt) {
      throw new BadRequestException('Prompt is required');
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const generator = this.ollamaService.streamGenerate(prompt, {
        system,
        temperature,
        model,
      });

      for await (const chunk of generator) {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }

  /**
   * GET /api/ollama/model-info
   * Get current model information
   */
  @Get('model-info')
  @ApiOperation({ summary: 'Get current model information' })
  @ApiResponse({
    status: 200,
    description: 'Model information',
  })
  async getModelInfo() {
    return await this.ollamaService.getModelInfo();
  }
}
