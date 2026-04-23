# Microservices Overview

This directory contains independent microservices that handle specific domains or integrations.

## Services List

### 1. [Integration SAP](integration_sap/)
- Responsibility: Synchronizing data with the SAP ERP system.
- Tech Stack: Python (FastAPI).

### 2. [Integration Logistics](integration_logistics/)
- Responsibility: Connecting with external logistics providers (tracking, shipping).

### 3. [Notification Service](notification_service/)
- Responsibility: Sending emails, SMS, and system notifications.

### 4. [File Service](file_service/)
- Responsibility: Managing file uploads, downloads, and storage (S3/Local).

### 5. [Scheduler Worker](scheduler_worker/)
- Responsibility: Handling background tasks and cron jobs.
