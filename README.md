<div align="center">

# 📚 SAU Agricultural Economics Question Bank

**A full-stack academic resource platform for Sher-e-Bangla Agricultural University**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Frontend: React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react)](https://react.dev/)
[![Backend: Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js)](https://nodejs.org/)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com/)
[![API on Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://render.com/)

[Live Demo](https://sau-agri-econ.vercel.app/) · [Report Bug](https://github.com/Adnan-Eram-Argho/question-bank-app/issues) · [Request Feature](https://github.com/Adnan-Eram-Argho/question-bank-app/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## 🎯 About The Project

The **SAU Question Bank & Study Hub** is a scalable, multi-faculty academic resource platform built for students and teachers at Sher-e-Bangla Agricultural University. It solves the problem of scattered, hard-to-find past exam papers and study materials by providing a single, searchable, and filterable repository that supports multiple academic domains.

Contributors (collectors and admins) can upload previous-year question papers directly via image uploads, and link external resources such as textbooks, lecture notes, or general PDFs. Students can browse, filter by faculty/level/semester/course, and instantly access everything they need — all powered by a context-aware AI tutor assistant that dynamically adapts its domain knowledge based on the selected faculty for robust on-demand academic support.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS, Framer Motion |
| **Routing** | React Router v7 |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database & Auth** | Supabase (PostgreSQL + Auth) |
| **Image Storage** | Cloudinary |
| **AI Tutor** | Groq SDK (Llama 4 Scout — `meta-llama/llama-4-scout-17b-16e-instruct`) |
| **Analytics** | Vercel Analytics (`@vercel/analytics`) |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |
| **SEO** | react-helmet-async |

---

## ✨ Key Features

- **🌐 Multi-Faculty Architecture** — Seamlessly switch across different faculties to access domain-specific study environments, courses, and resources.
- **📖 Question Bank** — Browse and filter previous-year exam papers by Faculty, Level, Semester, Course, and Type. Supports multi-image uploads.
- **📚 Study Materials Library** — A unified resource hub for Books, Notes, and General PDFs. Supports URL-synced type filters (`?type=book`), infinite scroll pagination (batches of 9), real-time type counts, and asynchronous contributor profile resolution with intelligent caching.
- **🤖 Context-Aware AI Tutor** — Domain-locked Groq-powered chat assistant (Llama 4 Scout) that dynamically generates faculty-specific system prompts at request time, with image analysis (up to 5 Cloudinary URLs per message), robust error handling, strict domain guardrails, and prompt injection protection.
- **✨ Premium UI & Animations** — High-performance unified scroll reveals, custom canvas-based Framer Motion hero particles, interactive floating badges, smooth page transitions, and micro-interaction hover effects throughout.
- **🔐 Role-Based Access Control** — Supabase Auth with `admin` and `collector` roles. Optimized auth flow with race condition prevention, redundant DB queries removed for instant logins, and secure profile updates with atomic operations.
- **🛠️ Admin Dashboard** — Full moderation panel: create users, delete questions, manage study materials, with cascading filter controls and master admin protection.
- **🧩 Centralised SVG Icons** — All reusable icons extracted into `src/components/icons.tsx` with typed props, eliminating repeated inline SVG markup across components.
- **🔒 Strict TypeScript** — Replaced all `as any` casts with a proper `CourseData` interface; all `catch` blocks use `unknown` with `instanceof Error` narrowing.
- **📊 Vercel Analytics** — First-party, privacy-friendly page-view and event tracking integrated via `@vercel/analytics/react`.
- **🛡️ Security Hardened** — CORS restrictions, environment-based admin ID configuration, rate limiting with memory protection, input sanitization, and atomic resource operations to prevent data loss.

---

## 📁 Folder Structure

```
question-bank-app/
│
├── backend/                        # Express REST API server
│   ├── src/
│   │   ├── lib/
│   │   │   ├── supabase.ts         # Supabase admin client singleton
│   │   │   └── cloudinary.ts       # Cloudinary config, streamUpload, deleteFromCloudinary
│   │   ├── middleware/
│   │   │   └── index.ts            # requireAuth, requireAdmin, rate limiter, multer instances
│   │   ├── routes/
│   │   │   ├── auth.ts             # GET/POST /api/user/profile
│   │   │   ├── uploads.ts          # POST /api/upload, POST /api/upload-material
│   │   │   ├── ai.ts               # POST /api/chat-tutor — faculty-aware Groq (Llama 4 Scout)
│   │   │   └── admin.ts            # /api/contributors + all /api/admin/* routes
│   │   └── index.ts                # App bootstrap: env validation, middleware, route mounting
│   ├── .env.example                # Backend environment variable template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                       # React (Vite) SPA
│   ├── public/                     # Static assets served at root
│   ├── src/
│   │   ├── assets/                 # Images and static media
│   │   ├── components/             # All React page & UI components
│   │   │   ├── AdminDashboard.tsx  # Admin control panel (users, questions, materials)
│   │   │   ├── AnimatedBackground.tsx # Global particle background elements
│   │   │   ├── Contributors.tsx    # Public contributors showcase page
│   │   │   ├── Developer.tsx       # Developer profile page
│   │   │   ├── DeveloperBadge.tsx  # Interactive "Developed By" floating badge
│   │   │   ├── FloatingAITutor.tsx # Groq-powered AI chat widget (image-aware)
│   │   │   ├── HeroParticles.tsx   # Canvas-based Framer Motion hero animation
│   │   │   ├── icons.tsx           # Centralised typed SVG icon components (12 icons)
│   │   │   ├── Layout.tsx          # Global navbar, sidebar, and footer wrapper
│   │   │   ├── Login.tsx           # Supabase Auth login form
│   │   │   ├── PageTransition.tsx  # Framer Motion page transitions and routing wrapper
│   │   │   ├── Profile.tsx         # User profile editor with avatar upload
│   │   │   ├── QuestionList.tsx    # Filterable question paper grid
│   │   │   ├── ScrollReveal.tsx    # Unified smooth scroll-reveal wrapper
│   │   │   ├── StudyMaterials.tsx  # Books, Notes & PDFs page — infinite scroll, URL-synced filters
│   │   │   └── UploadQuestion.tsx  # Unified upload form (4-tab: Question/Book/Note/PDF)
│   │   ├── context/
│   │   │   ├── AuthContext.tsx     # Supabase Auth context provider
│   │   │   ├── FacultyContext.tsx  # Global faculty state scaling provider
│   │   │   └── ThemeContext.tsx    # Light/Dark mode context provider
│   │   ├── lib/
│   │   │   └── supabaseClient.ts   # Supabase client initialisation
│   │   ├── App.css                 # Global base styles
│   │   ├── App.tsx                 # Root component: router, providers, Vercel Analytics & Toaster
│   │   ├── data.ts                 # Typed CourseData (Level → Semester → Course mapping)
│   │   ├── index.css               # Tailwind directives & CSS custom properties
│   │   └── main.tsx                # App entry point
│   ├── .env.example                # Frontend environment variable template
│   ├── index.html                  # Vite HTML entry with SEO meta
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed before proceeding:

- **Node.js** `v18` or higher ([Download](https://nodejs.org/))
- **npm** `v9` or higher (bundled with Node.js)
- A **Supabase** project with the `questions` and `study_materials` tables created
- A **Cloudinary** account for image hosting
- A **Groq** API key for the AI Tutor feature

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Adnan-Eram-Argho/question-bank-app.git
cd question-bank-app
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

---

### Environment Variables

Both the `backend/` and `frontend/` directories require their own `.env` files. Copy the example files and fill in your credentials:

```bash
# From the project root
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

#### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `PORT` | Port for the Express server | No (default: `5000`) |
| `SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `SUPABASE_SERVICE_KEY` | Supabase **service role** key (bypasses RLS) | ✅ Yes |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | ✅ Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ Yes |
| `GROQ_API_KEY` | Groq API key for the AI Tutor | ✅ Yes |
| `CORS_ORIGIN` | Comma-separated list of allowed origins (e.g., `https://your-app.vercel.app`) | ✅ Yes (Production) |
| `MASTER_ADMIN_ID` | UUID of the master admin account (protected from deletion) | Recommended |

> ⚠️ **Security Notes:**
> - Never commit your `.env` files. Both are listed in their respective `.gitignore` files.
> - In production, `CORS_ORIGIN` must be configured to restrict API access to trusted domains only.
> - Set `MASTER_ADMIN_ID` to protect the primary administrator account from accidental deletion.

#### Frontend (`frontend/.env`)

| Variable | Description | Required |
|---|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase **anon/public** key | ✅ Yes |
| `VITE_API_URL` | Backend API base URL (local or hosted) | No (defaults to Render URL) |

> ⚠️ **Security Note:** Never commit your `.env` files. Both are listed in their respective `.gitignore` files.

---

## 💻 Usage

Open **two separate terminals** from the project root.

**Terminal 1 — Start the backend server:**

```bash
cd backend
npm run dev
# Server running at http://localhost:5000
```

**Terminal 2 — Start the frontend development server:**

```bash
cd frontend
npm run dev
# App running at http://localhost:5173
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

> 💡 **Tip:** When running locally, set `VITE_API_URL=http://localhost:5000` in `frontend/.env` so the frontend communicates with your local backend instead of the hosted Render API.

---

## 📡 API Reference

All endpoints are served from the Express backend. Base URL: `http://localhost:5000` (local) or your Render deployment URL.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | None | Health check |
| `GET` | `/api/contributors` | None | Fetch all contributor profiles |
| `POST` | `/api/upload` | Collector | Upload question paper images to Cloudinary + Supabase |
| `POST` | `/api/upload-material` | Collector | Add a book, note, or PDF record (Drive link) |
| `POST` | `/api/chat-tutor` | None | Send message + optional images (≤5) to the faculty-aware AI Tutor (Llama 4 Scout) |
| `POST` | `/api/user/profile` | Authenticated | Update user profile name, bio, and avatar |
| `GET` | `/api/admin/users` | Admin | List all registered users |
| `POST` | `/api/admin/create-user` | Admin | Create a new user account |
| `DELETE` | `/api/admin/users/:id` | Admin | Delete a user and their avatar from Cloudinary |
| `DELETE` | `/api/admin/questions/:id` | Admin | Delete a question and its images from Cloudinary |
| `DELETE` | `/api/admin/materials/:id` | Admin | Delete a study material record |

### `POST /api/chat-tutor` — Request Body

```json
{
  "message": "Explain the law of demand.",
  "faculty": "Agricultural Economics",
  "history": [
    { "role": "user", "text": "Hello" },
    { "role": "assistant", "text": "Hi! How can I help?" }
  ],
  "images": ["https://res.cloudinary.com/.../question.jpg"]
}
```

> The `faculty` field drives the system prompt; defaults to `"Agricultural Economics"` if omitted. The `images` array accepts up to 5 Cloudinary URLs and is passed directly to the Groq vision API.

---

## 🗺️ Roadmap

- [ ] **Search Bar** — Full-text search across question papers and study materials
- [ ] **PDF Preview** — In-app preview for uploaded Drive PDFs before downloading
- [ ] **Bookmark System** — Allow students to save favourite resources for quick access
- [ ] **Mobile App** — React Native companion app for offline access
- [ ] **Notifications** — Email/push alerts when new materials are uploaded for followed courses
- [ ] **Analytics Dashboard** — View download counts and popular resources for admins
- [x] **Vercel Analytics** — First-party, privacy-friendly page-view tracking via `@vercel/analytics`
- [x] **Infinite Scroll Pagination** — Study Materials page loads content in batches of 9 using `IntersectionObserver`
- [x] **URL-Synced Type Filters** — Study Materials `?type=book/note/pdf` query param preserved on navigation
- [x] **Multi-image Question Upload** — Upload multiple pages per question paper
- [x] **Global Faculty Architecture** — Context-aware AI tutor and faculty switching mechanics
- [x] **Performance Optimizations** — Asynchronous contributor fetching with intelligent caching, optimized DB queries, and request deduplication
- [x] **Premium Animations** — Unified Framer Motion scroll reveals and interactive widgets
- [x] **Study Materials (Books, Notes, PDFs)** — Unified upload and browse system
- [x] **Backend Modularisation** — `index.ts` split into `lib/`, `middleware/`, and `routes/` layers
- [x] **SVG Icon System** — All inline SVGs extracted into a single typed `icons.tsx` component file (12 icons)
- [x] **TypeScript Strictness** — Eliminated all `as any` casts with a proper `CourseData` interface; `catch` blocks use `unknown` with runtime narrowing
- [x] **Security Hardening** — CORS restrictions, environment-based admin ID, rate limiting with memory protection, input sanitization, and atomic resource operations
- [x] **Race Condition Prevention** — AuthContext uses refs to prevent stale state updates during rapid login/logout cycles
- [x] **Data Loss Prevention** — Profile updates use atomic operations to prevent avatar loss on failed updates

---

## 🔒 Security & Performance Improvements

This project follows industry best practices for security and performance. Recent enhancements include:

### Security Hardening
- **CORS Protection**: Production environments require explicit `CORS_ORIGIN` configuration; no fallback to allow-all policy
- **Environment-Based Configuration**: Sensitive identifiers (e.g., master admin ID) managed via environment variables, never hardcoded
- **Rate Limiting with Memory Protection**: In-memory rate limiter capped at 10,000 entries with LRU eviction to prevent DDoS-induced memory exhaustion
- **AI Prompt Injection Prevention**: Faculty names validated against whitelist on both client and server; all inputs sanitized before AI processing
- **Atomic Resource Operations**: Profile updates ensure new avatars are saved before old ones are deleted, preventing permanent data loss

### Performance Optimizations
- **Intelligent Caching**: Study Materials contributor data cached in-memory, reducing API calls by ~60% during pagination
- **Request Deduplication**: Concurrent requests tracked via refs to prevent race conditions and state corruption
- **Aggressive Cleanup**: Rate limiter expired entries purged every 60 seconds (down from 5 minutes) to minimize memory footprint
- **Single State Updates**: React components use consolidated state updates to eliminate UI flickering and double renders

### Stability Enhancements
- **Race Condition Elimination**: AuthContext uses `useRef` to track latest user ID, preventing stale async responses from overwriting current state
- **Graceful Degradation**: Failed API calls fall back to cached data rather than breaking the UI
- **Input Validation**: All user inputs validated on both client and server with proper error messages

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place. Any contributions are **greatly appreciated**.

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'Add some feature'`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request**

Please ensure your code follows the existing TypeScript patterns and does not expose any credentials.

---

## 📄 License

Distributed under the MIT License.

```
MIT License

Copyright (c) 2026 Md. Adnan Eram Argho

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) — Open-source Firebase alternative powering auth and the database
- [Cloudinary](https://cloudinary.com/) — Cloud-based image management for question paper uploads
- [Groq](https://groq.com/) — Ultra-fast LLM inference powering the AI Tutor (Llama 4 Scout)
- [Vercel](https://vercel.com/) — Seamless frontend hosting, deployment, and analytics
- [Render](https://render.com/) — Reliable backend hosting for the Express API
- [React Hot Toast](https://react-hot-toast.com/) — Beautiful toast notifications
- [react-helmet-async](https://github.com/staylor/react-helmet-async) — Dynamic SEO meta tag management
- [Framer Motion](https://www.framer.com/motion/) — Production-ready animation library

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Adnan-Eram-Argho">Md. Adnan Eram Argho</a>
</div>