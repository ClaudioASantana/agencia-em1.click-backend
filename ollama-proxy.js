/**
 * OpenAI-Compatible Proxy for Ollama
 *
 * Allows Roo Code and other tools that expect OpenAI API
 * to work with local Ollama models.
 *
 * Usage:
 *   node ollama-proxy.js
 *
 * Server will listen on http://localhost:8000
 * Configure Roo Code to use:
 *   - Provider: OpenAI-compatible
 *   - Base URL: http://localhost:8000
 *   - API Key: (any value, can be empty)
 *   - Model: qwen2.5-coder:7b (or your Ollama model)
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// Configuration
const PROXY_PORT = process.env.PROXY_PORT || 8000;
const OLLAMA_BASE = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b';

console.log(`🚀 OpenAI-Compatible Ollama Proxy`);
console.log(`   Proxy: http://localhost:${PROXY_PORT}`);
console.log(`   Ollama: ${OLLAMA_BASE}`);
console.log(`   Model: ${DEFAULT_MODEL}`);
console.log('');

/**
 * Convert OpenAI message format to Ollama format
 */
function convertMessagesToOllama(messages) {
  return messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content,
  }));
}

/**
 * Convert Ollama response to OpenAI format
 */
function convertOllamaToOpenAI(ollamaResponse, model) {
  return {
    id: `chatcmpl-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: model,
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: ollamaResponse.message?.content || '',
        },
        finish_reason: 'stop',
      },
    ],
    usage: {
      prompt_tokens: ollamaResponse.prompt_eval_count || 0,
      completion_tokens: ollamaResponse.eval_count || 0,
      total_tokens:
        (ollamaResponse.prompt_eval_count || 0) +
        (ollamaResponse.eval_count || 0),
    },
  };
}

/**
 * Proxy request to Ollama
 */
async function proxyRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const isHttps = OLLAMA_BASE.startsWith('https');
    const http_module = isHttps ? https : http;

    const url = new URL(OLLAMA_BASE + path);

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      const bodyStr = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = http_module.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

/**
 * Handle /v1/chat/completions
 */
async function handleChatCompletion(req, res, body) {
  try {
    const model = body.model || DEFAULT_MODEL;
    const messages = body.messages || [];
    const temperature = body.temperature ?? 0.7;

    console.log(`[CHAT] Model: ${model}, Messages: ${messages.length}`);

    // Convert to Ollama format
    const ollamaMessages = convertMessagesToOllama(messages);

    // Request to Ollama
    const ollamaResponse = await proxyRequest('POST', '/api/chat', {
      model: model,
      messages: ollamaMessages,
      stream: false,
      temperature: temperature,
    });

    if (ollamaResponse.status !== 200) {
      res.writeHead(ollamaResponse.status, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          error: {
            message: `Ollama error: ${ollamaResponse.status}`,
            type: 'server_error',
          },
        })
      );
      return;
    }

    // Convert to OpenAI format
    const openaiResponse = convertOllamaToOpenAI(ollamaResponse.data, model);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(openaiResponse));
  } catch (error) {
    console.error('[ERROR]', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        error: {
          message: error.message,
          type: 'server_error',
        },
      })
    );
  }
}

/**
 * Handle /v1/models
 */
async function handleModels(req, res) {
  try {
    const ollamaResponse = await proxyRequest('GET', '/api/tags', null);

    if (ollamaResponse.status !== 200) {
      res.writeHead(ollamaResponse.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ data: [] }));
      return;
    }

    const models = (ollamaResponse.data.models || []).map((m) => ({
      id: m.name,
      object: 'model',
      created: Math.floor(new Date(m.modified_at).getTime() / 1000) || 0,
      owned_by: 'ollama',
    }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ data: models, object: 'list' }));
  } catch (error) {
    console.error('[ERROR]', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        data: [],
        error: error.message,
      })
    );
  }
}

/**
 * Main server
 */
const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse body
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const bodyJson = body ? JSON.parse(body) : {};

      // Route requests
      if (req.method === 'POST' && req.url === '/v1/chat/completions') {
        await handleChatCompletion(req, res, bodyJson);
      } else if (req.method === 'GET' && req.url === '/v1/models') {
        await handleModels(req, res);
      } else if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    } catch (error) {
      console.error('[ERROR]', error.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          error: {
            message: error.message,
            type: 'server_error',
          },
        })
      );
    }
  });
});

server.listen(PROXY_PORT, () => {
  console.log(`✅ Proxy listening on http://localhost:${PROXY_PORT}`);
  console.log('');
  console.log('Configure Roo Code with:');
  console.log('  - Provider: OpenAI-compatible');
  console.log(`  - Base URL: http://localhost:${PROXY_PORT}`);
  console.log('  - API Key: (leave empty or use any value)');
  console.log(`  - Model: ${DEFAULT_MODEL}`);
  console.log('');
  console.log('Then restart VS Code to apply changes.');
  console.log('');
});

process.on('SIGINT', () => {
  console.log('\n🛑 Proxy stopped');
  process.exit(0);
});
