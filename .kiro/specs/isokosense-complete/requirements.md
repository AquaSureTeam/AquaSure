# Requirements Document

## Introduction

IsokoSense is an IoT water quality monitoring system for water authorities in Rwanda. The system currently has a partial implementation with a 2-role auth model, basic device/reading/alert management, and a partial frontend. This requirements document covers all gaps needed to reach production readiness: a 4-role RBAC system, community notification dispatch, device maintenance logging, user management, enhanced dashboard, new frontend pages, and an expanded seed/simulator.

All requirements build on the existing Node.js + Express + MongoDB backend and React + TypeScript + Tailwind frontend without introducing new dependencies.

---

## Glossary

- **System**: The IsokoSense API server and frontend application collectively.
- **API**: The Express REST backend running on Node.js.
- **Super_Admin**: A user with role `super_admin` — full system access.
- **Officer**: A user with role `officer` — water authority officer (WASAC-type); can resolve alerts and send community notifications.
- **Technician**: A user with role `technician` — field device technician; can manage devices and log maintenance.
- **Viewer**: A user with role `viewer` — read-only access.
- **Notification**: A community-facing water safety message sent to a geographic zone.
- **Zone**: A named geographic area (e.g. "Kacyiru Sector") to which community Notifications are addressed.
- **Alert**: A contamination event record generated when a sensor reading exceeds a safety threshold.
- **Reading**: A sensor data payload (pH, turbidity, temperature, TDS) from an IoT device.
- **MaintenanceLog**: A record of a maintenance activity performed on a Device.
- **JWT**: JSON Web Token used for stateless authentication.
- **RBAC**: Role-Based Access Control.
- **Socket.io**: The real-time event bus used between the API and frontend.
- **ContaminationEngine**: The existing service (`backend/services/contaminationEngine.js`) that evaluates readings against thresholds.

---

## Requirements

### Requirement 1: Role System Expansion

**User Story:** As a Super_Admin, I want a 4-role access system, so that water authority staff, field technicians, and read-only viewers each have appropriate permissions with no over-privilege.

#### Acceptance Criteria

1. THE System SHALL support exactly four user roles: `super_admin`, `officer`, `technician`, and `viewer`.
2. THE User model SHALL include `isActive` (Boolean, default `true`), `lastLogin` (Date), and `assignedLocations` (Array of strings) fields in addition to the existing fields.
3. THE `toSafeObject()` method on User SHALL return `isActive`, `lastLogin`, and `assignedLocations` alongside existing fields.
4. THE `roleMiddleware` SHALL export a `requireRole(...roles)` function that accepts one or more role strings and returns HTTP 403 with `{ message: 'Access denied' }` when the authenticated user's role is not in the list.
5. WHEN a login request is made for a user where `isActive === false`, THE API SHALL return HTTP 403 with `{ message: 'Account deactivated' }` and SHALL NOT issue a JWT token.
6. WHEN a user successfully logs in, THE System SHALL record the current timestamp in `user.lastLogin` and persist it to the database before returning the response.
7. WHEN an authenticated request is made to a role-protected endpoint by a user whose role is not in the allowed list, THE API SHALL return HTTP 403 with `{ message: 'Access denied' }`.

---

### Requirement 2: Community Notification System

**User Story:** As an Officer, I want to send community water safety notifications to geographic zones, so that residents are informed when water quality events occur.

#### Acceptance Criteria

1. THE System SHALL provide a `Zone` model with fields: `zoneId` (String, unique), `name`, `district`, `description`, `active` (Boolean).
2. THE System SHALL provide a `Notification` model with fields: `sentBy` (userId, name, role), `zone` (zoneId, name), `type` (enum: CONTAMINATION_WARNING, DO_NOT_USE, SERVICE_DISRUPTION, WATER_NOW_SAFE), `message`, `linkedAlertId` (optional), `linkedParameter` (optional), `timestamp`, `status` (enum: sent, draft), `expiresAt`, `extendedBy`.
3. WHEN a Notification is created, THE System SHALL set `expiresAt` to exactly 72 hours after the creation `timestamp`.
4. THE API SHALL expose GET `/api/notifications/zone/:zoneId` as a public endpoint (no auth required) that returns only notifications where `status === 'sent'` AND `expiresAt > Date.now()`.
5. WHEN a Super_Admin or Officer calls POST `/api/notifications`, THE System SHALL create a notification, populate `sentBy` from the authenticated user, and emit a `notification:new` Socket.io event when `status === 'sent'`.
6. WHEN a Reading ingestion produces a critical-severity Alert and the Alert's `locationId` matches an active Zone's `zoneId`, THE System SHALL automatically create a Notification with `status: 'draft'` linked to that Alert via `linkedAlertId`, and emit a `notification:draft` Socket.io event.
7. WHEN a Super_Admin calls PATCH `/api/notifications/:id/extend`, THE System SHALL add 72 hours to the notification's current `expiresAt` and record the Super_Admin's user ID in `extendedBy`.
8. WHEN a Super_Admin calls DELETE `/api/notifications/:id`, THE System SHALL permanently remove the notification.
9. THE API SHALL expose GET `/api/zones` (authenticated) returning all active zones, POST `/api/zones` (super_admin), PATCH `/api/zones/:id` (super_admin), and DELETE `/api/zones/:id` (super_admin, soft-delete by setting `active: false`).
10. WHEN a Technician or Viewer calls POST `/api/notifications`, THE API SHALL return HTTP 403.

