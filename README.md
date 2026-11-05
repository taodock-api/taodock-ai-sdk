# TaoDock provider for the Vercel AI SDK

Use TaoDock's OpenAI-compatible API with the [Vercel AI SDK](https://ai-sdk.dev).

通过 [Vercel AI SDK](https://ai-sdk.dev) 调用众妙之门 TaoDock 的 OpenAI 兼容 API。

## Install / 安装

```bash
npm install @taodock/ai-sdk-provider ai
```

## Use / 使用

Create an API key at [TaoDock API Keys](https://taodock.com/keys), keep it in a server-side environment variable, and choose a model ID available to that key from [TaoDock Models](https://taodock.com/models).

在[众妙之门 TaoDock API 密钥](https://taodock.com/keys)创建密钥，将其保存在服务端环境变量中，并从 [TaoDock 模型](https://taodock.com/models)选择该密钥可用的模型 ID。

```bash
export TAODOCK_API_KEY='your-api-key'
```

```ts
import { generateText } from 'ai'
import { taodock } from '@taodock/ai-sdk-provider'

const { text } = await generateText({
  model: taodock('YOUR_MODEL_ID'),
  prompt: 'Write a haiku about a harbor.',
})

console.log(text)
```

The default provider sends requests to `https://taodock.com/v1` and reads `TAODOCK_API_KEY` when each request is sent. Do not expose an API key in browser code or a public client bundle.

默认 Provider 请求 `https://taodock.com/v1`，并在每次发送请求时读取 `TAODOCK_API_KEY`。请勿在浏览器代码或公开客户端包中暴露 API 密钥。

## Configuration / 配置

```ts
import { createTaoDock } from '@taodock/ai-sdk-provider'

const taodock = createTaoDock({
  apiKey: process.env.TAODOCK_API_KEY,
  baseURL: 'https://taodock.com/v1',
  headers: { 'X-Application': 'example-service' },
})
```

| Option | Description |
| --- | --- |
| `apiKey` | TaoDock API key. Defaults to `TAODOCK_API_KEY`. |
| `baseURL` | Full OpenAI-compatible API prefix. Defaults to `TAODOCK_BASE_URL`, then `https://taodock.com/v1`. |
| `headers` | Additional request headers. |
| `fetch` | Custom Fetch implementation for testing or middleware. |

Chat models are available through `taodock(modelId)`, `taodock.languageModel(modelId)`, or `taodock.chatModel(modelId)`. Model capabilities depend on the selected model and its TaoDock channel configuration.

聊天模型可通过 `taodock(modelId)`、`taodock.languageModel(modelId)` 或 `taodock.chatModel(modelId)` 使用。具体能力取决于所选模型及其在 TaoDock 中的渠道配置。

## Links / 链接

- [Documentation / 文档](https://docs.taodock.com)
- [API keys / API 密钥](https://taodock.com/keys)
- [Models / 模型](https://taodock.com/models)
- [Usage logs / 使用日志](https://taodock.com/usage-logs/common)
- [Privacy policy / 隐私政策](https://taodock.com/privacy-policy)
- [Support / 支持](https://github.com/taodock-api/taodock-ai-sdk/issues)

## License

MIT © TaoDock
