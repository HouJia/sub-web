# Docker 部署指南

本文档基于当前仓库中的 `Dockerfile`、`services/docker-compose.yaml`、`.github/workflows/docker-build-push.yml` 以及本地实际构建结果整理。

## 1. 当前仓库的 Docker 支持情况

这个项目已经具备直接部署到 Docker 的条件：

- 根目录 `Dockerfile` 使用多阶段构建：
  - 第一阶段基于 `node:22-alpine` 执行 `yarn install` 和 `yarn build`
  - 第二阶段基于 `nginx:1.24-alpine` 提供静态文件服务
- `services/docker-compose.yaml` 提供了完整服务栈编排，包含：
  - `subweb`
  - `myurls`
  - `myurls-redis`
- `.github/workflows/docker-build-push.yml` 已配置在 `master` 分支推送时构建并推送镜像 `careywong/subweb:latest`

已验证事项：

- 本机 `docker --version` 可用
- 在当前仓库根目录执行 `docker build -t subweb-local-test .` 已成功

## 2. 部署方式一：直接运行现成镜像

如果你只是想快速启动页面，直接运行现有镜像最简单：

```bash
docker run -d \
  --name subweb \
  --restart always \
  -p 58080:80 \
  careywong/subweb:latest
```

启动后访问：

```text
http://localhost:58080
```

查看运行状态：

```bash
docker ps
docker logs subweb
```

停止并删除容器：

```bash
docker stop subweb
docker rm subweb
```

## 3. 部署方式二：基于当前仓库自行构建镜像

如果你改过代码，或者不想依赖远端镜像，建议在仓库根目录自行构建：

```bash
docker build -t subweb-local:latest .
docker run -d \
  --name subweb \
  --restart always \
  -p 58080:80 \
  subweb-local:latest
```

说明：

- 容器内部监听端口固定为 `80`
- 宿主机端口 `58080` 可以替换成你自己的端口，例如 `8080:80`

例如：

```bash
docker run -d \
  --name subweb \
  --restart always \
  -p 8080:80 \
  subweb-local:latest
```

## 4. 部署方式三：使用 Docker Compose 启动完整服务栈

如果你需要连同短链接服务一起部署，可以使用 `services/docker-compose.yaml`。

先进入目录：

```bash
cd services
```

当前仓库已经存在 `services/.env`，其中包含：

```env
SUBWEB_PORT=58080
MYURLS_PORT=8002
MYURLS_DOMAIN=example.com
MYURLS_TTL=180
```

启动完整服务栈：

```bash
docker compose up -d
```

如果你的环境仍使用旧版命令，也可以执行：

```bash
docker-compose up -d
```

查看状态：

```bash
docker compose ps
docker compose logs -f
```

停止服务：

```bash
docker compose down
```

补充说明：

- `subweb` 服务来自当前仓库代码，`build` 路径是 `../.`
- `myurls` 服务镜像为 `careywong/myurls:latest`
- `myurls-redis` 使用 `redis:5`
- `myurls` 日志目录会挂载到 `services/data/myurls/logs`
- `redis` 数据目录会挂载到 `services/data/redis`

## 5. 与前端配置相关的说明

当前根目录 `.env` 中存在以下前端构建配置：

- `VITE_SUBCONVERTER_DEFAULT_BACKEND`
- `VITE_MYURLS_API`
- `VITE_CONFIG_UPLOAD_API`
- `VITE_USE_STORAGE`
- `VITE_CACHE_TTL`

这些变量会在前端构建时打进静态资源中，因此：

1. 如果你要修改前端访问的后端地址，需要先修改根目录 `.env`
2. 修改后需要重新执行 `docker build`
3. 仅重启容器不会让前端静态资源自动读取新值

## 6. 已知边界与注意事项

### 6.1 镜像内 Nginx（`nginx.subw.conf`）

`Dockerfile` 会将 `nginx.subw.conf` 拷贝为 `/etc/nginx/conf.d/default.conf`，用于：

- 子路径构建（`VITE_BASE_PATH=/subw/`）时，将 URL `/subw/assets/...` 映射到磁盘 `/assets/...`
- 直连容器映射端口时，`/` 自动 `302` 到 `/subw/`
- 与 NPM 剥前缀配合：上游请求带 `X-Forwarded-Prefix: /subw` 时，`/` 返回 `index.html` 而非重定向

根路径部署（`VITE_BASE_PATH=/`）时，可改用默认 Nginx 配置或自行简化 `nginx.subw.conf`。

### 6.2 当前前端路由模式为 `history`

`src/router/index.js` 中配置了：

```js
const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes
})
```

不过当前仓库里只定义了一个路由 `/`，因此按现在的页面结构部署通常没有问题。

如果后续新增类似 `/foo`、`/bar` 的前端路由，默认 Nginx 配置下直接刷新页面可能返回 `404`。那时需要给 Nginx 增加类似下面的回退规则：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 6.3 子路径部署（`/subw/`）

1. 复制 `.env.production.example` 为 `.env`，设置 `VITE_BASE_PATH=/subw/` 与 `VITE_SUBCONVERTER_DEFAULT_BACKEND`（HTTPS 反代后的 subconverter 根路径，勿带 `/sub?`）。
2. `yarn build` 后执行 `docker build`（`vite.config.js` 通过 `loadEnv` 读取 `VITE_BASE_PATH`）。
3. 经 NPM 反代时，配置 `location ^~ /subw/` 并设置 `X-Forwarded-Prefix: /subw`（详见 `docs/技术迭代-子路径与后端地址.md`）。

不能只改容器启动参数而不重新构建；域名与端口属于私有配置，勿写入仓库，仅放在本地 `.env`。

## 7. 推荐部署选择

- 只想快速上线页面：使用“部署方式一”
- 你已经改过代码：使用“部署方式二”
- 需要同时部署短链接服务：使用“部署方式三”

## 8. 常用排查命令

查看镜像：

```bash
docker images | rg subweb
```

查看容器日志：

```bash
docker logs subweb
```

进入容器：

```bash
docker exec -it subweb sh
```

检查容器中的静态文件：

```bash
docker exec -it subweb ls /usr/share/nginx/html
```

## 9. 一份最短可用命令

如果你只需要一句话启动：

```bash
docker run -d --name subweb --restart always -p 58080:80 careywong/subweb:latest
```
