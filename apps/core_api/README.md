# 核心 API (Django)

这是 PS Admin 系统的主要后端服务，基于 Django 框架构建。

## 本地开发指南

1. 请确保项目根目录（`../../.env`）中已存在统一的 `.env` 配置文件。
2. 创建并激活 Python 虚拟环境：
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```
3. 安装相关依赖包：
   ```bash
   pip install -r requirements.txt
   ```
4. 执行数据库迁移：
   ```bash
   python manage.py migrate
   ```
5. 启动本地开发服务器：
   ```bash
   python manage.py runserver
   ```

## Docker 容器化部署

本项目已完全容器化，可通过 Docker Compose 进行编排与部署。

**在本地或服务器上进行部署：**

1. 进入 Docker 基础设施目录：
   ```bash
   cd ../../infra/docker
   ```
2. 确保您的根目录 `.env` 文件已配置好生产环境或部署环境所需的凭证和地址。
3. 在后台构建并启动容器：
   ```bash
   docker-compose up -d --build
   ```

执行后将自动启动映射到 `8000` 端口的 `core_api` 容器，以及依赖的 MySQL 和 Redis 容器。

**在运行中的容器内执行数据库迁移：**
```bash
docker exec -it ps_core_api python manage.py migrate
```

**创建超级管理员账号：**
```bash
docker exec -it ps_core_api python manage.py createsuperuser
```
