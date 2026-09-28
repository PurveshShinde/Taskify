<div align="center">

  <h1>⚡ Taskify</h1>
  <p><strong>Next-Generation Smart Task & Workflow Management Platform</strong></p>

  <p>
    <a href="https://taskify-webapp-pro.vercel.app" target="_blank">
      <img src="https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
    </a>
    <a href="./LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT" />
    </a>
    <a href="https://github.com/PurveshShinde/Taskify/stargazers">
      <img src="https://img.shields.io/github/stars/PurveshShinde/Taskify?style=for-the-badge&color=gold" alt="GitHub Stars" />
    </a>
    <a href="https://github.com/PurveshShinde/Taskify/pulls">
      <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-8.0-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase" />
  </p>

  <p align="center">
    <a href="https://taskify-webapp-pro.vercel.app"><strong>Explore Live Demo »</strong></a>
    <br />
    <br />
    <a href="#-features">Key Features</a> •
    <a href="#-visual-tour">Visual Tour</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-api-endpoints">API Reference</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>

---

## 📖 Overview

**Taskify** is a modern, production-grade task and workflow management platform designed to help individuals and teams organize projects, boost productivity, and collaborate effortlessly. 

Built with the **MERN** stack and full **TypeScript** type-safety across client and server, Taskify features voice-activated task creation via the Web Speech API, an interactive AI project assistant, comprehensive status analytics, team collaboration workspaces, secure dual authentication (JWT + Firebase Google OAuth), and an instant **zero-setup Live Demo mode**.

---

## 📸 Visual Tour

### Landing & Workspace Command Center
<p align="center">
  <img src="./assets/home.png" alt="Taskify Landing Page" width="100%" style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);" />
</p>

### Interactive Dashboard & Instant Demo Mode
| 📊 Dashboard & AI Project Assistant | ⚡ Zero-Setup Interactive Demo Mode |
| :---: | :---: |
| <img src="./assets/dashboard.png" alt="Taskify Dashboard Overview" width="100%" style="border-radius: 6px;" /> | <img src="./assets/demo.png" alt="Taskify Demo Mode" width="100%" style="border-radius: 6px;" /> |

### 👥 Collaborative Team Spaces & Live Discussions
<p align="center">
  <img src="./assets/teams.png" alt="Taskify Team Collaboration Space" width="100%" style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);" />
</p>
<p align="center"><em>Dedicated Team Workspaces featuring real-time discussion streams, member invitations, and shared team tasks.</em></p>

### 🔐 Seamless Authentication & Verification Demo
<p align="center">
  <img src="./assets/auth.gif" alt="Taskify Authentication Flow Demo" width="100%" style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);" />
</p>
<p align="center"><em>Real-time registration, email verification token dispatch, and Google OAuth login flow.</em></p>

---

## ✨ Features

- 🎙️ **Voice / Speech-to-Text Task Creation**: Dictate tasks directly into Taskify using the browser's Web Speech API for hands-free workflow capture.
- 🤖 **Interactive AI Project Assistant**: Floating chat companion that assists with organizing priorities, suggesting project structures, and optimizing productivity.
- 👥 **Collaborative Team Spaces**: Create dedicated team workspaces, invite members, conduct in-app discussions, and track shared team tasks in real time.
- 📊 **Visual Analytics & Status Metrics**: Real-time project completion rates, todo distribution charts (powered by Recharts), and priority filters (Low, Medium, High).
- 🔐 **Dual Secure Authentication**:
  - Email & password with token verification powered by Nodemailer.
  - One-click Google Sign-In with Firebase Authentication & server-side Firebase Admin ID token verification.
