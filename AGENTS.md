# AGENTS.md

本仓库是一个 Cloudflare Workers 项目，不再按传统 Cloudflare Pages 项目维护。

## First Read

- 先阅读 `@RTK.md`
- 以 `wrangler.toml` 作为部署与运行方式的事实来源
- 纯静态资源在 `public/`
- Worker 逻辑在 `src/`

## Working Rules

- 保留现有 landing page 的功能和 UI，除非需求明确要求改版
- 不要把这个仓库回退成 Pages 工作流
- 不要优先依赖 Dashboard 手工修改来保存关键配置
- 新增 API、表单处理、重写、鉴权或边缘逻辑时，统一在 Worker 层实现

## Delivery Checklist

- 改完后先跑 `npm run check`
- 本地预览使用 `npm run dev`
- 如果改动了运行方式、目录结构或 Cloudflare 配置，记得同步更新 `README.md` 和 `RTK.md`
