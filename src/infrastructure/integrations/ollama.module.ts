/**
 * Ollama Module
 *
 * NestJS module that provides Ollama LLM integration
 * for the application.
 *
 * Usage:
 *   1. Import OllamaModule in your app.module.ts
 *   2. Inject OllamaService where needed
 *   3. Call service methods like generate(), chat(), completeCode()
 */

import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OllamaService } from './ollama.service';
import { OllamaProvider } from './ollama.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: OllamaProvider,
      useFactory: (logger: Logger) => {
        const provider = new OllamaProvider();
        logger.log(`[Ollama] Configured at ${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}`);
        logger.log(`[Ollama] Model: ${process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b'}`);
        return provider;
      },
      inject: [Logger],
    },
    OllamaService,
    Logger,
  ],
  exports: [OllamaService],
})
export class OllamaModule {}
