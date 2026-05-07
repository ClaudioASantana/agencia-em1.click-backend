# Ollama Integration Guide

Suporte completo para integração com Ollama, permitindo usar modelos de LLM locais como Qwen, Mistral, Llama2, etc.

## 🚀 Quick Start

### 1. Instalar Ollama

```bash
# macOS / Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows (via Scoop)
scoop install ollama

# Ou via WSL
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Baixar um Modelo

```bash
# Qwen 2.5 Coder (Recomendado - 7B, rápido e bom para código)
ollama pull qwen2.5-coder:7b

# Alternativas
ollama pull mistral         # 7B, rápido e versátil
ollama pull llama2          # 7B, bom para chat
ollama pull neural-chat     # 7B, otimizado para conversas
```

### 3. Iniciar Ollama Server

```bash
ollama serve
# Server estará em: http://localhost:11434
```

### 4. Configurar Backend

Adicione ao `.env`:

```bash
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:7b
OLLAMA_TEMPERATURE=0.7
```

### 5. Testar Integração

```bash
npm run start:dev
```

## 📡 API Endpoints

### Health Check
```bash
GET /api/ollama/health
```

Response:
```json
{
  "status": "ok",
  "ready": true,
  "message": "Ollama is ready for requests"
}
```

### List Models
```bash
GET /api/ollama/models
```

### Generate Text
```bash
POST /api/ollama/generate
Content-Type: application/json

{
  "prompt": "Explain TypeScript generics",
  "temperature": 0.7,
  "system": "You are a helpful assistant"
}
```

Response:
```json
{
  "response": "TypeScript generics allow you to write reusable code..."
}
```

### Generate Code
```bash
POST /api/ollama/code
Content-Type: application/json

{
  "prompt": "Create a function that reverses a string",
  "context": "Use TypeScript",
  "temperature": 0.5
}
```

Response:
```json
{
  "code": "function reverseString(str: string): string {\n  return str.split('').reverse().join('');\n}"
}
```

### Chat
```bash
POST /api/ollama/chat
Content-Type: application/json

{
  "message": "What is TypeScript?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hi"
    },
    {
      "role": "assistant",
      "content": "Hello! How can I help you?"
    }
  ]
}
```

### Stream Generation
```bash
POST /api/ollama/generate-stream
Content-Type: application/json

{
  "prompt": "Write a long story about...",
  "temperature": 0.8
}
```

Retorna stream de Server-Sent Events:
```
data: {"chunk": "Once upon a time"}
data: {"chunk": ", there was a..."}
...
data: [DONE]
```

## 🔧 Configuration

### Environment Variables

| Variável | Default | Descrição |
|----------|---------|-----------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | URL do servidor Ollama |
| `OLLAMA_MODEL` | `qwen2.5-coder:7b` | Modelo padrão a usar |
| `OLLAMA_TEMPERATURE` | `0.7` | Criatividade (0=determinístico, 1=criativo) |

### Usar em Services

```typescript
import { OllamaService } from './infrastructure/integrations/ollama.service';

@Injectable()
export class MyService {
  constructor(private ollama: OllamaService) {}

  async generateSomething() {
    const response = await this.ollama.generate('Your prompt here');
    return response;
  }

  async generateCode() {
    const code = await this.ollama.generateCode(
      'Write a function to...',
      'TypeScript, NestJS'
    );
    return code;
  }
}
```

## 📊 Modelos Recomendados

### Para Código
```bash
ollama pull qwen2.5-coder:7b      # ⭐ Recomendado - Especializado em código
ollama pull mistral:latest         # Rápido e versátil
ollama pull neural-chat:latest     # Bom para diálogos
```

### Para Chat
```bash
ollama pull neural-chat:latest     # Otimizado para conversas
ollama pull mistral:latest         # Bom all-around
ollama pull dolphin-mixtral:8x7b   # Qualidade alta (grande)
```

### Configurações de Tamanho
```bash
# Pequeno (2GB RAM)
ollama pull phi:latest
ollama pull orca-mini:latest

# Médio (4-6GB RAM)
ollama pull mistral:latest
ollama pull qwen2.5-coder:7b
ollama pull neural-chat:latest

# Grande (10GB+ RAM)
ollama pull dolphin-mixtral:8x7b
ollama pull llama2:70b
```

## 🐛 Troubleshooting

### Ollama não está acessível

```bash
# Verifique se o servidor está rodando
curl http://localhost:11434/api/tags

# Se erro de conexão recusada, inicie Ollama
ollama serve
```

### Modelo não encontrado

```bash
# Liste modelos disponíveis
ollama list

# Baixe o modelo
ollama pull qwen2.5-coder:7b

# Ou selecione outro modelo no .env
```

### Resposta lenta

1. Reduza `OLLAMA_TEMPERATURE` (0.5 é mais rápido)
2. Use modelo menor (orca-mini, phi)
3. Aumente RAM disponível
4. Rode Ollama com GPU se disponível:
   ```bash
   CUDA_VISIBLE_DEVICES=0 ollama serve
   ```

### Out of Memory

Escolha modelo menor:
```bash
# Ao invés de 70B, use 7B
ollama pull mistral:latest  # 7B
ollama pull orca-mini:latest # 3B
```

## 🎯 Use Cases

### 1. Code Generation
```typescript
const code = await ollama.generateCode(
  'Create a function that validates email'
);
```

### 2. Code Review
```typescript
const review = await ollama.generate(
  `Review this code:\n${codeSnippet}`,
  { system: 'You are a code reviewer' }
);
```

### 3. Documentation Generation
```typescript
const docs = await ollama.generateCode(
  'Generate JSDoc comments for this function',
  functionCode
);
```

### 4. Real-time Chat
```typescript
for await (const chunk of ollama.streamGenerate(prompt)) {
  console.log(chunk);
}
```

## 📚 Recursos

- [Ollama Official](https://ollama.ai)
- [Available Models](https://ollama.ai/library)
- [Ollama GitHub](https://github.com/ollama/ollama)
- [Qwen Models](https://ollama.ai/library/qwen)

## ✅ Status

- ✅ Local model support (Qwen, Mistral, Llama2, etc)
- ✅ REST API endpoints
- ✅ Streaming support
- ✅ Chat support
- ✅ Code generation optimized
- ✅ NestJS integration
- ✅ Environment configuration
- 🔄 GPU acceleration (coming)
- 🔄 Model switching (coming)
- 🔄 Response caching (coming)
