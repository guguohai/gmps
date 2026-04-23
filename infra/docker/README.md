# infra/docker

This directory stores Docker-related infrastructure assets that are shared at the repository level.

## Recommended contents

- `docker-compose.dev.yml`: local development orchestration
- `docker-compose.test.yml`: test environment orchestration
- `docker-compose.prod.yml`: production or pre-release orchestration templates
- `entrypoint.sh` or `wait-for-*.sh`: container startup helpers
- shared runtime config that does not belong to a single service
- centralized service Dockerfiles

## What should stay outside this directory

- service source code: keep in `apps/` or `services/`
- nginx config: keep in `infra/nginx/`
- SQL init and migration scripts: keep in `infra/sql/`
- deployment scripts: keep in `infra/scripts/`

## Current convention in this repository

- Root `docker_compose.yml` is a convenience entrypoint for local development
- `infra/docker/docker-compose.dev.yml` is the canonical infra compose file
- Service Dockerfiles are centralized here:
  - `infra/docker/core_api.Dockerfile`
  - `infra/docker/notification_service.Dockerfile`
  - `infra/docker/admin_web.Dockerfile`

Service source code stays in `apps/` and `services/`, while build logic stays in `infra/docker/`.