---

### Requirement 3: Maintenance Logs

**User Story:** As a Technician, I want to log maintenance activities against devices and toggle maintenance mode, so that the team has a clear service history and device availability is accurately reflected.

#### Acceptance Criteria

1. THE System SHALL provide a `MaintenanceLog` model with fields: `deviceId`, `loggedBy` (userId, name, role), `activity`, `notes`, `date`, `maintenanceMode`.
2. THE `Device` model SHALL include a `maintenanceMode` Boolean field (default `false`).
3. WHEN a Super_Admin or Technician calls POST `/api/devices/:id/maintenance`, THE System SHALL create a `MaintenanceLog` entry with `loggedBy` populated from `req.user` and return the created log entry.
4. WHEN GET `/api/devices/:id/maintenance` is called by a Super_Admin, Officer, or Technician, THE System SHALL return the full maintenance history for that device sorted by `date` descending.
5. WHEN a Super_Admin or Technician calls PATCH `/api/devices/:id/maintenance-mode` with `{ maintenanceMode: true }`, THE System SHALL set `Device.maintenanceMode` to `true`, and emit a `device:maintenanceMode` Socket.io event.
6. WHEN a Super_Admin or Technician calls PATCH `/api/devices/:id/maintenance-mode` with `{ maintenanceMode: false }`, THE System SHALL set `Device.maintenanceMode` to `false`.
7. IF a Viewer or Officer calls POST `/api/devices/:id/maintenance`, THEN THE API SHALL return HTTP 403.

---

### Requirement 4: User Management

**User Story:** As a Super_Admin, I want to create and manage system users, so that I can onboard staff with correct roles and deactivate users who leave the organisation.

#### Acceptance Criteria

1. THE API SHALL expose GET `/api/users` (super_admin only) returning a paginated list of all users as safe objects (no passwords), with pagination metadata `{ page, limit, total, pages }`.
2. WHEN a Super_Admin calls PATCH `/api/users/:id` with `{ role, isActive, organization, assignedLocations }`, THE System SHALL update those fields on the target user and return the updated safe object.
3. IF a Super_Admin calls PATCH `/api/users/:id` where `:id` matches the Super_Admin's own user ID, THEN THE System SHALL return HTTP 400 with `{ message: 'Cannot modify your own account role or status' }`.
4. WHEN a Super_Admin calls DELETE `/api/users/:id`, THE System SHALL set `isActive: false` on that user (soft delete) without removing the document.
5. WHEN POST `/api/auth/register` is called, THE System SHALL require an authenticated Super_Admin JWT, UNLESS the total user count in the database is zero (bootstrap mode), in which case the request SHALL be allowed unauthenticated and the new user's role SHALL be forced to `super_admin`.
6. IF a non-Super_Admin authenticated user calls POST `/api/auth/register`, THEN THE System SHALL return HTTP 403.

---

### Requirement 5: Dashboard Summary Enhancement

**User Story:** As an Officer or Super_Admin, I want the dashboard summary to include notification and maintenance context, so that I can quickly assess community communication and device availability.

#### Acceptance Criteria

1. WHEN GET `/api/dashboard/summary` is called, THE System SHALL include `notificationsSent24h` — an integer count of notifications with `status === 'sent'` and `timestamp >= now - 24h`.
2. WHEN GET `/api/dashboard/summary` is called, THE System SHALL include `pendingDraftNotifications` — an array of notification documents with `status === 'draft'` (up to 10 most recent).
3. WHEN GET `/api/dashboard/summary` is called, THE System SHALL include `maintenanceDevices` — an object with `count` (integer) and `devices` (array of `{ deviceId, name }` for all devices where `maintenanceMode === true`).

---

### Requirement 6: Frontend Role-Based Navigation

**User Story:** As any authenticated user, I want the sidebar navigation to show only the pages relevant to my role, so that I am not presented with functionality I cannot use.

#### Acceptance Criteria

