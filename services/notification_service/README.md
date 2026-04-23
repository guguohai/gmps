# PS 消息通知微服务 (Notification Service)

这是一个用于管理和分发系统消息（如邮件、短信、微信、系统内通知等）的独立微服务。

## 技术栈
- **Web 框架**: FastAPI
- **数据库**: MySQL 8 (与 `core_api` 共享 `ps_admin` 数据库)
- **任务队列**: Celery + Redis (用于异步推送消息)
- **身份验证**: JWT (校验由 `core_api` 签发的 Token)

## 快速开始 (本地运行)

```bash
# 创建并激活虚拟环境
python -m venv .venv
.venv\Scripts\activate     # Windows

# 安装相关依赖包
pip install -r requirements.txt

# 启动服务
uvicorn app.main:app --reload --port 8001

# 启动 Celery 工作队列 (需另开一个终端窗口)
celery -A app.core.celery_app worker --loglevel=info
```

## API 接口概览

| 请求方法 | 路径 | 功能描述 |
|--------|------|-------------|
| GET | `/health` | 服务健康检查 |
| POST | `/api/v1/notifications/send` | 发送单条通知 |
| GET | `/api/v1/notifications/templates` | 获取通知模板列表 |
| GET | `/api/v1/notifications/logs` | 查询通知发送日志 |
| POST | `/api/v1/miniapp/push` | 触发小程序消息异步推送 |

## API 文档

服务启动后，可在浏览器中访问自动生成的接口文档：
- Swagger UI: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc

## 项目结构

```
notification_service/
├── .env                    # (废弃) 请使用项目根目录的 .env
├── requirements.txt        # 项目依赖
├── README.md               # 本文档
└── app/
    ├── main.py             # FastAPI 应用入口
    ├── core/
    │   ├── celery_app.py   # Celery 队列配置
    │   ├── config.py       # Pydantic 环境变量设置
    │   ├── database.py     # SQLAlchemy 数据库引擎配置
    │   └── security.py     # JWT Token 校验逻辑
    ├── api/
    │   ├── health.py       # 健康检查路由
    │   ├── miniapp.py      # 小程序消息相关路由
    │   └── notification.py # 通知增删改查路由
    ├── schemas/
    │   ├── miniapp.py      # 小程序业务的数据模型 (Pydantic Models)
    │   └── notification.py # 通知相关的数据模型
    └── tasks/
        ├── __init__.py
        └── miniapp.py      # 用于向小程序发起的异步 Celery 任务
```

## Docker 容器化部署

本服务（及其关联的 Celery 工作队列）已完全容器化，可通过 Docker Compose 进行编排。

**在本地或服务器上进行部署：**

1. 进入 Docker 基础设施目录：
   ```bash
   cd ../../infra/docker
   ```
2. 确保您的项目根目录 `.env` 文件已配置好所需的凭证和地址（如 Redis 链接、MySQL 链接、小程序推送秘钥等）。
3. 在后台构建并启动容器：
   ```bash
   docker-compose up -d --build
   ```

执行后将自动启动以下服务：
- 映射到 `8001` 端口的 `notification_service` 容器（提供接口服务）。
- 运行 Celery 异步任务处理器的 `notification_worker` 容器。

**查看后台服务运行日志：**
```bash
# 查看接口服务日志
docker logs -f ps_notification_service

# 查看 Celery 异步队列日志
docker logs -f ps_notification_worker
```

### 架构说明：

遵循 Docker “一个容器运行一个核心进程” 的最佳实践，虽然 `notification_service` 和 `notification_worker` 共用同一套代码镜像，但它们承担着不同的职责：

1. **`notification_service` (Web 接口进程)**：运行 FastAPI (Uvicorn)，专门负责接听 HTTP 请求。当收到主系统要求发消息的请求时，它会立刻将任务存入 Redis 队列并快速返回响应（不让主系统干等）。
2. **`notification_worker` (Celery 后台进程)**：作为消费者运行在后台，专门盯着 Redis 队列。一旦发现有推送任务，它会拿出来执行耗时的网络请求（包括生成鉴权签名、向小程序接口发起 HTTP POST 请求），如果遇到超时等问题还会自动重试。这种分离设计保证了后台任务的执行不会阻塞前面的 Web 接口。
