
ALL INDIA VILLAGES API
Project Documentation


Version 1.0  |  May 2026
Stack: Node.js  •  Express.js  •  PostgreSQL  •  Prisma  •  React  •  TypeScript

 
1. Project Overview
The All India Villages API is a full-stack geospatial data platform that exposes a structured, hierarchical directory of every village in India based on Census 2011 data. It enables businesses, developers, and government bodies to query Indian geographical data — from Country down to individual Villages — through a secure, rate-limited REST API.

The platform has two primary user-facing interfaces:
•	A public-facing landing page (IndiaExplore) where anyone can browse the village hierarchy interactively.
•	A B2B portal where registered businesses can manage their accounts, generate API keys, and monitor usage.
•	An admin dashboard for platform administrators to manage users and view analytics.

1.1 Key Highlights
Feature	Description
Data Source	Census 2011 — XLS/ODS files covering all Indian states
Hierarchy	Country → State → District → Sub-District → Village
Authentication	JWT for portal login; API Key + Secret for API access
Rate Limiting	Plan-based daily quotas (FREE: 5K, PREMIUM: 50K, PRO: 300K, UNLIMITED: 1M)
Caching	Redis used for rate limiting and key lookup caching
Database	PostgreSQL via Prisma ORM
Frontend	React + TypeScript + Vite + TailwindCSS
Backend	Node.js + Express.js v5

 
2. Code Architecture
The project is structured as a monorepo with three main directories:

2.1 Directory Structure
all-india-villages-api/
  ├── backend/                  # Node.js + Express API server
  │   ├── server.js             # Entry point, middleware setup
  │   ├── routes/               # Route definitions (v1, admin, b2b)
  │   ├── controllers/          # Business logic handlers
  │   ├── middleware/           # Auth, rate limiting, logging, formatting
  │   ├── prisma/               # Database schema & migrations
  │   ├── utils/                # DB and Redis client utilities
  │   └── scripts/              # Seed data scripts
  ├── frontend/                 # React + TypeScript SPA
  │   ├── src/pages/            # Page components (Landing, Login, Admin, B2B)
  │   ├── src/components/       # Reusable layout components
  │   ├── src/store/            # Zustand auth store
  │   └── src/App.tsx           # Router & protected routes
  └── dataset/                  # Census 2011 XLS/ODS files (state-wise)

2.2 Database Schema
The data model follows a strict 5-level geographical hierarchy plus a user/auth subsystem:

Country  (1)
  └── State  (N)           -- e.g. Madhya Pradesh, Maharashtra
       └── District  (N)    -- e.g. Indore, Pune
            └── SubDistrict (N)  -- also called Mandal/Tehsil
                 └── Village  (N)  -- leaf node, identified by MDDS PLCN code

Supporting models:
•	User — Stores B2B business accounts with plan type, status, and role (USER / ADMIN).
•	ApiKey — Each user can have multiple API key/secret pairs with ACTIVE or REVOKED status.
•	UserStateAccess — Access control table granting a user access to specific states.
•	ApiLog — Every API call is logged with endpoint, response time, status code, and IP address.

2.3 Request Flow
Client Request
  ↓
  Helmet (security headers)
  ↓
  CORS
  ↓
  defaultLimiter (100 req/day general limit)
  ↓
  Route (v1 / admin / b2b)
  ↓
  responseFormatter  ←─ Wraps all responses in { success, data } envelope
  ↓
  authenticateApiKey ←─ Validates X-API-Key header against DB
  ↓
  apiLimiter         ←─ Plan-based per-key daily quota via Redis
  ↓
  apiLogger          ←─ Logs endpoint, timing, status to ApiLog table
  ↓
  Controller         ←─ Prisma query → PostgreSQL
  ↓
  JSON Response

 
3. Backend Module
3.1 Entry Point — server.js
The server initialises Express with Helmet (security headers), CORS, and JSON body parsing. It mounts three route groups and starts listening on the configured PORT (default 3000). Global error handlers catch uncaught exceptions and unhandled promise rejections to prevent process crashes.
3.2 Route Groups
Prefix	File	Purpose
/v1	routes/v1.js	Public geo API (requires API key)
/admin	routes/admin.js	Admin: user management & analytics (JWT protected)
/b2b	routes/b2b.js	B2B: auth, registration, API key management

