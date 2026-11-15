<div align="center">

  <img src="./client/public/logo.png" alt="Taskify Logo" width="80" height="80" style="margin-bottom: 8px;" />
  <h1>Taskify</h1>
  <p><strong>Next-Generation Smart Task &amp; Workflow Management Platform</strong></p>

  <p>
    <a href="./LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License: MIT" />
    </a>
    <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-24.22.1-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-8.0-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase" />
  </p>

  <p align="center">
    <a href="#overview">Overview</a> •
    <a href="#key-features">Key Features</a> •
    <a href="#visual-tour">Visual Tour</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#project-architecture">Project Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#api-reference">API Reference</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

---

## Overview

**Taskify** is a modern, production-grade task and workflow management platform designed to help individuals and teams organize projects, boost productivity, and collaborate seamlessly.

Built with the **MERN** stack and end-to-end **TypeScript** type-safety across client and server, Taskify features voice-activated task creation via the Web Speech API, an interactive AI project assistant, comprehensive status analytics, team collaboration workspaces, secure dual authentication (JWT + Firebase Google OAuth), and an integrated 8-minute keep-alive service for reliable cloud hosting.

---

## Key Features

- **Voice & Speech-to-Text Task Creation**: Dictate tasks directly into Taskify using the browser's Web Speech API for hands-free workflow capture.
- **Interactive AI Project Assistant**: Intelligent floating workspace companion that assists with organizing priorities, suggesting project breakdowns, and optimizing team productivity.
- **Collaborative Team Workspaces**: Create dedicated team spaces, invite members, conduct in-app discussions, and track shared team tasks in real time.
- **Visual Analytics & Status Metrics**: Real-time project completion tracking, todo distribution charts powered by Recharts, and multi-tier priority filtering (Low, Medium, High).
- **Dual Authentication Architecture**:
  - Email & password registration with cryptographic token verification powered by Nodemailer.
  - One-click Google Sign-In with Firebase Authentication and server-side Firebase Admin ID token verification.
- **Interactive Demo Mode**: Zero-setup evaluation environment allowing users to explore full capabilities without requiring database provisioning or account registration.
- **Refined Light Aesthetic & Bento Grid UI**: Clean, distraction-free light workspace featuring modular Bento cards, subtle border contrasts, fluid micro-interactions with Framer Motion, and Tailwind CSS typography.
- **Automated Background Jobs & Keep-Alive Service**: Node-Cron scheduled deadline notifications and an automated 8-minute keep-alive ping engine to prevent Render free-tier instances from spinning down.

---

## Visual Tour

### Landing & Workspace Command Center
<p align="center">
  <img src="./assets/home.png" alt="Taskify Landing Page" width="100%" style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);" />
</p>

### Interactive Dashboard & Demo Mode
| Dashboard & AI Assistant | Interactive Demo Mode |
| :---: | :---: |
| <img src="./assets/dashboard.png" alt="Taskify Dashboard Overview" width="100%" style="border-radius: 6px;" /> | <img src="./assets/demo.png" alt="Taskify Demo Mode" width="100%" style="border-radius: 6px;" /> |

### Collaborative Team Workspaces
<p align="center">
  <img src="./assets/teams.png" alt="Taskify Team Collaboration Space" width="100%" style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);" />
</p>
<p align="center"><em>Dedicated team workspaces featuring real-time discussion streams, member invitations, and shared team tasks.</em></p>

### Authentication & Security Flow
<p align="center">
  <img src="./assets/auth.gif" alt="Taskify Authentication Flow Demo" width="100%" style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);" />
</p>
<p align="center"><em>Account registration, verification dispatch, and Google OAuth login integration.</em></p>

---

## Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Motion & Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Auth Client**: [Firebase Client SDK](https://firebase.google.com/)
- **Date Utilities**: [date-fns](https://date-fns.org/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (>=20 / >=24.22.1)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language & Engine**: [TypeScript](https://www.typescriptlang.org/) with [`tsx`](https://github.com/privatenumber/tsx) execution
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Security & Tokens**: [JSON Web Tokens (JWT)](https://jwt.io/), [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **Cloud Auth Verification**: [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- **Email Service**: [Nodemailer](https://nodemailer.com/)
- **Job Scheduling**: [Node-Cron](https://www.npmjs.com/package/node-cron)

---

## Project Architecture

```text
Taskify/
├── assets/                  # High-resolution screenshots and product media
│   ├── home.png             # Landing page preview
│   ├── dashboard.png        # Dashboard & AI assistant preview
│   ├── demo.png             # Demo mode preview
│   ├── teams.png            # Collaborative team space preview
│   ├── auth.gif             # Animated authentication demo
│   └── auth.mp4             # Video demo
├── client/                  # Frontend Single Page Application
│   ├── public/              # Static assets, sitemap.xml, robots.txt, preview images
│   ├── src/
│   │   ├── components/      # UI components (Sidebar, ProjectAssistant, Modals)
│   │   ├── config/          # Firebase client initialization
│   │   ├── context/         # AuthContext & ThemeContext providers
│   │   ├── hooks/           # useSpeechToText hook
│   │   ├── layouts/         # DashboardLayout
│   │   ├── pages/           # LandingPage, AuthPage, Dashboard Views
│   │   ├── services/        # API client & Demo mode mock engine
│   │   └── types.ts         # TypeScript models and interfaces
│   ├── .env.example         # Client environment template
│   └── package.json
├── server/                  # Backend REST API Server
│   ├── config/              # MongoDB connection & Firebase Admin setup
│   ├── controllers/         # Auth, Task, Project, Team, User controllers
│   ├── middleware/          # JWT authentication middleware
│   ├── models/              # Mongoose schemas (User, Task, Project, Team)
│   ├── routes/              # Express API route endpoints
│   ├── services/            # Cron deadline service, email service, keep-alive service
│   ├── .env.example         # Server environment template
│   └── server.ts            # Application entrypoint & health routes
├── package.json             # Root orchestration scripts
└── README.md
```

---

## Getting Started

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (version 20+ or 24.x recommended)
- [npm](https://www.npmjs.com/) (version 10+)
- [MongoDB](https://www.mongodb.com/) (local instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### Installation

Clone the repository:
```bash
git clone https://github.com/PurveshShinde/Taskify.git
cd Taskify
```

Install dependencies across the root, client, and server packages:
```bash
npm run install:all
```

> **Important Note on Server Dependencies**:  
> If you run `npm run dev` inside `server/` and encounter the error:  
> `'tsx' is not recognized as an internal or external command`  
> this indicates that dependencies have not yet been installed inside `server/`. Run:
> ```bash
> cd server && npm install
> ```

---

### Environment Setup

#### 1. Client Environment (`client/.env`)
Copy the sample environment file:
```bash
cp client/.env.example client/.env
```
Ensure your `client/.env` contains:
```env
VITE_API_BASE_URL=http://localhost:5000

# Optional: Firebase credentials for Google Sign-In
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### 2. Server Environment (`server/.env`)
Copy the sample environment file:
```bash
cp server/.env.example server/.env
```
Ensure your `server/.env` contains:
```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/taskify
JWT_SECRET=your_secure_jwt_secret_key

# Optional: Backend Keep-Alive (automatically detected on Render via RENDER_EXTERNAL_URL)
SERVER_URL=https://taskify-api.example.com

# Optional: Firebase Admin credentials (for Google Sign-In verification)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Optional: Email Service (defaults to console logging in development)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

### Running the Application

#### Option 1: Unified Startup (Recommended)
From the project root:
```bash
npm run dev
```
This concurrently boots both the frontend client and backend server.

#### Option 2: Dual Terminal Startup
For focused debugging, run each layer in a separate terminal:

**Terminal 1 — Backend API Server:**
```bash
cd server
npm install
npm run dev
```
*Backend runs at [http://localhost:5000](http://localhost:5000) (Health check: [http://localhost:5000/health](http://localhost:5000/health))*

**Terminal 2 — Frontend Client:**
```bash
cd client
npm install
npm run dev
```
*Frontend runs at [http://localhost:5173](http://localhost:5173)*

---

## API Reference

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | System health status & keep-alive monitor | Public |
| `GET` | `/` | API status heartbeat | Public |
| `POST` | `/api/auth/register` | Register new user & dispatch verification email | Public |
| `POST` | `/api/auth/login` | Login with email and password | Public |
| `POST` | `/api/auth/firebase` | Authenticate with Firebase ID token (Google Sign-In) | Public |
| `POST` | `/api/auth/verify-email` | Verify user email with security token | Public |
| `GET` | `/api/tasks` | Get all tasks for current authenticated user | Private |
| `POST` | `/api/tasks` | Create a new task | Private |
| `PUT` | `/api/tasks/:id` | Update task details, status, or priority | Private |
| `DELETE` | `/api/tasks/:id` | Delete task | Private |
| `GET` | `/api/projects` | Fetch all user projects | Private |
| `POST` | `/api/projects` | Create a new project | Private |
| `GET` | `/api/teams` | Retrieve user teams | Private |
| `POST` | `/api/teams` | Create new team workspace | Private |
| `POST` | `/api/teams/:id/members`| Invite or add member to team | Private |
| `GET` | `/api/users/profile` | Get authenticated user profile details | Private |

---

## Security & Reliability

- **Password Hashing**: Cryptographic password salting and hashing using `bcryptjs`.
- **JWT Authorization**: Secure HTTP Bearer tokens protecting private routes.
- **Environment Isolation**: Production credentials and database secrets are never hardcoded or committed to git.
- **CORS Protection**: Origin validation restricting unauthorized cross-origin requests.
- **Cloud Keep-Alive Engine**: Automated 8-minute ping cycle preventing cloud platforms (such as Render) from cycling instances into sleep mode.

---

## Contributing

Contributions are welcome. If you would like to propose a change:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'feat: Add NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request.

---

## License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more details.

---

## Author

**Purvesh Shinde**  
- GitHub: [@PurveshShinde](https://github.com/PurveshShinde)  
- Project Repository: [https://github.com/PurveshShinde/Taskify](https://github.com/PurveshShinde/Taskify)
