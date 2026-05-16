# sub-web

![Vue](https://img.shields.io/badge/Vue-2.6.x-brightgreen.svg)
![Node](https://img.shields.io/badge/Node-22.x-green.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)

基于 Vue.js 2.6 与 [tindy2013/subconverter](https://github.com/tindy2013/subconverter) 后端实现的订阅配置自动生成 Web 界面。提供了简洁美观的前端界面，支持多种代理客户端配置生成。

## ✨ 特性

- 🎨 基于 Vue 2.6 + Element UI 的现代化界面
- 📦 模块化架构，易于维护和扩展
- 🐳 Docker 一键部署
- 🚀 高性能构建，支持 Gzip 压缩
- 📱 响应式设计，支持移动端
- ⚡ 支持自定义转换参数
- 🔄 实时配置预览和生成

## 🚀 快速开始

### 使用 Docker（推荐）

一键部署，无需配置：

```bash
docker run -d \
  -p 58080:80 \
  --restart always \
  --name subweb \
  careywong/subweb:latest
```

访问 <http://localhost:58080/> 即可使用。

### 本地开发

```bash
# 克隆项目
git clone https://github.com/CareyWang/sub-web.git
cd sub-web

# 安装依赖
yarn install

# 启动开发服务器
yarn dev
```

访问 <http://localhost:5173/> 查看应用。

## 📦 环境要求

- **Node.js**: 22.x
- **Yarn**: 1.22+
- **Docker**: 20.10+ （可选，用于容器化部署）

### 验证安装

```bash
# 检查 Node.js 版本
node -v
# 应输出: v22.x.x

# 检查 Yarn 版本
yarn -v
# 应输出: 1.22.x
```

## 🛠️ 安装

### 使用 Yarn（推荐）

```bash
# 克隆项目
git clone https://github.com/CareyWang/sub-web.git
cd sub-web

# 安装依赖
yarn install
```

### 环境配置

构建前复制模板并按注释填写（变量在**构建时**注入，修改后须重新 `yarn build`）：

```bash
cp .env.example .env
```

`.env.example` 含全部 `VITE_*` 变量说明（含子路径 `VITE_BASE_PATH`、默认后端 `VITE_SUBCONVERTER_DEFAULT_BACKEND` 等）。**勿提交**本地 `.env`（已 gitignore）；本地文件与模板仅「真实值 vs 占位值」不同。

子路径部署见 `docs/技术迭代-子路径与后端地址.md`。

## 🚀 使用

### 开发环境

```bash
# 启动开发服务器
yarn dev
```

访问 <http://localhost:5173/> 查看应用。

### 生产构建

```bash
# 构建生产版本
yarn build
```

构建完成后，`dist` 目录包含所有生产文件。


## 🐳 Docker 部署

### 本地构建

如需修改代码并自定义构建：

```bash
# 构建镜像
docker build -t subweb-local:latest .

# 运行容器
docker run -d \
  -p 58080:80 \
  --restart always \
  --name subweb \
  subweb-local:latest
```

### Docker Compose 部署

使用 Docker Compose 一键部署完整服务栈（包含 MyUrls 短链接服务）：

```bash
# 进入 services 目录
cd services

# 编辑 .env 文件，修改端口和域名配置
# 默认配置：SUBWEB_PORT=58080, MYURLS_PORT=8002
vim .env

# 启动所有服务
docker-compose up -d
```

## 🌐 部署

### Nginx 配置示例

配置 Nginx 作为反向代理和静态文件服务器：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # HTTPS 重定向（可选）
    # return 301 https://$server_name$request_uri;

    root /var/www/sub-web/dist;
    index index.html index.htm;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip 压缩
    gzip on;
    gzip_min_length 1k;
    gzip_buffers 4 16k;
    gzip_http_version 1.0;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/json
        application/javascript
        application/x-javascript
        application/xml
        text/xml;
    gzip_vary on;

    # 静态资源缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|gz|svg|mp4|ogg|ogv|webm|htc|xml|woff|woff2|ttf|eot)$ {
        access_log off;
        add_header Cache-Control "public,max-age=86400";
        add_header Vary Accept-Encoding;
    }
}

# HTTPS 配置示例（可选）
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/key.pem;

    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    root /var/www/sub-web/dist;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔗 相关项目

- **[tindy2013/subconverter](https://github.com/tindy2013/subconverter)** - 强大的订阅转换后端
- **[CareyWang/MyUrls](https://github.com/CareyWang/MyUrls)** - 短链接服务，可与 sub-web 配合使用

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献方式

1. **Fork** 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 **Pull Request**

### 开发指南

- 遵循 ESLint 代码规范
- 更新相关文档
- 确保所有 CI 检查通过

### 问题反馈

如果您遇到任何问题或有改进建议，请：

1. 查看 [Issues](https://github.com/CareyWang/sub-web/issues) 是否已有类似问题
2. 创建新的 Issue 并提供详细信息
3. 使用合适的标签标记问题类型

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

Copyright © 2020-2025 CareyWong

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

特别感谢：
- [tindy2013/subconverter](https://github.com/tindy2013/subconverter) - 提供强大的转换后端
- Vue.js 和 Element UI 团队 - 优秀的前端框架和组件库

## 📈 项目统计

<a href="https://www.star-history.com/#CareyWang/sub-web&type=date&legend=top-left">

 <picture>

   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=CareyWang/sub-web&type=date&theme=dark&legend=top-left" />

   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=CareyWang/sub-web&type=date&legend=top-left" />

   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=CareyWang/sub-web&type=date&legend=top-left" />

 </picture>

</a>

<br>
