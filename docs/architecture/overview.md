# System Architecture Overview

This document describes the high-level architecture of the PS system.

## Component Diagram

```mermaid
graph TD
    Client[Browser / Admin Web] --> API_Gateway[Nginx / Gateway]
    API_Gateway --> CoreAPI[Core API]
    
    CoreAPI --> DB[(PostgreSQL)]
    CoreAPI --> FileService[File Service]
    CoreAPI --> NotificationService[Notification Service]
    
    CoreAPI --> SAP[SAP Integration]
    SAP --> SAP_System[SAP ERP]
    
    CoreAPI --> Logistics[Logistics Integration]
    Logistics --> Carrier[Carrier API]
    
    Scheduler[Scheduler Worker] --> CoreAPI
```

## Directory Responsibilities

- **apps/**: User-facing applications (Frontend & Main Backend).
- **services/**: Domain-specific microservices for external integrations.
- **packages/**: Reusable code shared across apps and services.
- **infra/**: Configuration for deployment and environment management.
- **docs/**: Project-level documentation and design specifications.
