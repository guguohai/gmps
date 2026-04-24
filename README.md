# Gentle Monster 中国区眼镜产品服务系统 (PS System)

## 📖 项目概述
本项目旨在为 Gentle Monster 中国区构建一个集**精细化维修流程管理**、**独立配件库存管控**、**多渠道客户咨询服务**于一体的综合性支持平台。系统将作为大中华区客户服务的核心枢纽，确保品牌全球服务体验的一致性，并深度集成周边核心企业级系统。

## 🎯 核心功能模块
- **服务流程中心：** 端到端的维修工单流转、扫码受理、在线报价与支付、物流交付跟踪。
- **配件库存中心：** 针对无条码维修配件的精细化手工出入库与盘点管理。
- **客户咨询中心：** 汇集多渠道客户反馈，支持一键转工单及知识库辅助。
- **基础与系统集成：** 支撑中/英/韩三语，深度对接外部 ERP/WMS/物流系统。

## 🔌 系统集成拓扑
- **SAP (ERP)：** 实时获取配件定价，触发“换新”流程 (DO/SO)。
- **马士基 (WMS)：** 经 SAP 间接集成，处理新产品出库。
- **顺丰物流：** 自动化下单与全链路轨迹跟踪。
- **支付宝/微信支付：** 维修费用的在线支付与回调对账。
- **官网/小程序：** 客户侧的报修入口、状态实时推送及交互中枢。

## 🛠 技术栈
- **后端架构：** Java Spring Boot / Python Django (微服务/模块化架构)
- **前端框架：** Vue 3 / React 18 + TypeScript
- **数据库：** MySQL 8.0 + Redis
- **基础设施：** Docker + Kubernetes, 托管于阿里云

## 🚀 快速启动

### 前置依赖
- Node.js (v18+)
- JDK 17+ / Python 3.10+
- MySQL 8.0
- Redis

### 本地开发环境运行
1. **克隆仓库:**
   ```bash
   git clone [https://github.com/your-org/gm-ps-system.git](https://github.com/your-org/gm-ps-system.git)
   cd gm-ps-system

## 目录

```text
   根目录/
├─ apps/                          # 应用层目录
│  ├─ admin_web/                  # 管理后台前端
│  └─ core_api/                   # 核心后端主应用
│
├─ services/                      # 独立服务目录
│  ├─ integration_sap/            # SAP 对接服务
│  ├─ integration_logistics/      # 物流对接服务
│  ├─ notification_service/       # 通知服务
│  ├─ file_service/               # 文件服务
│  └─ scheduler_worker/           # 定时任务与异步任务服务
│
├─ packages/                      # 公共代码包目录
│  ├─ shared_types/               # 公共类型定义
│  ├─ shared_utils/               # 公共工具方法
│  ├─ shared_constants/           # 公共常量定义
│  └─ shared_client/              # 各服务调用封装
│
├─ infra/                         # 基础设施与部署相关目录
│  ├─ nginx/                      # Nginx 配置
│  ├─ docker/                     # Docker 构建与容器配置
│  ├─ scripts/                    # 部署、初始化、维护脚本
│  └─ sql/                        # 数据库初始化与变更脚本
│
├─ docs/                          # 项目文档目录
│  ├─ requirements/               # 需求文档
│  ├─ api/                        # 接口文档
│  ├─ db/                         # 数据库设计文档
│  └─ architecture/               # 架构设计文档
│
├─ .env.example                   # 环境变量示例文件
├─ docker_compose.yml             # 本地/测试环境编排文件
└─ README.md                      # 项目说明文档
```


## Docker 相关约定
- 标准编排文件位于 `infra/docker/docker-compose.dev.yml`
- 根目录 `docker_compose.yml` 作为本地启动便捷入口保留
- 服务 Dockerfile 统一位于 `infra/docker/`

## Docker 配置说明

- 根目录 `.env` 既作为应用运行时环境变量文件，也作为 Docker Compose 的变量来源
- `docker_compose.yml` 和 `infra/docker/docker-compose.dev.yml` 中的 MySQL、Redis、端口、镜像版本等配置，都通过 `${VAR}` 从 `.env` 读取
- `env_file` 用于把 `.env` 注入到应用容器内部；`${VAR}` 用于 Compose 在启动前解析编排文件，这两者是不同层级
- 新环境请先复制 `.env.example` 为 `.env`，再按实际环境修改密码、端口和密钥

## 本地 Docker 启动

1. 准备配置文件

```bash
cp .env.example .env
```

2. 按需修改根目录 `.env`

重点关注这些变量：
- `MYSQL_ROOT_PASSWORD`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_PORT`
- `REDIS_PORT`
- `CORE_API_PORT`
- `NOTIFICATION_SERVICE_PORT`
- `ADMIN_WEB_PORT`

3. 启动容器

使用根目录便捷入口：

```bash
docker compose --env-file .env -f docker_compose.yml up --build
```

或使用标准编排文件：

```bash
docker compose --env-file .env -f infra/docker/docker-compose.dev.yml up --build
```

4. 后台运行

```bash
docker compose --env-file .env -f infra/docker/docker-compose.dev.yml up -d --build
```

5. 停止容器

```bash
docker compose --env-file .env -f infra/docker/docker-compose.dev.yml down
```

6. 停止并清理数据卷

```bash
docker compose --env-file .env -f infra/docker/docker-compose.dev.yml down -v
```

## 部署到 Docker 主机

适用于测试机或云服务器上直接用 Docker Compose 部署。

1. 安装 Docker 和 Docker Compose 插件
2. 拉取或上传项目代码到目标主机
3. 在项目根目录创建生产环境 `.env`
4. 修改生产环境变量

生产环境至少要调整：
- `DEBUG=False`
- `MYSQL_ROOT_PASSWORD`
- `MYSQL_PASSWORD`
- `SECRET_KEY`
- `JWT_SECRET_KEY`
- 各服务对外暴露端口
- 第三方回调地址和密钥

5. 启动服务

```bash
docker compose --env-file .env -f infra/docker/docker-compose.dev.yml up -d --build
```

6. 查看服务状态

```bash
docker compose --env-file .env -f infra/docker/docker-compose.dev.yml ps
```

7. 查看日志

```bash
docker compose --env-file .env -f infra/docker/docker-compose.dev.yml logs -f
```

## 部署建议

- 生产环境不要把真实 `.env` 提交到仓库
- `.env.example` 只保留模板值
- 如果后续区分环境，建议增加 `.env.dev`、`.env.test`、`.env.prod`
- 当前仓库还没有单独的生产编排文件，后续可以在 `infra/docker/` 下增加 `docker-compose.prod.yml`
