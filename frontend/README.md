# WhistleDrop — Frontend Client

> **"Speak Without Being Seen"**  
> An anonymous, zero-account confidential incident intake & cryptographic tracking web application.

---

## 🛡️ Project Overview

**WhistleDrop** provides a secure, privacy-first interface for lodging and tracking confidential organizational disclosures. Submissions require zero registration, email, or device identity logging. Reporters receive collision-safe, high-entropy case codes (e.g., `WD-9K4M8X2P`) that allow querying status milestones and moderator communications anonymously.

This frontend connects to the pre-existing, production-grade Spring Boot backend running locally.

---

## ⚡ Technologies

- **React 19** with TypeScript
- **Vite** (bundler & development server)
- **React Router DOM 7** (client-side routing & route guards)
- **Axios** (centralized HTTP client with JWT interceptor and global error mapping)
- **Tailwind CSS v4** (`@tailwindcss/vite` plugin with custom typography tokens)
- **Lucide React** (modern iconography)
- **Google Fonts** (Plus Jakarta Sans for UI, JetBrains Mono for cryptographic case codes)

---

## 🌐 Backend Requirement

This frontend communicates directly with the WhistleDrop Spring Boot backend.
Ensure the backend is running at:

```
http://localhost:8080
```

Swagger API documentation is available at:
```
http://localhost:8080/swagger-ui/index.html
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `frontend/` directory (see `.env.example`):

```env
# Spring Boot Backend API Base URL
VITE_API_BASE_URL=http://localhost:8080
```

---

## 🚀 Setup & How to Run

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Vite Development Server
```bash
npm run dev
```

The application will be served at:
```
http://localhost:5173
```

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🗺️ Application Routes

### Public Routes
- **`/`**: Landing page with hero, privacy pillars, protocol guide, and FAQ.
- **`/report`**: Anonymous confidential report submission with category selection, real-time validation, and confirmation review.
- **`/report/success`**: Submission confirmation exhibiting the assigned high-entropy case tracking code with copy utility.
- **`/track`**: Anonymous case tracking search input.
- **`/track/:caseCode`**: Live case tracking terminal with status badge, narrative preview, and vertical chronological audit timeline.

### Moderator Administration Routes
- **`/moderator/login`**: Authenticated moderator entry with credential validation (`moderator` / `Admin@12345`).
- **`/moderator/dashboard`**: Triage overview featuring dynamic metric cards (Total, Submitted, Under Review, Resolved, Dismissed), search by case code, category and status filtering, and paginated table.
- **`/moderator/reports/:caseCode`**: Comprehensive report inspection, narrative & evidence reviewer, allowed status transition engine, and audit logging interface.

---

## 🔐 Default Moderator Test Credentials

As initialized by the backend `DataInitializer`:
- **Username**: `moderator`
- **Password**: `Admin@12345`
- **Role**: `ROLE_MODERATOR`

---

## 📸 Screenshots

*(Interface preview placeholders)*

- **Landing Terminal**: `/`
- **Confidential Intake Form**: `/report`
- **Case Code Verification**: `/report/success`
- **Anonymous Tracking Ledger**: `/track/:caseCode`
- **Moderator Console**: `/moderator/dashboard`
- **Status Transition Console**: `/moderator/reports/:caseCode`

---

## 🔒 Security & Privacy Guarantees

1. **Zero Identifier Collection**: The submission form does not solicit personal identities, email addresses, phone numbers, or account registrations.
2. **Stateless JWT Transmission**: Bearer authentication tokens are isolated exclusively to moderator endpoints (`/api/moderator/**` and `/api/auth/me`).
3. **No Leakage**: Public tracking endpoints operate strictly without requiring authentication tokens or disclosing backend IDs.
4. **State Transition Integrity**: Moderator status modifications adhere strictly to backend-enforced transition states (`allowedTransitions`).