1. THE Frontend SHALL display a sidebar with role-specific navigation links:
   - super_admin: Overview, Live Monitoring, Historical Data, Alerts, Notifications, Devices, Users, Admin Panel
   - officer: Overview, Live Monitoring, Historical Data, Alerts, Notifications
   - technician: Overview, Live Monitoring, Historical Data, Alerts, Devices
   - viewer: Overview, Live Monitoring, Historical Data, Alerts, Notifications
2. THE `AuthContext` SHALL expose boolean helpers: `isSuperAdmin`, `isOfficer`, `isTechnician`, `isViewer`, `canNotify` (super_admin or officer), `canResolveAlerts` (super_admin or officer), `canManageDevices` (super_admin or technician).
3. WHEN a user navigates directly to `/users` or `/admin` and their role is not `super_admin`, THE Frontend SHALL redirect them to `/`.
4. THE Frontend SHALL remove all references to the legacy `isAdmin` helper and replace them with the new role helpers.

---

### Requirement 7: Notifications Page

**User Story:** As a community member or authenticated user, I want to view water safety notifications for my zone, so that I know whether water is safe to use.

#### Acceptance Criteria

1. THE Notifications page at `/notifications` SHALL display a public-facing community feed showing non-expired sent notifications grouped by zone.
2. WHEN displaying a notification card, THE Frontend SHALL show a color-coded type badge: red for CONTAMINATION_WARNING, black for DO_NOT_USE, orange for SERVICE_DISRUPTION, green for WATER_NOW_SAFE.
3. WHEN displaying a notification card, THE Frontend SHALL show the message text, relative time ("sent X hours ago"), and the sender's name.
4. THE Frontend SHALL hide notifications where `expiresAt < Date.now()` on the client side in addition to the server-side filter.
5. WHEN the authenticated user has role `officer` or `super_admin`, THE Notifications page SHALL display a "Send Notification" button and a separate "Drafts" tab showing pending draft notifications.
6. WHEN an Officer or Super_Admin clicks "Review & Send" on a draft notification, THE Frontend SHALL open the `NotificationDispatchModal` pre-populated with the draft's zone, type, message, and linked parameter.
7. WHEN a Super_Admin clicks "Delete" on a notification, THE Frontend SHALL call DELETE `/api/notifications/:id` and remove the card from the feed.

---

### Requirement 8: Notification Dispatch Modal

**User Story:** As an Officer, I want a dispatch form to compose and send community notifications, so that I can quickly communicate water safety events with correct zone and type information.

#### Acceptance Criteria

1. THE `NotificationDispatchModal` SHALL include a zone selector populated from GET `/api/zones`.
2. THE `NotificationDispatchModal` SHALL include a notification type selector showing all four types with color-coded badges.
3. WHEN the modal is launched from an Alert context, THE Frontend SHALL pre-populate the message field with the alert's `remediation` text and set the `linkedParameter` to the alert's `parameter`.
4. THE `NotificationDispatchModal` SHALL include a preview section showing how the notification card will appear before submission.
5. WHEN "Send Now" is clicked, THE Frontend SHALL call POST `/api/notifications` with `status: 'sent'` and close the modal on success.

---

### Requirement 9: User Management Page

**User Story:** As a Super_Admin, I want a user management page, so that I can onboard new staff, change roles, and deactivate accounts without touching the database directly.

#### Acceptance Criteria

1. THE Users page at `/users` SHALL be accessible only to users with role `super_admin`.
2. THE Users page SHALL display a table with columns: full name, email, role badge, status (Active/Inactive), last login, and organization.
3. WHEN "Add User" is clicked, THE Frontend SHALL open a modal with fields: fullName, email, password, role, and organization, and call POST `/api/auth/register` on submission.
4. WHEN a role dropdown is changed inline, THE Frontend SHALL call PATCH `/api/users/:id` and reflect the updated role in the table.
5. WHEN "Deactivate" is clicked for a user, THE Frontend SHALL call DELETE `/api/users/:id` and update the user's status to "Inactive" in the table.

---

### Requirement 10: Admin Control Panel

**User Story:** As a Super_Admin, I want an admin control panel with system health, zone management, and notification statistics, so that I can monitor system state and manage community infrastructure.

#### Acceptance Criteria

1. THE Admin panel at `/admin` SHALL be accessible only to users with role `super_admin`.
2. THE Admin panel SHALL display a System Health section showing API status (from GET `/api/health`) and device connectivity summary from the dashboard.
3. THE Admin panel SHALL display a Community Zones section with a CRUD table for zones (list, create via POST `/api/zones`, update via PATCH `/api/zones/:id`, deactivate via DELETE `/api/zones/:id`).
4. THE Admin panel SHALL display a Notification Statistics section showing notification counts grouped by type for the last 7 days, rendered as a Recharts BarChart.

---

### Requirement 11: Enhanced Existing Pages

