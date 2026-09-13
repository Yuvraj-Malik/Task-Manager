# Design and Development of a Full Stack Task Management Web Application

> **Minor Project Submission**  
> **Domain**: Quillance | Full Stack Development  
> **Project Type**: Individual Minor Project  
> **Student Name**: [Your Name]  
> **Batch Details**: [Your Batch / Roll Number]  
> **Project Title**: Design and Development of a Full Stack Task Management Web Application (TaskPulse)

---

## Project Overview
**TaskPulse** is a full stack task and productivity management web application developed as an Individual Minor Project. It provides a complete workflow for users to securely authenticate, create, manage, categorize, track, and update tasks in real-time through an interactive, responsive, and modern user interface.

---

## Core & Additional Features Checklist

| Feature Category | Requirement | Status | Implementation Details |
|---|---|:---:|---|
| **Authentication** | User Registration & Login | ✅ Complete | Email + password registration with bcrypt hashing, JWT issued via httpOnly cookie |
| | Session Validation (`/api/auth/me`) | ✅ Complete | Auto-login & session persistence across browser reloads |
| | Secure Logout | ✅ Complete | Clears httpOnly token cookie and redirects to login |
| **Task Management** | Create New Task | ✅ Complete | Title, description, 3-tier priority, and due date selection |
| | View All Tasks | ✅ Complete | Responsive card grid with status and priority badges |
| | Edit Existing Tasks | ✅ Complete | Pre-populated modal form with update API sync |
| | Delete Tasks with Confirmation | ✅ Complete | In-app confirmation modal preventing accidental deletions |
| | Mark Status (Completed/Pending) | ✅ Complete | One-click toggle with animated checkbox and celebratory strikethrough |
| | Due Dates & Overdue Alerts | ✅ Complete | Dynamic tags: *Overdue*, *Due Today*, *Due Tomorrow*, or formatted date |
| **Additional Features** | Task Priority System | ✅ Complete | 3 levels (Low, Medium, High) with distinct color coding and pulsating indicators |
| | Search Functionality | ✅ Complete | Real-time debounced title search powered by MongoDB regex |
| | Status Filtering | ✅ Complete | Segmented control switcher: All, Pending, Completed with count counters |
| | Priority Filtering | ✅ Complete | Dropdown filter: All, High, Medium, Low |
| | Sorting | ✅ Complete | Sort by Newest First, Due Date, or Priority |
| | Progress Summary & KPI Counters | ✅ Complete | 4 real-time stat cards (Total, Pending, Completed %, Urgent Attention) |
| | Responsive Layout | ✅ Complete | Optimized for mobile, tablet, and desktop viewports |

---

## Application Architecture & Flow

The application demonstrates the end-to-end full stack architecture:

```
[ User Action / UI ] 
       │
       ▼
[ React 19 Client (Vite + Tailwind CSS v4) ]
       │  (Axios HTTP Requests with credentials)
       ▼
[ Express.js REST API Server (Node.js) ]
       │  (JWT Auth Middleware & Input Validation)
       ▼
[ MongoDB Database (Mongoose ODM) ]
       │  (Query Execution & Document Persistence)
       ▼
[ Server Response (JSON Payload + Status Codes) ]
       │
       ▼
[ React State Update & Dynamic Interface Re-render ]
```

---

## Technology Stack

- **Frontend**:
  - React 19 (Hooks, Context API, React Router v6)
  - Tailwind CSS v4 + Custom SVG Icons
  - Axios (configured with `withCredentials: true` and Vite dev proxy)
  - Google Fonts: Plus Jakarta Sans & Inter
- **Backend**:
  - Node.js & Express.js
  - JSON Web Tokens (`jsonwebtoken`) & `cookie-parser`
  - Password hashing via `bcryptjs`
  - CORS and environmental configuration (`dotenv`)
- **Database**:
  - MongoDB Atlas (Cloud Database)
  - Mongoose ODM (Schemas, Indexes, and Validators)

---

## Project Structure

```
task-manager/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── api/                # Axios instance & task API calls
│   │   ├── components/         # Navbar, TaskCard, TaskForm, DeleteConfirmModal, Icons, ProtectedRoute
│   │   ├── context/            # AuthContext (state, login, register, logout)
│   │   ├── pages/              # Login, Register, Dashboard
│   │   ├── App.jsx             # Router & Route guards
│   │   ├── index.css           # Design tokens, typography & animations
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js          # Dev server proxy (/api -> http://localhost:5000)
├── server/                     # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/             # MongoDB connection (connectDB)
│   │   ├── controllers/        # authController, taskController
│   │   ├── middleware/         # auth guard, errorHandler
│   │   ├── models/             # User, Task (Mongoose models)
│   │   ├── routes/             # authRoutes, taskRoutes
│   │   ├── utils/              # Token & cookie generator
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Server entry point
│   ├── .env                    # Environment variables
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## API Documentation

### Authentication Endpoints
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account with hashed password |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue httpOnly JWT cookie |
| `POST` | `/api/auth/logout` | Public | Clear JWT authentication cookie |
| `GET` | `/api/auth/me` | Protected | Fetch current logged-in user profile |

### Task Endpoints
| Method | Route | Access | Query Parameters / Description |
|---|---|---|---|
| `GET` | `/api/tasks` | Protected | Retrieve user tasks (`status`, `priority`, `search`, `sort`) |
| `POST` | `/api/tasks` | Protected | Create a new task (`title`, `description`, `priority`, `dueDate`) |
| `GET` | `/api/tasks/:id` | Protected | Retrieve a single task by ID |
| `PUT` | `/api/tasks/:id` | Protected | Update task fields or toggle status |
| `DELETE` | `/api/tasks/:id` | Protected | Permanently delete a task by ID |

---

## Step-by-Step Local Setup Guide

### 1. Backend Setup
```bash
# Navigate to the server folder
cd server

# Install dependencies
npm install

# Configure environment variables (copy from .env.example if needed)
# Ensure MONGO_URI, JWT_SECRET, and PORT=5000 are set in .env

# Run server in development mode
npm run dev
```
The server will connect to MongoDB and start on `http://localhost:5000`.

### 2. Frontend Setup
```bash
# Navigate to the client folder in a new terminal
cd client

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## CRUD Operations Verification

1. **Create**: Click **"+ New Task"**, fill out title, optional description, pick priority (Low/Medium/High), choose a due date, and submit.
2. **Read**: View tasks displayed in responsive cards, along with real-time KPI metrics (Total, Pending, Completed, Urgent).
3. **Update**: Click the **Edit** icon on any task card to edit title, description, priority, or due date. Click the checkbox to toggle between **Pending** and **Done**.
4. **Delete**: Click the **Delete** icon on any card to bring up the custom delete confirmation modal, and confirm deletion.
