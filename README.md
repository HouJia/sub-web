# sub-web（HouJia）

![Vue](https://img.shields.io/badge/Vue-2.6.x-brightgreen.svg)
![Node](https://img.shields.io/badge/Node-22.x-green.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)

基于 Vue 2.6 + Vite 的订阅转换 **Web 前端**，对接自建 [HouJia/subconverter](https://github.com/HouJia/subconverter)（**SubConverter-Extended** 基线，`hjsmaster` 分支）。

> **默认分支**：`hjsmaster`（非 CareyWang 上游 `master`）。  
> **分支与迭代**：见 [docs/技术方案-分支与上游同步.md](docs/技术方案-分支与上游同步.md)。

## 相对 CareyWang/sub-web 的主要改动

| 项 | 说明 |
|----|------|
| 构建 | Vue CLI → **Vite 5**；环境变量 `VITE_*` |
| NAS / NPM | **`VITE_BASE_PATH=/subw/`** 子路径部署 |
| 后端 | 默认指向自建 **`/subapi`**（`VITE_SUBCONVERTER_DEFAULT_BACKEND`） |
| 版本页眉 | 请求后端 **`/version.txt`**（适配 Extended，不用 HTML `/version`） |
| 品牌 | 页眉「订阅转换助手」；GitHub 链到 **HouJia/sub-web** |
| 部署 | `deploy/nas/deploy-to-qnap.sh` |

## 特性

- 基于 Vue 2.6 + Element UI
- 模块化架构，支持进阶转换参数
- Docker + Nginx 一键部署（含 `/subw/`）
- 响应式布局

## 快速开始

### Docker（NAS 推荐）

```bash
cp .env.example .env
# 必改：VITE_BASE_PATH、VITE_SUBCONVERTER_DEFAULT_BACKEND
./deploy/nas/deploy-to-qnap.sh
```

### 本地开发

```bash
git clone git@github.com:HouJia/sub-web.git
cd sub-web
git checkout hjsmaster
cp .env.default .env    # 或 .env.example（NAS 场景）
yarn install
yarn dev
```

访问 <http://localhost:5173/>（根路径）或按 `.env` 中 `VITE_BASE_PATH` 访问。

## 环境变量

| 变量 | 说明 |
|------|------|
| `VITE_BASE_PATH` | 部署子路径，NAS 为 `/subw/` |
| `VITE_SUBCONVERTER_DEFAULT_BACKEND` | subconverter API 根（无 `/sub?`） |
| `VITE_PROJECT` | 页眉 GitHub 链接（默认 HouJia/sub-web） |
| `VITE_BACKEND_RELEASE` | 「前往项目仓库」链接（默认 HouJia/subconverter） |

完整说明见 `.env.example`、`.env.default`。

## 上游与许可

- UI 原型 fork 自 [CareyWang/sub-web](https://github.com/CareyWang/sub-web)（MIT）
- 后端配套 [HouJia/subconverter](https://github.com/HouJia/subconverter)（GPL-3.0）

## 相关文档

- [技术方案-分支与上游同步.md](docs/技术方案-分支与上游同步.md)
- [技术迭代-子路径与后端地址.md](docs/技术迭代-子路径与后端地址.md)
- subconverter NAS 部署：`HouJia/subconverter` → `docs/技术迭代-NAS部署与NPM暴露.md`
