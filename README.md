# 🎯 SkillSwap — Peer-to-Peer Skill Exchange Platform

**SkillSwap** is a full-stack web application designed for students to list skills they can teach and skills they want to learn, get matched with compatible peers through a weighted matching algorithm, schedule learning sessions, share resources, earn points, and build an auto-generated portfolio of their learning activity.

---

## ⚙️ Tech Stack & Architecture

- **Backend**: Node.js, Express.js, TypeScript, Mongoose (MongoDB), JWT (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`
- **Frontend**: React 18, TypeScript, Tailwind CSS, React Router v6, Axios, Vite, Lucide Icons
- **Database**: MongoDB (Atlas cloud-hosted or local MongoDB)
- **Architecture Layer**: Route → Middleware → Controller → Service → Model → Database
- **Role Model**: Single dual-capability `Student` role (acting as both mentor and learner on the same account)

---

## 🚀 Setup & Running Instructions

### 1. Backend Setup
```bash
cd skillswap/backend

# Install dependencies
npm install

# Configure Environment Variables (.env is pre-configured with default local fallback)
# MONGO_URI=mongodb://127.0.0.1:27017/skillswap
# JWT_SECRET=skillswap_super_secret_jwt_key_2026

# Start backend in development mode
npm run dev
# Server will run at: http://localhost:5000
```

### 2. Frontend Setup
```bash
cd skillswap/frontend

# Install dependencies
npm install

# Start Vite frontend server
npm run dev
# Frontend will run at: http://localhost:3000
```

---

## 🧪 REST API Endpoints

### Auth Routes (`/api/auth`)
- `POST /api/auth/register` — Register a new student account
- `POST /api/auth/login` — Authenticate and receive JWT token

### User Routes (`/api/users`)
- `GET /api/users/search?skill=...` — Search peers by skill keyword
- `GET /api/users/:id` — Fetch user profile
- `PUT /api/users/:id` — Update user profile details & skills offered/wanted
- `GET /api/users/:id/matches` — Compute and sort weighted match scores against peers

### Session Routes (`/api/sessions`)
- `POST /api/sessions` — Create session request
- `GET /api/sessions/user/:id` — Fetch sessions involving user
- `PATCH /api/sessions/:id/status` — Transition session status (`requested` → `confirmed` → `completed` | `rejected`). Triggers **+50 points** award upon `completed`.

### Resource Routes (`/api/resources`)
- `POST /api/resources` — Share a resource URL with tags (Triggers **+20 points** award)
- `GET /api/resources` — Browse shared resources with optional tag filter

### Portfolio Routes (`/api/portfolio`)
- `GET /api/portfolio/:userId` — Fetch derived on-the-fly aggregate portfolio (skills learned, skills taught, session history, resources, total points)

---

## 🎨 9 Frontend Pages Included
1. **Login Page** (`/login`) — Public sign-in with quick seed demo toggles
2. **Register Page** (`/register`) — Profile setup with initial skills offered/wanted
3. **Dashboard** (`/dashboard`) — Analytics stats, top matches, recent session activity
4. **My Profile / Peer Profile** (`/profile`, `/profile/:id`) — Editable tag chips & peer session request
5. **Discover Page** (`/discover`) — Search & filter peers by weighted compatibility score
6. **Session Tracker** (`/sessions`) — Status pipeline board & meeting link launcher
7. **Resource Library** (`/resources`) — Community resource sharing & tag filtering
8. **Portfolio Page** (`/portfolio`, `/portfolio/:id`) — Read-only compiled showcase & shareable link
9. **404 Not Found** (`*`) — Clean error layout with return navigation

---

## ⚖️ Weighted Match Algorithm

Calculates reciprocal score between User A (current user) and User B (candidate peer):
1. `aOffersToB`: Overlap between A's skills offered & B's skills wanted.
2. `bOffersToA`: Overlap between B's skills offered & A's skills wanted.
3. `mutualScore`: Symmetrical percentage score (0-100%) ranking top matches.
