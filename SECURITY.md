# Security and Privacy Policy

This document outlines the security architecture, vulnerability reporting procedures, data handling practices, and privacy commitments for the Taskify project.

---

## 1. Supported Versions

Security updates and patches are actively maintained for the latest release on the primary development branch.

| Version Branch | Supported | Release Status |
| :--- | :--- | :--- |
| `main` (current) | Yes | Active Development |
| `< 1.0.0` (legacy) | No | Deprecated |

---

## 2. Reporting a Vulnerability

The Taskify project takes security issues seriously and appreciates responsible disclosure from the community.

If you identify a security vulnerability, please follow these guidelines:

1. **Do not disclose the vulnerability publicly** through GitHub issues, pull requests, discussions, or social media.
2. Report the vulnerability privately to the project maintainer:
   - **Maintainer**: Purvesh Shinde
   - **Channel**: Use [GitHub Private Vulnerability Reporting](https://github.com/PurveshShinde/Taskify/security/advisories) on the repository, or reach out directly through the maintainer's profile at https://github.com/PurveshShinde.
3. In your report, please include:
   - Type of vulnerability (e.g., authentication bypass, SQL/NoSQL injection, cross-site scripting, information disclosure).
   - Detailed step-by-step instructions to reproduce the vulnerability.
   - Proof-of-concept code, HTTP requests, or network payloads where applicable.
   - Potential impact of the issue.
   - Any suggested mitigations or patches.

### Response SLA

- **Initial Response**: Within 48 hours acknowledging receipt of your report.
- **Triage and Assessment**: Within 5 business days evaluating severity and impact.
- **Remediation**: Patches will be developed in private and released in coordination with the reporter.

---

## 3. Security Architecture and Safeguards

### 3.1 Authentication and Token Management

- **Password Storage**: User passwords are never stored in plaintext. Passwords are salted and hashed using `bcryptjs` with standard work factors before persisting to the database.
- **JSON Web Tokens (JWT)**: Private routes require a valid JWT passed via the standard `Authorization: Bearer <token>` header. Tokens are signed server-side using a secret key defined in `JWT_SECRET`.
- **Firebase OAuth Verification**: Google Sign-In relies on Firebase Admin SDK server-side token validation (`verifyIdToken`). Client-supplied tokens are verified against Google's public certificates, ensuring user identity claims cannot be forged.
- **Stateless Verification**: Authentication tokens carry expiration lifetimes and do not rely on server session state, reducing memory leak vectors.

### 3.2 Network and API Protection

- **Cross-Origin Resource Sharing (CORS)**: The Express server enforces origin validation, permitting requests only from configured domains (`CLIENT_ORIGIN` and `FRONTEND_URL`). Unauthorized cross-origin requests are rejected.
- **Environment Isolation**: All sensitive credentials (database connection strings, secret keys, Firebase service account credentials, SMTP passwords) are strictly managed via environment variables (`.env`). `.env` files are ignored by git in `.gitignore`.
- **Database Injection Prevention**: MongoDB interactions are conducted exclusively through Mongoose schemas and typed queries, preventing unescaped NoSQL injection attacks.

---

## 4. Data Handling and Privacy Policy

Taskify respects user privacy and enforces strict data boundary controls:

### 4.1 Voice and Audio Processing

- Voice task creation relies on the browser's native Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).
- Audio captured by the microphone is processed directly by the host browser's speech recognition engine.
- Taskify servers do not record, transmit, store, or analyze raw audio streams or voice recordings. Only the resulting text transcription is transmitted when a user chooses to save a task.

### 4.2 Data Collection and Retention

- **User Accounts**: Taskify stores the minimum information necessary to maintain user accounts: email address, display name, hashed credentials, and optional profile image URL.
- **Workspace Data**: Tasks, project structures, and team discussions are stored in the MongoDB instance associated with the deployment.
- **No Third-Party Tracking**: Taskify does not integrate commercial behavioral tracking trackers, advertising telemetry, or data broker analytics.

### 4.3 Email Verification Tokens

- Verification tokens dispatched for account confirmation are single-use cryptographically random hexadecimal strings with limited lifespans.
- Once an account is validated, the verification token is cleared from the database record.

---

## 5. Deployment Security Checklist

When deploying Taskify to production environments, maintainers must verify:

- Strong, cryptographically random `JWT_SECRET` configured.
- MongoDB instance secured with strong authentication, network access restrictions (IP allowlists), and TLS/SSL enabled.
- Correct `CLIENT_ORIGIN` and `FRONTEND_URL` configured to match the production domain.
- HTTPS enforced across all endpoints with valid TLS certificates.
- Firebase private keys loaded through secure environment variable managers or secret stores rather than plaintext files on disk.

