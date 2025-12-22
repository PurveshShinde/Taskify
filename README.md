# Taskify

### Smart Task Management Web Application

Taskify is a comprehensive, production-grade web application designed for efficient task management and team collaboration. It provides a secure, responsive, and intuitive interface for users to create projects, manage tasks, and collaborate in real-time.

## Project Background & Attribution

Taskify originated as a concept developed during the QHackathon organized by QHealsTechnology.

**Important Note:** This repository contains an **independently re-architected, refactored, and significantly enhanced version** of the application. It was developed by the repository owner to meet production-level engineering standards. While the original idea stems from the hackathon participation, this specific codebase differs substantially from the original submission in terms of architecture, security implementations, code quality, and feature set.

## Features Overview

- **Secure Authentication**: Robust user authentication system using JWT, with support for Google Sign-In via Firebase.
- **Smart Task Management**: Create, update, assign, and track tasks with status and priority indicators.
- **Team Collaboration**: Dedicated workspaces for teams to share tasks and resources.
- **Interactive Dashboard**: Real-time overview of project progress and upcoming deadlines.
- **Profile Management**: distinct user profiles with customizable settings.
- **Responsive UI**: A modern, mobile-friendly interface built for usability across devices.
- **Notifications**: Automated email notifications for critical updates.

## Tech Stack

### Frontend (Client)

- **Framework**: React 18 (initialized via Vite)
- **Language**: TypeScript (TSX)
- **Styling**: Tailwind CSS (with PostCSS configuration)
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **UI Components & Visualization**:
  - Lucide React (Iconography)
  - Framer Motion (Animations)
  - Recharts (Data Visualization)
- **Utilities**:
  - Firebase Client SDK (Authentication)
  - date-fns (Date manipulation)

### Backend (Server)

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication & Security**:
  - JSON Web Tokens (JWT)
  - Bcrypt.js (Password hashing)
  - Firebase Admin SDK (Token verification)
  - CORS (Cross-Origin Resource Sharing)
- **Services**:
  - Node-cron (Scheduled background tasks)
  - Nodemailer (Email transmission)

## Architecture Overview

Taskify follows a robust **MERN (MongoDB, Express, React, Node.js)** stack architecture suitable for scalable web applications.

- **Client-Server Pattern**: The application relies on a decoupled architecture where the frontend (Client) communicates with the backend (Server) via a RESTful API.
- **Type Safety**: TypeScript is utilized across the full stack (Frontend and Backend) to ensure type safety and reduce runtime errors.
- **Monorepo Structure**: The repository is organized into distinct `client` and `server` directories to maintain separation of concerns while facilitating unified development.

## Folder Structure

```
Taskify/
├── client/                 # Frontend Application (React/Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application route pages
│   │   ├── context/        # React Context providers
│   │   ├── services/       # API integration services
│   │   └── types/          # TypeScript definitions
│   ├── public/             # Static assets
│   ├── index.html          # Entry HTML
│   ├── tailwind.config.js  # Tailwind configuration
│   └── vite.config.ts      # Vite configuration
│
├── server/                 # Backend Application (Node/Express)
│   ├── src/ (or root)
│   │   ├── config/         # Database and auth configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API route definitions
│   │   └── server.ts       # Application entry point
│   ├── dist/               # Compiled JavaScript output
│   └── tsconfig.json       # TypeScript configuration
│
└── README.md               # Project Documentation
```

## Setup & Installation

**Prerequisites**:

- Node.js (v20 or higher)
- MongoDB (Local instance or Atlas URI)
- npm or yarn

**Installation Steps**:

1.  **Clone the Repository**:

    ```bash
    git clone <repository-url>
    cd Taskify
    ```

2.  **Install Backend Dependencies**:

    ```bash
    cd server
    npm install
    ```

3.  **Install Frontend Dependencies**:

    ```bash
    cd ../client
    npm install
    ```

4.  **Run Development Servers**:
    - Terminal 1 (Backend): `cd server && npm run dev`
    - Terminal 2 (Frontend): `cd client && npm run dev`

## Environment Variables

For the application to function correctly, environment variables must be configured. Create a `.env` file in both the `client` and `server` directories.

**Note**: Do not commit actual secrets to version control.

**Server (`server/.env`)**:

- `PORT`: Server listening port (e.g., 5000)
- `MONGO_URI`: Connection string for MongoDB
- `JWT_SECRET`: Secret key for signing JSON Web Tokens
- `CLIENT_ORIGIN`: URL of the frontend application (for CORS)
- `FIREBASE_SERVICE_ACCOUNT`: Configuration for Firebase Admin SDK
- `EMAIL_USER` / `EMAIL_PASS`: Credentials for Nodemailer

**Client (`client/.env`)**:

- `VITE_API_URL`: Base URL of the backend API
- `VITE_FIREBASE_API_KEY`: Firebase Client SDK configuration

## Deployment Overview

The application is architected for a distributed deployment:

- **Frontend**: Deployed on **Vercel** to leverage edge caching and fast content delivery.
- **Backend**: Deployed on **Render** (or similar Node.js hosting) as a persistent web service.
- **Database**: Hosted on MongoDB Atlas.

Production builds utilize the `dist` output directory generated by the TypeScript compiler and Vite bundler.

## License & Usage Restrictions

**Copyright Notice**

All rights reserved.

This repository is strictly for **educational, portfolio, and demonstration purposes**.

- **No Redistribution**: You may not redistribute, sub-license, or sell this code.
- **No Commercial Use**: Use of this software for commercial purposes is strictly prohibited without explicit written permission from the author.
- **No Modification**: You may not modify and republish this work as your own.

While the original concept was inspired by the QHackathon event, this codebase represents the independent intellectual property of the repository maintainer. The hackathon organizers (QHealsTechnology) are credited for the prompt but bear no responsibility for this implementation.

## Author / Maintainer

**Purvesh Shinde**

- Full Stack Developer
- # Repository Owner

> > > > > > > 4af2d44a2b899ce386f7ab256f840dfc36d9e694