- ⚡ **Instant Live Demo Mode**: One-click test drive without registering or configuring a database, with state managed via isolated browser session storage.
- 🌓 **Sleek Glassmorphic UI & Theming**: Dark/Light mode support, fluid micro-interactions with Framer Motion, and Tailwind CSS.
- ⏰ **Automated Background Jobs**: Node-Cron integration for scheduled notifications and task status maintenance.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Motion & Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts & Data Viz**: [Recharts](https://recharts.org/)
- **Auth Provider**: [Firebase Client SDK](https://firebase.google.com/)
- **Date Utilities**: [date-fns](https://date-fns.org/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (20.x)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (`tsx` for dev)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Security & Tokens**: [JSON Web Tokens (JWT)](https://jwt.io/), [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **Cloud Auth Verification**: [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- **Email Service**: [Nodemailer](https://nodemailer.com/)
- **Job Scheduling**: [Node-Cron](https://www.npmjs.com/package/node-cron)

---

## 📁 Repository Structure

```text
Taskify/
├── assets/                  # High-res screenshots and media
│   ├── home.png             # Landing page preview
│   ├── dashboard.png        # Dashboard & AI assistant preview
│   ├── demo.png             # Demo mode preview
│   ├── teams.png            # Collaborative team space preview
│   ├── auth.gif             # Animated auth demo
│   └── auth.mp4             # High-res auth recording
├── client/                  # Frontend Single Page Application
│   ├── public/              # Static assets & icons
│   ├── src/
│   │   ├── components/      # UI components (Sidebar, ProjectAssistant, Layout)
│   │   ├── config/          # Firebase client initialization
│   │   ├── context/         # AuthContext & ThemeContext
│   │   ├── hooks/           # useSpeechToText hook
│   │   ├── layouts/         # DashboardLayout
│   │   ├── pages/           # LandingPage, AuthPage, VerifyEmail, Dashboard
│   │   ├── services/        # API client & Demo mode mock engine
│   │   └── types.ts         # Global TypeScript interfaces
│   ├── .env.example         # Client environment template
│   └── package.json
├── server/                  # Backend REST API Server
│   ├── config/              # MongoDB connection & Firebase Admin setup
│   ├── controllers/         # Auth, Task, Project, Team, User controllers
│   ├── middleware/          # JWT auth middleware
│   ├── models/              # Mongoose schemas (User, Task, Project, Team)
│   ├── routes/              # Express API route endpoints
│   ├── services/            # Cron jobs & email service
│   ├── .env.example         # Server environment template
│   └── server.ts            # Application entrypoint
├── package.json             # Root orchestration scripts
└── README.md
```

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or v20+)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (Local instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 2. Clone the Repository
```bash
git clone https://github.com/PurveshShinde/Taskify.git
cd Taskify
```

### 3. Install All Dependencies
Install root, client, and server dependencies with a single command:
```bash
npm run install:all
```

### 4. Configure Environment Variables

#### Client Configuration
Create `.env` inside the `client/` directory:
```bash
cp client/.env.example client/.env
```
Edit `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000

# Optional: Add Firebase credentials for Google Sign-In
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Server Configuration
Create `.env` inside the `server/` directory:
```bash
cp server/.env.example server/.env
```
Edit `server/.env`:
```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/taskify
JWT_SECRET=your_super_secret_jwt_key

# Optional: Firebase Admin (for Google Sign-In token verification)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Optional: Email Service (defaults to console logging if omitted)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 5. Run the Application
Start both the frontend and backend concurrently:
```bash
npm run dev
```

Alternatively, run each service independently:
```bash
# Terminal 1: Run frontend (http://localhost:5173)
npm run dev:client

# Terminal 2: Run backend (http://localhost:5000)
npm run dev:server
```

Open [http://localhost:5173](http://localhost:5173) in your browser to experience Taskify!

---

## 📡 API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
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

## 🔒 Security Best Practices

- **Password Hashing**: Passwords salted and hashed with `bcryptjs`.
- **JWT Authorization**: Bearer tokens protecting private endpoints.
- **Environment Isolation**: No production keys or connection strings are tracked or hardcoded in source.
- **CORS Protection**: Restricted to authorized origins in production.
- **Email Verification**: Required verification flow before standard accounts can authenticate.

---

## 🤝 Contributing

Contributions are what make the open-source community an amazing place to learn, inspire, and create! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

## 👨‍💻 Author & Support

**Purvesh Shinde**  
- GitHub: [@PurveshShinde](https://github.com/PurveshShinde)
- Project Repository: [https://github.com/PurveshShinde/Taskify](https://github.com/PurveshShinde/Taskify)
- Live Web App: [https://taskify-webapp-pro.vercel.app](https://taskify-webapp-pro.vercel.app)

If you find Taskify helpful or inspiring, please give it a ⭐️ on GitHub and consider supporting:  
☕ **[Buy Me a Coffee](https://buymeacoffee.com/purvesh.dev?message=From%20Taskify)**
