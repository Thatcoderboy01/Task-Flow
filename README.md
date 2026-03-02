<p align="center">
  <h1 align="center">📋 TaskFlow</h1>
  <p align="center">
    A modern, full-stack task management application built with React, Redux Toolkit, and Express.
    <br />
    <a href="#features"><strong>Features »</strong></a> · <a href="#api-reference"><strong>API Docs »</strong></a> · <a href="#deployment"><strong>Deploy »</strong></a>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-2.3-764ABC?logo=redux&logoColor=white" alt="Redux" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-8.9-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white" alt="Vite" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**TaskFlow** is a productivity-focused task management dashboard that lets users create, organize, and track tasks with priorities, statuses, tags, and due dates. It features real-time analytics, drag-and-drop reordering, bulk operations, dark mode support, and a responsive layout — all backed by a secure REST API with JWT authentication.

---

## Features

| Category | Details |
|---|---|
| **Authentication** | Signup / Login with bcrypt-hashed passwords, JWT (HTTP-only cookie + Bearer fallback), auto session restore |
| **Task CRUD** | Create, read, update, delete with validation (Zod on server, React Hook Form + Zod on client) |
| **Bulk Operations** | Multi-select tasks → bulk delete or bulk status change |
| **Drag & Drop** | Reorder tasks with `@dnd-kit` — persisted order sent to the API |
| **Filtering & Sorting** | Filter by status, priority, tags; sort by date, priority, due date, or title (asc/desc) |
| **Analytics Dashboard** | Completion chart, priority pie chart, productivity graph, and summary stats via Recharts |
| **Dark Mode** | System-aware theme toggle persisted in `localStorage` |
| **Keyboard Shortcuts** | Global shortcuts for common actions |
| **Export** | Export task data from the client |
| **Responsive UI** | Mobile-first layout with sidebar navigation, top navbar, and animated transitions (Framer Motion) |
| **Security** | Helmet, CORS, rate limiting (API + auth), input validation, password hashing (bcrypt, 12 rounds) |

---

## Tech Stack

### Client

| Technology | Purpose |
|---|---|
| React 18 | UI library |
| TypeScript | Static typing |
| Redux Toolkit | Global state management |
| React Router 6 | Client-side routing with lazy-loaded pages |
| React Hook Form + Zod | Form handling & validation |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations & transitions |
| Recharts | Data visualization |
| @dnd-kit | Drag-and-drop task reordering |
| Axios | HTTP client with interceptors |
| Vite | Build tool & dev server |

### Server

| Technology | Purpose |
|---|---|
| Express 4 | HTTP framework |
| TypeScript | Static typing |
| Mongoose (MongoDB) | ODM / database |
| JWT | Stateless authentication |
| bcryptjs | Password hashing |
| Zod | Request validation |
| Helmet | Security headers |
| express-rate-limit | Brute-force protection |

---

## Architecture

```
┌────────────────────────────────┐       ┌────────────────────────────────┐
│           CLIENT               │       │            SERVER              │
│  React + Redux + Tailwind      │ HTTP  │  Express + Mongoose + JWT      │
│  Vite dev server (:5173)       │◄─────►│  API server (:5000)            │
│                                │       │                                │
│  /login, /signup               │       │  POST /api/auth/signup         │
│  /  (Dashboard)                │       │  POST /api/auth/login          │
│  /tasks                        │       │  GET  /api/auth/me             │
│  /analytics                    │       │  POST /api/auth/logout         │
│  /settings                     │       │                                │
│  /profile                      │       │  GET    /api/tasks             │
│                                │       │  POST   /api/tasks             │
│                                │       │  PUT    /api/tasks/:id         │
│                                │       │  DELETE /api/tasks/:id         │
│                                │       │  POST   /api/tasks/bulk-delete │
│                                │       │  POST   /api/tasks/bulk-status │
│                                │       │  POST   /api/tasks/reorder     │
│                                │       │                                │
│                                │       │  GET /api/users/stats          │
│                                │       │  PUT /api/users/update         │
│                                │       │  PUT /api/users/change-password│
│                                │       │  DELETE /api/users/delete      │
└────────────────────────────────┘       └───────────────┬────────────────┘
                                                         │
                                                         ▼
                                                  ┌──────────────┐
                                                  │  MongoDB      │
                                                  │  (Atlas)      │
                                                  └──────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or **yarn** / **pnpm**)
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Installation

```bash
# Clone the repository
git clone https://github.com/Thatcoderboy01/Task-Flow.git
cd Task-Flow
```

```bash
# Install server dependencies
cd Server
npm install