**User Story:** As an Officer or Super_Admin, I want contextual "Notify Community" and "Resolve Alert" actions embedded in existing pages, so that I can take action without navigating away.

#### Acceptance Criteria

1. WHEN the authenticated user has `canNotify === true`, THE Overview page SHALL display a "Pending Community Notifications" panel showing up to 3 draft notifications with a "Review & Send" button on each.
2. WHEN the authenticated user has `canNotify === true`, THE Overview page SHALL show a "Notify Community" button next to each critical alert in the recent alerts feed.
3. WHEN the expanded alert detail is open and `canNotify === true`, THE Alerts page SHALL display a "Notify Community" button that opens the `NotificationDispatchModal` pre-filled with the alert context.
4. WHEN `canResolveAlerts === true`, THE Alerts page SHALL show the "Mark as Resolved" button; WHEN `canResolveAlerts === false`, THE Alerts page SHALL NOT show the resolve button.
5. WHEN any parameter on the Live Monitoring page is in warning or critical range and `canNotify === true`, THE Frontend SHALL display a dismissible notification banner with a "Notify Community" button.

---

### Requirement 12: Enhanced Devices Page

**User Story:** As a Technician or Super_Admin, I want device maintenance features integrated into the Devices page, so that I can log activities and toggle maintenance mode directly from the UI.

#### Acceptance Criteria

1. WHEN the authenticated user has role `technician` or `super_admin`, THE Devices page SHALL display a "Maintenance" button on each device row.
2. WHEN a device has `maintenanceMode === true`, THE Devices page SHALL display an orange "Maintenance" badge on that device's row.
3. WHEN "Maintenance" is clicked, THE Frontend SHALL open the `MaintenanceModal` for that device.
4. THE `MaintenanceModal` SHALL have two tabs: "Log Activity" and "History".
5. WHEN "Log Activity" is submitted, THE Frontend SHALL call POST `/api/devices/:id/maintenance` and confirm success.
6. THE "History" tab SHALL fetch and display GET `/api/devices/:id/maintenance` entries sorted by date descending.
7. WHEN the "Toggle Maintenance Mode" control is changed, THE Frontend SHALL call PATCH `/api/devices/:id/maintenance-mode`.
8. WHEN the authenticated user has role `viewer`, THE Devices page SHALL display a read-only table without action buttons.

---

### Requirement 13: Seed Script and Demo Data

**User Story:** As a developer, I want an expanded seed script, so that I can quickly provision a demo environment with all four roles and sample data for every feature.

#### Acceptance Criteria

1. THE seed script SHALL create exactly four demo users: `super_admin@isokosense.com` (role: super_admin, password: admin123), `officer@isokosense.com` (role: officer, password: officer123), `technician@isokosense.com` (role: technician, password: tech123), `viewer@isokosense.com` (role: viewer, password: viewer123).
2. THE seed script SHALL create three community zones: `ZONE-KACYIRU` (Kacyiru Sector, Gasabo), `ZONE-NYAMIRAMBO` (Nyamirambo Zone B, Nyarugenge), `ZONE-PIPELINE` (Pipeline Route 7, Kicukiro).
3. THE seed script SHALL create five sample notifications covering all four notification types across at least two zones, with a mix of `sent` and `draft` statuses.
4. THE seed script SHALL guarantee at least three Alerts with non-resolved status and a mix of `warning` and `critical` severity (in addition to any generated from random readings).
5. THE seed script SHALL create three `MaintenanceLog` entries linked to existing devices.
6. THE seed script SHALL clear all collections (User, Device, Reading, Alert, Zone, Notification, MaintenanceLog) before seeding.

---

### Requirement 14: README Documentation

**User Story:** As a new developer joining the project, I want a complete README at the project root, so that I can set up, run, and understand the system without needing to ask questions.

#### Acceptance Criteria

1. THE README SHALL include a project overview section describing the system's purpose and technology stack.
2. THE README SHALL include an ASCII/text architecture diagram showing the relationship between frontend, backend, MongoDB, IoT devices, and Socket.io.
3. THE README SHALL include prerequisites listing Node.js version, MongoDB, and any other requirements.
4. THE README SHALL include step-by-step setup instructions for both the backend (cd backend, npm install, configure .env, npm run dev) and frontend (cd frontend, npm install, configure .env, npm run dev).
5. THE README SHALL document all environment variables in `.env.example` files for both backend and frontend.
6. THE README SHALL list all API endpoints grouped by resource (auth, readings, alerts, devices, notifications, zones, users, dashboard) with method, path, auth requirement, and brief description.
7. THE README SHALL describe each role (super_admin, officer, technician, viewer) with demo credentials.
8. THE README SHALL include instructions for running the seed script (`npm run seed` from backend directory) and the simulator (`npm run simulate`).
