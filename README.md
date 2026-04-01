# 🌾 Agricultural Economics Question Bank

A full-stack, comprehensive web application built for the Economics Faculty of an Agricultural University. It serves as a centralized platform to manage, securely store, and easily browse past examination questions.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white)

---

## 🚀 Live Demo
[Visit the SAU Question Bank Here](https://question-bank-app-five.vercel.app)

---

## 🌟 Features

- **Public Repository Access**: Anyone can browse, search, and view past examination questions without needing an account.
- **Advanced Filtering State**: Dynamically filter questions based on academic Level, Semester, Course Name, and Exam Type (Theory/Practical).
- **Secure File Uploads**: Authorized contributors can seamlessly upload up to 2 high-quality photos per question (ideal for multi-page theory question papers).
- **Beautiful Side-by-Side Viewing**: Questions with multiple pages are smartly rendered side-by-side for optimal reading without relying on clunky carousels.
- **Admin Dashboard**: Secure panel to provision and manage contributor accounts (Admins only).
- **Optimized Storage**: Image binaries are vaulted securely in **Cloudinary**, while fast, lightweight URLs are stored in **Supabase PostgreSQL** ensuring maximum performance.
- **Dynamic Course Management**: Easily maintain and update course catalogs via a single configuration file without touching UI components.
- **🤖 AI-Powered Tutor (Llama 3.2 Vision)**: Integrated a multimodal AI chatbot that scans question paper images using Groq API and answers student queries in real-time, explaining complex academic concepts natively.

## 🛠️ Tech Stack & Architecture

This application uses a robust, separated frontend-backend architecture.

### **Frontend** (`/frontend`)
- **Framework**: React.js configured with Vite for lightning-fast HMR and building.
- **Language**: TypeScript for strong typing and error catching.
- **Styling**: Tailwind CSS tailored with a custom earthy-green (Agriculture) and professional-blue (Economics) color palette. Dark mode supported automatically!
- **State & Routing**: React Router DOM and Custom Context Providers for secure Auth handling.
- **Hosting**: Designed to be statically deployed (e.g., Vercel, Netlify).

### **Backend** (`/backend`)
- **Framework**: Node.js running an Express server.
- **Language**: TypeScript.
- **Middleware**: `multer` (memory buffering) for handling multipart form data.
- **Integrations**: 
  - `@supabase/supabase-js` bypassing RLS using the `SERVICE_ROLE_KEY` to broker admin-level actions safely away from the client.
  - `cloudinary` (via `streamifier`) to securely pipe incoming memory-buffered images into cloud storage.
- **Hosting**: Designed for serverless or Node environments (e.g., Render, Railway).

### **Database & Authentication**
- **Supabase Auth**: JWT-driven authentication.
- **Supabase Database**: PostgreSQL containing `users` and `questions` tables.

---

## ⚙️ How It Works (Data Flow)

1. **Viewing Questions (General User)**
   - The React frontend securely polls Supabase's REST endpoints directly to fetch active questions. Since the table allows public `SELECT` policies, this skips the custom Node backend entirely for rapid loading.
2. **Uploading Questions (Collector)**
   - A logged-in Collector stages an image. The frontend validates the file type and restricts it to a maximum of 2 files.
   - Upon submission, a `multipart/form-data` POST request is fired to the Express backend (`/api/upload`).
   - The Backend receives it, pipes the binary buffer actively into Cloudinary, receives the permanent `secure_url`s, and inserts a relative record linking to the Uploader into Supabase. 
3. **Provisioning Users (Admin)**
   - An Admin submits an email/password via the Dashboard.
   - The Frontend hits `/api/admin/create-user`. The backend handles this by using Supabase's `auth.admin.createUser()` to securely bypass public signup restrictions and provisions the explicit database profile asynchronously.
4.**🗄️ Database Structure (Supabase)**
- **`users` table:** `id` (UUID), `email`, `role` (admin/collector), `created_at`
- **`questions` table:** `id`, `level`, `semester`, `course_name`, `exam_type`, `image_urls` (Array), `uploader_id` (FK), `created_at`
---

## 💻 Installation & Local Development

### Prerequisites
- Node.js (v18+ recommended)
- A Supabase Project (with URL & `anon`/`service_role` keys)
- A Cloudinary Account (with Cloud Name, API Key, and Secret)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd question-bank-app
```

### 2. Environment Configuration
You will need to set up `.env` files in both directories.

**Backend** (`backend/.env`):
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_nam
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

**Frontend** (`frontend/.env`):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000
```

### 3. Running the Backend
```bash
cd backend
npm install
npm run dev
# The Express server will spin up on http://localhost:5000
```

### 4. Running the Frontend
```bash
cd frontend
npm install
npm run dev
# The Vite server will launch, typically accessible on http://localhost:5173
```

---

## 📚 General Usage

### Managing the Course Catalog
You don't need to rebuild database relationships to add new semesters. The entire academic tree is centrally managed locally to ensure the quickest form responses.
1. Open up `frontend/src/data.ts`.
2. Add or modify Keys in the `courseData` record.
3. The UI Dropdowns across the Search Pages and Upload Forms will instantly adapt.

### Roles & Permissions
- **Admin**: Has unrestricted dashboard access. Can provision new Collectors, modify platform settings, and forcibly delete inappropriate questions or users.
- **Collector**: Granted access sequentially by Admins. They possess the exclusive ability to attach and publish question images into the repository. 
- **User**: General student body. No login required to perform complex queries and read data.

---
## 🗺️ Future Roadmap
- [ ] Implement user bookmarking for favorite questions.
- [ ] Add an analytics dashboard to track the most searched courses.
- [ ] Migrate from local `data.ts` course catalog to a dynamic Supabase table for easier updates.

*Developed by Argho.*