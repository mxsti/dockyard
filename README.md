<img src="dockyard-icon.png" width="300" height="300" />

Web-based dashboard for managing Docker containers on the host system.

### Tech Stack

- **Frontend:** React, TypeScript, ReactQuery
- **Backend:** Express, TypeScript, Dockerode

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- For local development: [Node.js](https://nodejs.org/) (v22+)

### Getting Started

```bash
docker compose up --build
```

### API
| Method | Endpoint                       | Description                        |
|--------|--------------------------------|------------------------------------|
| GET    | /containers                    | List all containers                |
| GET    | /containers?name=foo           | Filter by name                     |
| GET    | /containers?status=running     | Filter by status                   |
| GET    | /containers/:containerId/logs  | Get a stream of the container logs |
| POST   | /containers/:containerId/start | Start a container                  |
| POST   | /containers/:containerId/stop  | Stop a container                   |

### ⚠️ Security Notice

This application requires access to the Docker socket (`/var/run/docker.sock`) to manage containers on the host system. This grants the application full control over the Docker daemon, which is equivalent to root access on the host.