3.3 API Endpoints
All geo endpoints require the X-API-Key header. Responses are wrapped in a standard envelope: { success: true, data: [...] }.

Method	Endpoint	Description
GET	/v1/states	List all Indian states
GET	/v1/states/:id/districts	List districts for a state
GET	/v1/districts/:id/subdistricts	List sub-districts for a district
GET	/v1/subdistricts/:id/villages	List villages (paginated: ?page=&limit=)
GET	/v1/autocomplete?q=	Village name autocomplete with full hierarchy
GET	/v1/search?q=&state=	Filtered village search by name/state/district
POST	/b2b/register	Register a new B2B business account
POST	/b2b/login	Login and receive JWT token
POST	/b2b/keys	Generate a new API key + secret
GET	/b2b/keys	List all API keys for the authenticated user
DELETE	/b2b/keys/:id	Revoke an API key
GET	/b2b/usage	View API usage statistics
GET	/admin/users	Admin: list all users
PUT	/admin/users/:id/approve	Admin: approve/activate a user
GET	/admin/analytics	Admin: platform-wide analytics

3.4 Middleware
apiAuth.js
Two authentication strategies are implemented:
•	authenticateToken — Verifies a JWT from the Authorization: Bearer <token> header. Used on admin and B2B routes.
•	authenticateApiKey — Looks up the X-API-Key header in the database. For write operations (POST/PUT/DELETE), it additionally validates the X-API-Secret header using bcrypt comparison.
rateLimiter.js
Two limiters are configured using express-rate-limit with a Redis backing store:
•	defaultLimiter — 100 requests per 24 hours for all routes. General abuse protection.
•	apiLimiter — Per-API-key quota based on the user plan. FREE: 5,000 | PREMIUM: 50,000 | PRO: 300,000 | UNLIMITED: 1,000,000 requests per day.
responseFormatter.js
Intercepts res.json() to automatically wrap all responses in a standard envelope: { success: true/false, data: ... }. This ensures consistent response structure across all endpoints.
apiLogger.js
After each request, logs the endpoint, HTTP status code, response time (in ms), IP address, user ID, and API key ID into the ApiLog table in PostgreSQL. This powers the admin analytics dashboard.

