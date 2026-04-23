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