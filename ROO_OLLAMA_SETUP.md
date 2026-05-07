# Como Usar Roo Code com Ollama

## O Problema

Roo Code não suporta Ollama nativamente. Ele só funciona com:
- OpenAI (GPT)
- Anthropic (Claude)
- Google (Gemini)
- E outros provedores de API

## A Solução: Proxy OpenAI-Compatible

Criamos um **proxy local** que:
1. Recebe requisições em formato OpenAI (que Roo Code usa)
2. Converte para formato Ollama
3. Envia para Ollama local
4. Retorna a resposta em formato OpenAI

## 🚀 Setup Rápido

### 1. Instalar e Iniciar Ollama

```bash
# Instalar
curl -fsSL https://ollama.ai/install.sh | sh

# Baixar modelo
ollama pull qwen2.5-coder:7b

# Iniciar servidor (em outro terminal)
ollama serve
# Estará em: http://localhost:11434
```

### 2. Iniciar o Proxy

```bash
# Em outro terminal, na raiz do projeto
node ollama-proxy.js

# Ou com variáveis de ambiente customizadas
PROXY_PORT=8000 OLLAMA_BASE_URL=http://localhost:11434 OLLAMA_MODEL=qwen2.5-coder:7b node ollama-proxy.js
```

Você verá:
```
🚀 OpenAI-Compatible Ollama Proxy
   Proxy: http://localhost:8000
   Ollama: http://localhost:11434
   Model: qwen2.5-coder:7b

✅ Proxy listening on http://localhost:8000
```

### 3. Configurar Roo Code

No **VS Code Settings (Cmd+,)**, procure por "Roo" e configure:

#### Option A: Direct Settings (Recomendado)

1. Abra Command Palette: `Cmd+Shift+P`
2. Digite: `Roo: Select model provider`
3. Selecione: `OpenAI-compatible`
4. Configure:
   ```
   Base URL: http://localhost:8000
   API Key: (deixe vazio ou coloque qualquer coisa)
   Model: qwen2.5-coder:7b (ou seu modelo Ollama)
   ```

#### Option B: settings.json

Adicione ao `.vscode/settings.json`:

```json
{
  "roo.modelProvider": "openai-compatible",
  "roo.openaiCompatible": {
    "baseUrl": "http://localhost:8000",
    "apiKey": "",
    "model": "qwen2.5-coder:7b"
  }
}
```

### 4. Reiniciar VS Code

```bash
Cmd+Shift+P -> Developer: Reload Window
```

### 5. Testar

Abra um arquivo e use Roo Code como normal. Ele agora vai usar seu modelo Ollama local!

## 📋 Variáveis de Ambiente

```bash
# Porta do proxy
PROXY_PORT=8000

# URL base do Ollama
OLLAMA_BASE_URL=http://localhost:11434

# Modelo padrão
OLLAMA_MODEL=qwen2.5-coder:7b
```

## 🔄 Fluxo da Requisição

```
Roo Code
   ↓
   └─→ POST http://localhost:8000/v1/chat/completions
       (formato OpenAI)
       ↓
       │ Proxy converte para Ollama
       ↓
       └─→ POST http://localhost:11434/api/chat
           (formato Ollama)
           ↓
           └─→ Ollama Model (qwen2.5-coder:7b)
               ↓
               └─→ Resposta
       ↓
       │ Proxy converte para OpenAI
       ↓
       ← Roo Code recebe resposta
```

## 📊 Modelos Testados

| Modelo | Tamanho | Vídeo RAM | Qualidade | Velocidade |
|--------|---------|-----------|-----------|-----------|
| `qwen2.5-coder:7b` ⭐ | 4.7GB | 3GB | Excelente | Rápida |
| `mistral:latest` | 4.1GB | 3GB | Boa | Muito Rápida |
| `neural-chat:latest` | 3.7GB | 2.5GB | Boa | Muito Rápida |
| `phi:latest` | 1.6GB | 1.5GB | Básica | Extremamente Rápida |

## 🔧 Troubleshooting

### Proxy não conecta em Ollama

```bash
# Verifique se Ollama está rodando
curl http://localhost:11434/api/tags

# Se não funcionar, reinicie Ollama
ollama serve
```

### Roo Code não vê o proxy

1. Verifique se proxy está rodando: `curl http://localhost:8000/health`
2. Reinicie VS Code: `Cmd+Shift+P` → `Developer: Reload Window`
3. Verifique logs do proxy para erros

### Resposta muito lenta

- Use modelo menor: `phi:latest`, `orca-mini:latest`
- Aumente RAM disponível
- Rode Ollama com GPU (se disponível)

### "Connection refused"

```bash
# Verifique a porta
netstat -an | grep 8000

# Se ocupada, use outra porta
PROXY_PORT=8001 node ollama-proxy.js
```

## 📚 Recursos Adicionais

- [Roo Code Docs](https://roo.dev)
- [Ollama Models](https://ollama.ai/library)
- [OpenAI API Docs](https://platform.openai.com/docs)

## ⚙️ Instalação Automática

Se desejar instalar como serviço (macOS/Linux):

```bash
# Criar arquivo de serviço
cat > ~/.config/systemd/user/ollama-proxy.service <<EOF
[Unit]
Description=Ollama OpenAI Proxy
After=network-online.target

[Service]
Type=simple
WorkingDirectory=$PWD
ExecStart=/usr/bin/node ollama-proxy.js
Restart=always
RestartSec=10

[Install]
WantedBy=default.target
EOF

# Ativar
systemctl --user daemon-reload
systemctl --user enable ollama-proxy
systemctl --user start ollama-proxy

# Verificar status
systemctl --user status ollama-proxy
```

## 🎯 Próximas Steps

1. ✅ Configure o proxy
2. ✅ Reinicie VS Code
3. ✅ Use Roo Code normalmente
4. 🎉 Aproveite seu modelo local grátis!

---

**Dúvidas?** Deixe um issue ou consulte os logs do proxy para mais detalhes.