3.5 Data Import Script
scripts/import_data.py is a Python script that reads all Census 2011 XLS/ODS files from the dataset/ folder and populates the PostgreSQL database. It processes each row and inserts State, District, SubDistrict, and Village records using ON CONFLICT DO NOTHING to handle duplicates idempotently. State/District/SubDistrict IDs are cached in-memory dictionaries during the run to avoid repeated DB lookups.

 
4. Frontend Module
The frontend is a React + TypeScript SPA built with Vite and styled with TailwindCSS. It communicates with the backend API using Axios.
4.1 Routing
Routing is handled by React Router v6. Three route groups exist:
Route	Component	Access
/	LandingPage	Public
/login	Login	Public
/dashboard/*	B2BDashboard, B2BKeys	Protected (JWT required)
/admin/*	AdminDashboard, AdminUsers	Protected (ADMIN role required)

4.2 Landing Page — LandingPage.tsx
The landing page serves as both the public face of the platform and a live demo of the API. Key features:
•	Sticky responsive navbar with mobile hamburger menu.
•	Hero section with a headline and two CTAs (Access Directory, Create Account).
•	Location Index — a 5-column hierarchical dropdown selector (Country → State → District → Mandal → Village). Each dropdown is populated by a live API call and is disabled until its parent is selected. Loading spinners are shown during fetch.
•	On clicking Retrieve Data, a success card shows the full address hierarchy and a Google Maps link for the selected village.
•	Features section explaining the platform's data structure.
•	Footer with Privacy / Terms / Docs links.
Design: Dark emerald (#0a2e1e) background, amber (#d97706) accent colour, serif typography — an editorial, luxury aesthetic.

4.3 Auth Store — authStore.ts
Global auth state is managed with Zustand. The store holds the JWT token, user object (id, email, planType, role), and exposes login() and logout() actions. The ProtectedRoute component in App.tsx reads from this store to guard routes, redirecting to /login if no token is present, or to /dashboard if a non-admin accesses /admin.
4.4 Dashboard Layout
Both the admin and B2B portal share a DashboardLayout component that renders a Sidebar and TopBar. The Sidebar shows role-appropriate navigation links. The TopBar displays the current user and a logout button. Page content is rendered via an <Outlet />.

 
5. Implemented Features
Feature	Status
Hierarchical geo data API (States → Villages)	✅ Implemented
Village autocomplete with full hierarchy	✅ Implemented
Filtered village search	✅ Implemented
B2B user registration & login	✅ Implemented
JWT authentication	✅ Implemented
API key + secret generation	✅ Implemented
API key revocation	✅ Implemented
Plan-based rate limiting (Redis)	✅ Implemented
API request logging to DB	✅ Implemented
Admin user management	✅ Implemented
Admin analytics endpoint	✅ Implemented
Landing page with live village demo	✅ Implemented
B2B dashboard & key management UI	✅ Implemented
Census 2011 data import script	✅ Implemented
Response formatter middleware	✅ Implemented
Security headers via Helmet	✅ Implemented

 
6. Pending Work & Future Improvements
6.1 Backend
•	Admin role enforcement: The /admin routes currently use JWT auth but do not verify the ADMIN role server-side — only the frontend enforces this. A middleware check for req.userToken.role === 'ADMIN' should be added.
•	State-level access control: The UserStateAccess model exists in the schema but the geo controller does not filter results based on a user's allowed states. This needs to be wired into the query layer.
•	Refresh tokens: JWT tokens expire in 24 hours with no refresh mechanism. A /b2b/refresh endpoint should be added.
•	Pagination on all list endpoints: Currently only /villages supports pagination. States, districts, and sub-districts should also support cursor or offset pagination for completeness.
•	Environment validation: No startup check validates that DATABASE_URL, JWT_SECRET, and REDIS_URL are set. A validation step should be added to fail fast on misconfiguration.
•	Unit and integration tests: No test suite exists. Jest + Supertest tests should cover controllers and middleware.
6.2 Frontend
•	Admin logs page: The /admin/logs route renders a placeholder div. A full API log viewer with filters and pagination needs to be built.
•	State access management UI: /admin/access also renders a placeholder. An interface to grant/revoke state access per user is needed.
•	Village master page: /admin/villages is a placeholder for future bulk data management.
•	API documentation page: /dashboard/docs is a placeholder. Interactive API docs (Swagger-style or a custom docs page) should be built.
•	Error handling UX: API errors in the landing page are silently logged to console. User-facing error messages and retry UI should be added.
•	Usage charts: The B2B dashboard should visualize daily/monthly API usage over time using the /b2b/usage endpoint.
6.3 Infrastructure
•	Deployment configuration: No Docker files, CI/CD pipelines, or deployment scripts are present. Docker Compose for local dev and a production deployment pipeline should be added.
•	Full Census 2011 coverage: The dataset folder is missing some states (e.g., state codes 01, 04, 05, 07, 14). Remaining XLS files need to be sourced and imported.
•	Sensitive credential cleanup: The import script (scripts/import_data.py) contains a hardcoded database password. This must be moved to an environment variable before any public sharing.
•	HTTPS / TLS: No SSL configuration is present. Production deployments should be behind a reverse proxy (Nginx) with TLS termination.


7. Local Setup Guide
7.1 Prerequisites
•	Node.js v18+
•	Python 3.9+ (for data import)
•	PostgreSQL 14+
•	Redis 7+
7.2 Backend Setup
cd backend
npm install

# Create .env
DATABASE_URL=postgresql://user:password@localhost:5432/all_india_villages
JWT_SECRET=your_secret_key
REDIS_URL=redis://localhost:6379
PORT=3000

# Run migrations
npx prisma migrate deploy

# Start server
npm start
7.3 Data Import
# Install Python dependencies
pip install pandas psycopg2 openpyxl odfpy

# Update DB credentials in scripts/import_data.py
# Run the import
python scripts/import_data.py
7.4 Frontend Setup
cd frontend
npm install

# Create .env
VITE_API_URL=http://localhost:3000
VITE_API_KEY=your_api_key

# Start dev server
npm run dev
