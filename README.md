IsokoSense
IoT-based intelligent water quality monitoring system. IsokoSense collects real-time sensor data from ESP32-powered Isoko Units (surface) and IsokoChambers (underground pipelines), analyzes contamination against WHO thresholds, and displays results on a React dashboard.
Tech Stack
Layer	Technology
Frontend	React + Vite + Tailwind CSS + Recharts
Backend	Node.js + Express
Database	MongoDB (Firestore/Supabase-compatible document store)
Real-time	Socket.IO (WebSockets)
Auth	JWT (email/password)
Project Structure
```
IsokoSense/
├── backend/
│   ├── config/           # Database connection
│   ├── controllers/      # Route handlers
│   ├── middleware/       # JWT auth
│   ├── models/           # MongoDB schemas
│   ├── routes/           # REST API routes
│   ├── scripts/seed.js   # Demo data seeder
│   ├── services/         # ContaminationEngine, validation
│   ├── simulator.js      # ESP32 data simulator
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/          # API client
│       ├── components/   # Layout, Sidebar, Header
│       ├── context/      # Auth context
│       └── pages/        # Dashboard pages
└── README.md
```
Prerequisites
Node.js 18+
MongoDB running locally (or MongoDB Atlas URI)
Setup
1. Backend
```bash
cd backend
npm install
cp .env.example .env   # edit values as needed
npm run seed           # 3 devices + 7 days history + demo users
npm run dev            # starts API on port 5000
```
2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev            # starts dashboard on http://localhost:5173
```
3. Data Simulator (optional)
In a separate terminal:
```bash
cd backend
npm run simulate
```
Posts randomized readings every 15 seconds to `POST /api/readings`. ~12% of readings inject out-of-range values to trigger alerts.
Demo Accounts
Email	Password	Role
admin@isokosense.com	admin123	admin (full access)
viewer@isokosense.com	viewer123	viewer (monitoring only)
Environment Variables
Backend (`backend/.env`)
Variable	Description	Default
`MONGODB_URI`	MongoDB connection string	`mongodb://localhost:27017/isokosense`
`PORT`	API server port	`5000`
`JWT_SECRET`	Secret for signing JWT tokens	(required)
`CORS_ORIGIN`	Allowed frontend origin	`http://localhost:5173`
`OFFLINE_THRESHOLD_MINUTES`	Minutes before device marked offline	`5`
`API_URL`	Base URL for simulator	`http://localhost:5000`
Frontend (`frontend/.env`)
Variable	Description	Default
`VITE_API_URL`	Backend API base URL	`http://localhost:5000`
API Documentation
Base URL: `http://localhost:5000`
All routes except `POST /api/readings` and auth register/login require:
```
Authorization: Bearer <token>
```
Health
Method	Path	Auth	Description
GET	`/api/health`	No	Service health check
Authentication
Method	Path	Description
POST	`/api/auth/register`	Register user `{ fullName, email, password, role?, organization? }`
POST	`/api/auth/login`	Login `{ email, password }` → `{ token, user }`
GET	`/api/auth/me`	Current user profile
Sensor Ingestion (ESP32 — no auth)
Method	Path	Body
POST	`/api/readings`	`{ deviceId, locationId, ph, turbidity, temperature, tds, timestamp }`
Returns `{ status, overallStatus, reading, alerts }`. Automatically creates alerts when thresholds are exceeded.
Readings
Method	Path	Description
GET	`/api/readings`	All readings (paginated: `?page=1&limit=20`)
GET	`/api/readings/latest`	Latest reading per device
GET	`/api/readings/:deviceId`	Readings for device
GET	`/api/readings/:deviceId/history`	History for charts (`?startDate=&endDate=`)
Alerts
Method	Path	Description
GET	`/api/alerts`	All alerts (`?severity=&resolved=&startDate=&endDate=`)
GET	`/api/alerts/:id`	Single alert with full details
PATCH	`/api/alerts/:id/resolve`	Mark resolved (admin only)
Devices
Method	Path	Description
GET	`/api/devices`	All registered devices
POST	`/api/devices`	Register device
PATCH	`/api/devices/:id`	Update device
GET	`/api/devices/:id/status`	Online/offline + last ping
Dashboard
Method	Path	Description
GET	`/api/dashboard/summary`	Overview stats, monitoring points, recent alerts
Safety Thresholds
Parameter	Safe	Warning	Critical
pH	6.5 – 8.5	< 6.0 or > 9.0	< 5.0 or > 10.0
Turbidity	< 4 NTU	4 – 10 NTU	> 10 NTU
Temperature	10°C – 25°C	25°C – 35°C	> 35°C or < 5°C
TDS	< 500 mg/L	500 – 1000 mg/L	> 1000 mg/L
The ContaminationEngine (`backend/services/contaminationEngine.js`) evaluates each reading and generates alerts with severity-specific remediation text.
Real-time Events (Socket.IO)
Connect to the same origin as the API. Events emitted:
`reading:new` — new sensor reading ingested
`alert:new` — new contamination alert(s)
`alert:resolved` — alert marked resolved
Dashboard Pages
Overview — System status banner, summary cards, alert feed, monitoring point grid
Live Monitoring — Device selector, live readings with color-coded gauges (10s refresh)
Historical Data — Date range charts, parameter toggles, CSV export
Alerts — Filterable table, expandable remediation panel, resolve (admin)
Devices — Device list, register/edit/deactivate (admin)
Login — Email/password auth with admin/viewer roles
Production Notes
Set a strong `JWT_SECRET` in production
Use MongoDB Atlas or managed MongoDB
Configure `CORS_ORIGIN` to your deployed frontend URL
Build frontend: `cd frontend && npm run build`
Serve frontend static files via CDN/nginx; proxy `/api` to backend
License
ISC