# Install client dependencies
cd ../Client
npm install
```

### Environment Variables

Create a `.env` file in the `Server/` directory (see `.env.example`):

```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/taskflow?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# CORS — frontend origin
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the `Client/` directory (if needed):

```env
VITE_API_URL=http://localhost:5000/api
```

### Running Locally

```bash
# Terminal 1 — Start the API server (hot-reload)
cd Server
npm run dev          # → http://localhost:5000

# Terminal 2 — Start the React dev server
cd Client
npm run dev          # → http://localhost:5173
```

The Vite dev server proxies `/api` requests to `localhost:5000` automatically.

---

## Project Structure

```
TaskFlow/
├── Client/                     # React SPA
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── analytics/      # Charts & stats (Recharts)
│   │   │   ├── layout/         # DashboardLayout, Sidebar, TopNavbar
│   │   │   ├── tasks/          # TaskCard, TaskList, TaskForm, Filters, BulkActions
│   │   │   └── ui/             # Reusable primitives (Button, Badge, Modal, etc.)
│   │   ├── data/               # Sample / seed data
│   │   ├── hooks/              # useDebounce, useKeyboardShortcuts, useLocalStorage
│   │   ├── pages/              # Route-level pages (lazy-loaded)
│   │   ├── routes/             # ProtectedRoute wrapper
│   │   ├── services/           # Axios API client + service modules
│   │   ├── store/              # Redux Toolkit store, slices, selectors
│   │   ├── types/              # Shared TypeScript interfaces
│   │   └── utils/              # Constants, helpers, export utilities
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── Server/                     # Express REST API
│   ├── src/
│   │   ├── config/             # Database & JWT configuration
│   │   ├── controllers/        # Route handlers (auth, task, user)
│   │   ├── middleware/         # auth guard, validation, error handler
│   │   ├── models/             # Mongoose schemas (User, Task)
│   │   ├── routes/             # Express routers
│   │   └── utils/              # AppError, catchAsync, Zod validators
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

---

## API Reference

All endpoints return JSON. Protected routes require a valid JWT via HTTP-only cookie or `Authorization: Bearer <token>` header.

### Auth — `/api/auth`

| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|:----:|-------------|
| `POST` | `/signup` | `{ name, email, password }` | ✗ | Create account |
| `POST` | `/login` | `{ email, password }` | ✗ | Authenticate & receive token |
| `GET` | `/me` | — | ✓ | Get current user profile |
| `POST` | `/logout` | — | ✓ | Clear auth cookie |

### Tasks — `/api/tasks`

| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|:----:|-------------|
| `GET` | `/` | — | ✓ | List all tasks for the authenticated user |
| `POST` | `/` | `{ title, description?, priority?, status?, dueDate?, tags? }` | ✓ | Create a task |
| `PUT` | `/:id` | Partial task fields | ✓ | Update a task |
| `DELETE` | `/:id` | — | ✓ | Delete a task |
| `POST` | `/bulk-delete` | `{ ids: string[] }` | ✓ | Delete multiple tasks |
| `POST` | `/bulk-status` | `{ ids: string[], status }` | ✓ | Update status of multiple tasks |
| `POST` | `/reorder` | `{ orderedIds: string[] }` | ✓ | Persist drag-and-drop order |

### Users — `/api/users`

| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|:----:|-------------|
| `GET` | `/stats` | — | ✓ | Get profile statistics |
| `PUT` | `/update` | `{ name?, email? }` | ✓ | Update profile |
| `PUT` | `/change-password` | `{ currentPassword, newPassword }` | ✓ | Change password |
| `DELETE` | `/delete` | — | ✓ | Delete account & all tasks |

### Health

```
GET /api/health → { success: true, message: "TaskFlow API is running" }
```

---

## Deployment

### Server (Render)

1. Create a **Web Service** on [Render](https://render.com).
2. Set **Root Directory** to `Server`.
3. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Node Version:** `18` or higher
4. Add environment variables (`MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`, `CLIENT_URL`).

### Client (Vercel / Netlify)

1. Import the repo and set **Root Directory** to `Client`.
2. Configure:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add env var `VITE_API_URL` pointing to your deployed API (e.g., `https://your-api.onrender.com/api`).
4. For SPAs, add a rewrite rule: `/* → /index.html` (200).

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/my-feature`.
3. Commit with clear messages: `git commit -m "feat: add task export to CSV"`.
4. Push and open a Pull Request.

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## License

This project is open-source and available under the [MIT License](LICENSE).
