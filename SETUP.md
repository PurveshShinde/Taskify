# Taskify Setup and Installation Guide

This guide provides instructions for setting up, configuring, running, and troubleshooting Taskify in a local development or production environment.

---

## 1. Prerequisites

Before installing Taskify, ensure that your development machine has the following tools installed:

- **Node.js**: Version 20.x or higher (recommended: Node.js 24.22.1). Check with `node -v`.
- **npm**: Version 10.x or higher. Check with `npm -v`.
- **MongoDB**: A running local instance of MongoDB Community Server (`mongodb://127.0.0.1:27017/taskify`) or a cloud database URI from [MongoDB Atlas](https://www.mongodb.com/atlas).
- **Git**: Distributed version control tool. Check with `git --version`.
- **Firebase Account (Optional)**: Required if you wish to test Google OAuth Sign-In and Firebase ID token verification locally.

---

## 2. Installation

### 2.1 Clone the Repository

```bash
git clone https://github.com/PurveshShinde/Taskify.git
cd Taskify
```

### 2.2 Install Dependencies

Taskify is structured as a monorepo with separate workspaces for the frontend client and backend server. To install all dependencies across the root, client, and server workspaces in a single command, run:

```bash
npm run install:all
```

This root command executes:
1. `npm install` (root orchestration packages such as `concurrently`)
2. `npm install --prefix client` (React, Vite, Tailwind CSS, Lucide React, Framer Motion, Recharts, Firebase)
3. `npm install --prefix server` (Express, Mongoose, JWT, bcryptjs, Firebase Admin, Nodemailer, Node-Cron, tsx)

#### Important Note on Server Dependencies
If you navigate directly into the `server/` directory and execute `npm run dev` before dependencies are fully installed, you may encounter the following error:

```text
'tsx' is not recognized as an internal or external command
```

To resolve this, navigate to the `server/` directory and run:

```bash
cd server
npm install
```

---

## 3. Environment Variable Configuration

Taskify requires environment configuration files in both the `client/` and `server/` directories.

### 3.1 Client Configuration (`client/.env`)

Copy the example configuration file:

```bash
cp client/.env.example client/.env
```

Open `client/.env` and configure the following parameters:

| Variable | Required | Default / Example | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Yes | `http://localhost:5000` | The backend API server URL. In production, set to your live API endpoint. |
| `VITE_FIREBASE_API_KEY` | Optional | `AIzaSy...` | Firebase Web API Key for client authentication. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Optional | `project.firebaseapp.com` | Firebase authentication domain. |
| `VITE_FIREBASE_PROJECT_ID` | Optional | `project-id` | Firebase project identifier. |
| `VITE_FIREBASE_STORAGE_BUCKET`| Optional | `project.firebasestorage.app` | Firebase storage bucket domain. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Optional | `1234567890` | Firebase Cloud Messaging sender ID. |
| `VITE_FIREBASE_APP_ID` | Optional | `1:1234567890:web:...` | Firebase Web application identifier. |

*Note: If Firebase credentials are not provided, traditional email/password registration and the interactive demo mode will remain fully functional.*

### 3.2 Server Configuration (`server/.env`)

Copy the example configuration file:

```bash
cp server/.env.example server/.env
```

Open `server/.env` and configure the following parameters:

| Variable | Required | Default / Example | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Yes | `5000` | The network port the Express server listens on. |
| `CLIENT_ORIGIN` | Yes | `http://localhost:5173` | Allowed frontend URL for CORS origin validation. |
| `FRONTEND_URL` | Yes | `http://localhost:5173` | Base client URL used when constructing email verification links. |
| `MONGO_URI` | Yes | `mongodb://127.0.0.1:27017/taskify` | Connection string for MongoDB database instance. |
| `JWT_SECRET` | Yes | `your_secret_key` | Secret key used to sign and verify JSON Web Tokens. |
| `SERVER_URL` | Optional | `https://taskify-api.example.com` | Public server URL used by the 8-minute keep-alive ping engine. |
| `FIREBASE_PROJECT_ID` | Optional | `project-id` | Firebase project ID for Firebase Admin SDK. |
| `FIREBASE_CLIENT_EMAIL`| Optional | `firebase-adminsdk@...` | Service account email for Firebase Admin SDK. |
| `FIREBASE_PRIVATE_KEY` | Optional | `"-----BEGIN PRIVATE KEY-----\n..."` | Service account private key string (enclosed in double quotes with literal `\n`). |
| `EMAIL_USER` | Optional | `your_email@gmail.com` | Gmail or SMTP username for outgoing emails. |
| `EMAIL_PASS` | Optional | `your_app_password` | Gmail App Password or SMTP password. |

*Note on Email Configuration: If `EMAIL_USER` and `EMAIL_PASS` are omitted, verification email links will be printed directly to the server terminal console during development.*

---

## 4. Running the Application

### 4.1 Option 1: Unified Startup (Recommended)

From the project root directory, run:

```bash
npm run dev
```

This command uses `concurrently` to start both the Vite development server and the Express development server simultaneously.

- **Frontend Client**: Accessible at http://localhost:5173
- **Backend API Server**: Accessible at http://localhost:5000
- **Health Check**: Accessible at http://localhost:5000/health

### 4.2 Option 2: Dual Terminal Startup

For isolated debugging of client or server logs, use two separate terminal sessions:

#### Terminal 1: Backend Server
```bash
cd server
npm run dev
```
The server will watch for file changes using `tsx watch server.ts`.

#### Terminal 2: Frontend Client
```bash
cd client
npm run dev
```
Vite will launch the local development server with hot module replacement (HMR).

---

## 5. Building for Production

### 5.1 Compile All Workspaces

From the root directory:

```bash
npm run build
```

This compiles:
1. Client: Generates optimized static assets in `client/dist/`.
2. Server: Compiles TypeScript files into JavaScript in `server/dist/`.

### 5.2 Running the Production Server

To execute the compiled production backend:

```bash
cd server
npm run start
```
This runs `node dist/server.js`.

### 5.3 Previewing the Production Client

To preview the production frontend build locally:

```bash
cd client
npm run preview
```

---

## 6. Troubleshooting and FAQ

### Problem: `'tsx' is not recognized as an internal or external command`
- **Cause**: The `tsx` execution binary is not installed in `server/node_modules/.bin`.
- **Solution**: Navigate to `server/` and run `npm install`.

### Problem: `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`
- **Cause**: Local MongoDB daemon is not running or unreachable.
- **Solution**:
  - Verify MongoDB service status:
    - Windows: `net start MongoDB` or check Services manager.
    - macOS: `brew services start mongodb/brew/mongodb-community`
    - Linux: `sudo systemctl start mongod`
  - Alternatively, supply a cloud connection string from MongoDB Atlas in `server/.env` under `MONGO_URI`.

### Problem: `Firebase Admin initialization error: Invalid PEM formatted message`
- **Cause**: The `FIREBASE_PRIVATE_KEY` in `server/.env` has broken newline characters or lacks enclosing double quotes.
- **Solution**: Wrap the private key in double quotes and ensure newline characters are represented as literal `\n`:
  ```env
  FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgk...-----END PRIVATE KEY-----\n"
  ```

### Problem: CORS Error in Browser Console (`Access to XMLHttpRequest has been blocked by CORS policy`)
- **Cause**: The client URL does not match `CLIENT_ORIGIN` in `server/.env`.
- **Solution**: Verify that `CLIENT_ORIGIN` in `server/.env` matches the address and port of your frontend (typically `http://localhost:5173`).

### Problem: Port Conflict (`EADDRINUSE: address already in use :::5000`)
- **Cause**: Another process is already running on port 5000.
- **Solution**: Terminate the existing process or change `PORT=5001` in `server/.env` and update `VITE_API_BASE_URL=http://localhost:5001` in `client/.env`.

