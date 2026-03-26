![Build Status](https://github.com/CBunna/devops-app-Gitops/actions/workflows/containerize.yaml/badge.svg)
# DevOps Survivor Kit

A humorous React dashboard for surviving daily DevOps chaos — containerized and deployed via GitOps.

## Features

- **Incident Excuse Generator** — One-click absurd-but-believable outage excuses
- **Team Blame-O-Meter** — Spinning wheel to randomly assign blame with a funny accusation
- **Pipeline Status Faker** — Animated CI/CD pipeline with fake logs and random pass/fail stages

## Tech Stack

- React 19 + Vite
- Tailwind CSS
- Lucide React icons
- Docker + Nginx (production)

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Stop the dev server
kill $(lsof -t -i :5173)
```

---

## Docker

### Build image locally

```bash
docker build -t devops-survivor-kit .
```

### Run container locally

```bash
docker run -p 8080:80 devops-survivor-kit
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## CI/CD — GitOps Pipeline

This project uses **GitHub Actions** to automate building and pushing Docker images.

### Secrets required (GitHub → Settings → Secrets)

| Secret | Description |
|---|---|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_TOKEN` | Docker Hub access token |

### Pipeline steps (in progress)

- [x] Dockerfile — multi-stage build (Node → Nginx)
- [x] GitHub secrets — Docker Hub credentials
- [ ] GitHub Actions workflow — build & push image on push to `main`
- [ ] Pull-based deployment (ArgoCD / Flux)
- [ ] Kubernetes manifests

---

## Project Structure

```
devops-app/
├── src/                  # React source
├── Dockerfile            # Multi-stage build
├── .github/
│   └── workflows/        # GitHub Actions (coming soon)
├── vite.config.js
└── package.json
```
