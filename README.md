# TaoDock provider for the Vercel AI SDK

[![CI](https://github.com/taodock-api/taodock-ai-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/taodock-api/taodock-ai-sdk/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@taodock-ai/ai-sdk-provider?logo=npm&logoColor=white)](https://www.npmjs.com/package/@taodock-ai/ai-sdk-provider)
[![AI SDK](https://img.shields.io/badge/AI%20SDK-7-black)](https://ai-sdk.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

Use [TaoDock](https://taodock.com/)'s OpenAI-compatible API from the
[Vercel AI SDK](https://ai-sdk.dev) — **one key for GPT, Claude, Gemini, and 40+
other providers**, with one bill and no per-provider SDK wiring.

```ts
import { generateText } from 'ai'
import { taodock } from '@taodock-ai/ai-sdk-provider'

const { text } = await generateText({
  model: taodock('YOUR_MODEL_ID'),
  prompt: 'Write a haiku about a harbor.',
})
```

## Why use this provider

The AI SDK already ships an OpenAI-compatible provider, so this package stays
deliberately thin. What it adds:

- **Lazy key resolution** — `TAODOCK_API_KEY` is read on every request, so
  rotating a key does not require rebuilding a provider instance.
- **Sane default endpoint** — requests go to `https://taodock.com/v1`, whether
  you pass `https://taodock.com`, `.../v1`, or `.../v1/` as the base URL.
- **Token usage always reported** — `includeUsage` is enabled, so `usage`
  arrives with every response and can be metered downstream.
- **One import for the whole gateway** — switch models by changing the model ID
  string, not the package.

## Install

```bash
npm install @taodock-ai/ai-sdk-provider ai
```

Requires Node.js 20.3 or newer. ESM only.

## Quick start

1. Create a key at <https://taodock.com/keys>.
2. Pick a model ID available to that key at <https://taodock.com/models>.
3. Export the key server-side:

```bash
export TAODOCK_API_KEY='your-api-key'
```

```ts
import { generateText } from 'ai'
import { taodock } from '@taodock-ai/ai-sdk-provider'

const { text, usage } = await generateText({
  model: taodock('YOUR_MODEL_ID'),
  system: 'You are a terse technical editor.',
  prompt: 'Explain what an API gateway does in one sentence.',
})

console.log(text, usage)
```

> The default provider reads `TAODOCK_API_KEY` at request time. Never expose an
> API key in browser code or a public client bundle.

## Streaming

```ts
import { streamText } from 'ai'
import { taodock } from '@taodock-ai/ai-sdk-provider'

const result = streamText({
  model: taodock('YOUR_MODEL_ID'),
  prompt: 'Summarise the history of container shipping.',
})

for await (const chunk of result.textStream) {
  process.stdout.write(chunk)
}
```

## Structured output

```ts
import { generateObject } from 'ai'
import { z } from 'zod'
import { taodock } from '@taodock-ai/ai-sdk-provider'

const { object } = await generateObject({
  model: taodock('YOUR_MODEL_ID'),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
  }),
  prompt: 'Propose a blog post about API rate limiting.',
})
```

Tool calling, embeddings, and other AI SDK features follow the capabilities of
the selected model, as configured by its channel in TaoDock.

## Configuration

```ts
import { createTaoDock } from '@taodock-ai/ai-sdk-provider'

const taodock = createTaoDock({
  apiKey: process.env.TAODOCK_API_KEY,
  baseURL: 'https://taodock.com/v1',
  headers: { 'X-Application': 'example-service' },
})
```

| Option | Default | Description |
| --- | --- | --- |
| `apiKey` | `TAODOCK_API_KEY` | TaoDock API key. Resolved per request when omitted. |
| `baseURL` | `TAODOCK_BASE_URL`, then `https://taodock.com/v1` | OpenAI-compatible API prefix. Trailing slashes are normalised; query strings and fragments are rejected. |
| `headers` | — | Extra headers sent with every request. |
| `fetch` | `globalThis.fetch` | Custom fetch implementation for testing, proxying, or middleware. |

Models are reachable as `taodock(modelId)`, `taodock.languageModel(modelId)`, or
`taodock.chatModel(modelId)`.

## Common setups

| Environment | Notes |
| --- | --- |
| Next.js / Nuxt server routes | Create the provider inside the handler, or use the default export with an env var. |
| Edge runtimes | Works with the platform `fetch`; environment access is guarded, so pass `apiKey` explicitly if your runtime does not expose `process.env`. |
| Multi-tenant SaaS | Call `createTaoDock({ apiKey })` per tenant instead of using the default export. |
| Self-hosted gateway | Point `baseURL` at your own TaoDock instance. |

## Compatibility

| Component | Version |
| --- | --- |
| AI SDK (`ai`) | 7.x |
| `@ai-sdk/openai-compatible` | 3.x |
| Node.js | 20.3 or newer |
| Module format | ESM only |

## Development

```bash
npm ci
npm run typecheck   # tsc --noEmit
npm test            # unit tests
npm run build       # emit dist/
npm run pack:check  # full check plus npm pack --dry-run
```

CI runs `npm run pack:check` on every push — see
[ci.yml](.github/workflows/ci.yml).

## Releasing

Publishing is automated. Pushing a `v*` tag runs the
[Publish workflow](.github/workflows/publish.yml), which verifies the tag matches
`package.json`, runs the full check suite, then publishes to npm with a
provenance attestation:

```bash
npm version patch --no-git-tag-version
git commit -am "Release v0.1.1"
git tag v0.1.1
git push origin main --tags
```

The workflow needs the repository secret `NPM_TOKEN`: a granular npm token with
read-and-write publish access and 2FA bypass enabled. To test the pipeline
without publishing, run the workflow manually with *Dry run* enabled.

## Links

- [Documentation](https://docs.taodock.com)
- [API keys](https://taodock.com/keys)
- [Models](https://taodock.com/models)
- [Usage logs](https://taodock.com/usage-logs/common)
- [Privacy policy](https://taodock.com/privacy-policy)
- [Issues](https://github.com/taodock-api/taodock-ai-sdk/issues)

## 中文说明

众妙之门 TaoDock 是聚合 40+ AI 服务商的统一 API 网关，一个密钥、一张账单即可
调用 GPT、Claude、Gemini 等模型。本包是 [Vercel AI SDK](https://ai-sdk.dev) 的
TaoDock Provider。

```bash
npm install @taodock-ai/ai-sdk-provider ai
export TAODOCK_API_KEY='你的密钥'
```

```ts
import { generateText } from 'ai'
import { taodock } from '@taodock-ai/ai-sdk-provider'

const { text } = await generateText({
  model: taodock('模型 ID'),   // 见 https://taodock.com/models
  prompt: '用一句话解释什么是 API 网关。',
})
```

密钥在每次请求时读取，可直接用环境变量轮换；请勿在浏览器代码或公开客户端包中暴露
密钥。多租户场景请用 `createTaoDock({ apiKey })` 按租户创建实例。

## More TaoDock integrations

| Integration | Repository |
|---|---|
| WordPress AI provider | [taodock-api/taodock-wordpress](https://github.com/taodock-api/taodock-wordpress) |
| n8n nodes | [taodock-api/taodock-n8n-nodes](https://github.com/taodock-api/taodock-n8n-nodes) |
| Dify tools & plugins | [taodock-api/taodock-dify-tools](https://github.com/taodock-api/taodock-dify-tools) |
| AstrBot plugin | [taodock-api/taodock-astrbot-plugin](https://github.com/taodock-api/taodock-astrbot-plugin) |
| MCP server | [taodock-api/taodock-mcp](https://github.com/taodock-api/taodock-mcp) |

## License

MIT © TaoDock
