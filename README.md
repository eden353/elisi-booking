# ai-booking-landing

一个部署在 Cloudflare Workers 上的静态营销落地页项目。现有页面功能与 UI 保持不变，运行方式已经迁移为 `Worker + Static Assets`，不再按传统 Cloudflare Pages 项目维护。

## What Changed

- 原始静态页面资源已整理到 `public/`
- 新增了 Cloudflare Worker 入口 `src/index.js`
- 新增 `wrangler.toml` 作为部署配置
- 新增 `package.json`，可直接用 `wrangler` 本地预览和部署
- 新增 `AGENTS.md` / `RTK.md`，约束后续开发继续使用 Cloudflare Workers 工作流

## Project Structure

```text
.
├── AGENTS.md
├── RTK.md
├── README.md
├── package.json
├── public
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── images/
├── src
│   └── index.js
└── wrangler.toml
```

## Requirements

- Node.js: 使用 Wrangler 支持的版本，建议直接使用最新 LTS
- Cloudflare 账号
- 已登录 Wrangler: `npx wrangler login`

## Local Development

```bash
npm install
npm run dev
```

默认会使用 Wrangler 在本地启动 Worker 预览环境。

## Deploy To Cloudflare Workers

```bash
npm run deploy
```

首次部署前请确认：

1. 已执行 `npx wrangler login`
2. 如果你想修改 Worker 名称，请更新 `wrangler.toml` 中的 `name`
3. 如果你要绑定自定义域名或环境变量，优先通过 Wrangler 配置并提交到仓库

## Notes For Future Development

- 这是 Cloudflare Workers 项目，不要按 Pages 的思路新增 Pages 专属配置。
- 纯静态内容放在 `public/`。
- Worker 自定义逻辑放在 `src/index.js`。
- 如果后续要增加 API、表单提交、重写、鉴权或边缘逻辑，统一在 Worker 层扩展。
- 如果改动影响运行方式，请同步更新 `README.md` 和 `RTK.md`。
