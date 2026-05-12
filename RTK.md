# RTK.md

## Project Identity

- 这是一个部署在 Cloudflare Workers 上的营销落地页项目。
- 当前运行方式是: `Worker 入口 + Workers Static Assets`。
- 静态资源目录是 `public/`，Worker 代码目录是 `src/`。
- 不要把它当成 Pages 项目处理，也不要重新引入 Pages 专属工作流。

## Source Of Truth

- 以仓库内的 `wrangler.toml` 为准，不要优先依赖 Cloudflare Dashboard 上的手工配置。
- 部署入口是 `src/index.js`。
- 静态页面、样式、脚本和图片都从 `public/` 提供。
- 旧版线上页面如需保留，统一以 `public/backups/` 静态快照 + `src/index.js` 路由重写的方式处理。

## Development Rules

- 保留当前 landing page 的功能、文案结构和 UI 风格，除非需求明确要求改版。
- 小改动优先直接在 `public/index.html`、`public/css/`、`public/js/` 中完成。
- 如果要新增后端逻辑、表单处理、轻量 API、重写或鉴权逻辑，统一加在 Worker 中实现。
- Worker 处理完自定义逻辑后，默认继续走 `env.ASSETS.fetch(request)` 提供静态资源。
- 不要引入仅适用于传统 Node 服务器的运行时假设，例如长期驻留进程、文件系统写入、本地服务端 session。
- 优先使用 Workers 兼容的标准 Web API。

## Cloudflare-Specific Guidance

- 这是 Workers Static Assets 模式，不是 Pages Functions 模式。
- 不要新增 `_headers`、`_redirects`、`functions/` 这类 Pages 优先的约定来代替 Worker 逻辑。
- 如果后续需要 API 路径，建议在 `src/index.js` 里显式判断路径，例如 `/api/*`。
- 如果后续需要环境变量，优先通过 Wrangler 管理，并在 README 中补充说明。

## Local Workflow

- 安装依赖: `npm install`
- 本地预览: `npm run dev`
- 部署检查: `npm run check`
- 正式部署: `npm run deploy`

## Change Checklist

- 改完页面后，检查 `public/` 下的资源引用路径是否仍然正确。
- 如果新增或更新了页面备份，确认 `/backup/` 及其内部资源路径都能正常访问。
- 改完 Worker 后，确认非静态路径不会意外影响现有 landing page。
- 新增 Cloudflare 能力时，把配置和用法写进 `README.md`。
