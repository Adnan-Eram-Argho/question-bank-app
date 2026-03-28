Agricultural Economics Question Bank

A web application for the Economics Faculty of an Agricultural University to manage and browse examination questions.
Tech Stack

    Frontend: React (Vite), TypeScript, Tailwind CSS.
    Backend: Node.js, Express, TypeScript.
    Database & Auth: Supabase (PostgreSQL).
    Image Storage: Cloudinary (Images are stored in Cloudinary, only URLs are saved in the database).

Project Structure
 

question-bank-app/
├── frontend/        # React + Vite Client
├── backend/         # Express + TypeScript Server
└── README.md 
text
 
  
 

## Prerequisites

- Node.js installed (v16 or higher recommended).
- Supabase Account.
- Cloudinary Account.

## Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd question-bank-app
 
 
 
2. Setup Frontend 
bash
 
  
 
cd frontend
npm install
npm run dev
 
 
 

The frontend will usually run on http://localhost:5173. 
3. Setup Backend 
bash
 
  
 
cd ../backend
npm install
# Create a .env file based on .env.example (to be provided in future steps)
npm run dev 
 
 
 

(Note: We will setup the dev script in package.json in upcoming steps) 
Modifying Course Data 

The course data (Levels, Semesters, Course Names) is centrally located in the frontend codebase. 

File Location: frontend/src/data.ts 

To modify the available courses: 

    Open frontend/src/data.ts. 
    Edit the courseData object. 
    The application will automatically update the dropdowns in the Upload and Search forms. 

Roles 

     Admin: Full control, can create user accounts.
     Collector: Can upload questions.
     General User: Can view and search questions (No login required).
     

Color Theme 

     Primary: Earthy Green (Agriculture)
     Secondary: Professional Blue/Gold (Economics)
     Modes: Light and Dark mode supported.
     

Contributors 

Developed by Argho. 