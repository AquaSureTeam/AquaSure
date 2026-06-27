# Implementation Plan: IsokoSense Complete Feature Implementation

## Overview

Implementation is sequenced backend-first (models → middleware → controllers → routes → server.js wiring), then frontend (types → AuthContext → API client → components → pages). Each phase builds on the previous so there is no orphaned code. All code follows existing project conventions: CommonJS `require` in backend, TypeScript + React hooks in frontend, Tailwind utility classes for styling.

---

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1", "2", "3"] },
    { "wave": 2, "tasks": ["4", "5", "6", "7"] },
    { "wave": 3, "tasks": ["8", "9", "10"] },
    { "wave": 4, "tasks": ["11", "12", "13"] },
    { "wave": 5, "tasks": ["14", "15", "16", "17"] },
    { "wave": 6, "tasks": ["18", "19", "20", "24"] },
    { "wave": 7, "tasks": ["21", "22", "23", "25", "26", "27", "28"] },
    { "wave": 8, "tasks": ["29", "30"] },
    { "wave": 9, "tasks": ["31"] }
  ]
}
```

All backend tasks (waves 1–4) must complete before frontend tasks (wave 5+) begin. Within each wave, tasks are independent and can be executed in parallel.

---

## Tasks

- [ ] 1. Backend — Update User Model and Role Middleware

  - Edit `backend/models/User.js`:
    - Change `role` enum from `['admin','viewer']` to `['super_admin','officer','technician','viewer']`
    - Add `isActive: { type: Boolean, default: true }`
    - Add `lastLogin: { type: Date }`
    - Add `assignedLocations: [{ type: String }]`
    - Update `toSafeObject()` to include `isActive`, `lastLogin`, `assignedLocations`
  - Edit `backend/middleware/roleMiddleware.js`:
    - Change signature from `module.exports = (roles) =>` to `module.exports = (...roles) =>`
    - Fix typo: `"Acess denied"` → `"Access denied"`
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Backend — Update Auth Controller

  - Edit `backend/controllers/authController.js`:
    - `register`: Add bootstrap check (`User.countDocuments() === 0` → allow unauthenticated, force role to `super_admin`). Accept roles `['super_admin','officer','technician','viewer']`.
    - `login`: Check `user.isActive !== false` before issuing token; return 403 `{ message: 'Account deactivated' }` if false. Set `user.lastLogin = new Date()` and `await user.save()`.
    - `login`: Return expanded user object (new `toSafeObject` includes `isActive`, `lastLogin`, `assignedLocations`).
  - Edit `backend/routes/authRoutes.js`:
    - Add `authMiddleware` + `requireRole('super_admin')` to POST `/register` route, BUT only after the bootstrap check is in the controller (controller must handle unauthenticated bootstrap before middleware blocks it).
    - Alternative implementation: use a custom middleware that skips auth if user count is 0, otherwise enforces super_admin.
  - _Requirements: 1.5, 1.6, 4.5, 4.6_

  - [ ]* 2.1 Write property test — deactivated user cannot login
    - **Property 4: User deactivation blocks login**
    - Generate a user, set `isActive: false`, attempt login with correct password, assert HTTP 403.
    - **Validates: Requirements 1.5**

- [ ] 3. Backend — New Models: Zone, Notification, MaintenanceLog

  - Create `backend/models/Zone.js` with schema: `zoneId` (String, required, unique), `name` (String, required), `district` (String, required), `description` (String), `active` (Boolean, default true), `createdAt` (Date, default Date.now). Add indexes on `zoneId` (unique) and `active`.
  - Create `backend/models/Notification.js` with schema: `sentBy` (sub-doc: `userId` ObjectId ref User, `name` String, `role` String), `zone` (sub-doc: `zoneId` String, `name` String), `type` (enum: CONTAMINATION_WARNING, DO_NOT_USE, SERVICE_DISRUPTION, WATER_NOW_SAFE, required), `message` (String, required), `linkedAlertId` (ObjectId ref Alert, optional), `linkedParameter` (String), `timestamp` (Date, default Date.now, index), `status` (enum: sent|draft, default draft), `expiresAt` (Date), `extendedBy` (ObjectId ref User). Add indexes: `{ status:1, timestamp:-1 }`, `{ 'zone.zoneId':1, status:1 }`.
  - Create `backend/models/MaintenanceLog.js` with schema: `deviceId` (String, required, index), `loggedBy` (sub-doc: `userId` ObjectId ref User, `name` String, `role` String), `activity` (String, required), `notes` (String), `date` (Date, default Date.now, index), `maintenanceMode` (Boolean, default false). Add compound index `{ deviceId:1, date:-1 }`.
  - Edit `backend/models/Device.js`: add `maintenanceMode: { type: Boolean, default: false }`.
  - _Requirements: 2.1, 2.2, 3.1, 3.2_

- [ ] 4. Backend — Notification Controller and Routes

  - Create `backend/controllers/notificationController.js`:
    - `createNotification`: populate `sentBy` from `req.user`; populate `zone.name` by looking up the Zone by `zoneId`; set `expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000)`; save; if `status === 'sent'` emit `notification:new`; return 201 with created doc.
    - `getAllNotifications`: accept query params `page`, `limit`, `status`, `zoneId`, `includeExpired` (default false); when `includeExpired=false` add filter `expiresAt: { $gt: new Date() }`; return paginated results.
    - `getZoneNotifications`: public, no auth; filter `{ 'zone.zoneId': req.params.zoneId, status: 'sent', expiresAt: { $gt: new Date() } }`; return array.
    - `getNotificationById`: find by `_id`, return 404 if not found.
    - `extendNotification`: add 72h to `expiresAt`; set `extendedBy = req.user.id`; save; return updated doc.
    - `deleteNotification`: `findByIdAndDelete`; return 200 `{ message: 'Notification deleted' }`.
  - Create `backend/routes/notificationRoutes.js`:
    - `POST /` → authMiddleware, requireRole('super_admin','officer'), createNotification
    - `GET /` → authMiddleware, getAllNotifications
    - `GET /zone/:zoneId` → getZoneNotifications (no auth middleware)
    - `GET /:id` → authMiddleware, getNotificationById
    - `PATCH /:id/extend` → authMiddleware, requireRole('super_admin'), extendNotification
    - `DELETE /:id` → authMiddleware, requireRole('super_admin'), deleteNotification
    - Note: place `GET /zone/:zoneId` BEFORE `GET /:id` to avoid route conflict.
  - _Requirements: 2.3, 2.4, 2.5, 2.7, 2.8_

  - [ ]* 4.1 Write property test — notification expiresAt is always timestamp + 72h
    - **Property 2: Notification expiry is always 72 hours from creation**
    - Create notifications with varying timestamps, verify `expiresAt - timestamp === 72 * 3600 * 1000` (±1000ms).
    - **Validates: Requirements 2.3**

  - [ ]* 4.2 Write property test — public zone feed excludes expired and draft
    - **Property 6: Notification public feed excludes expired and draft entries**
    - Seed mix of sent/draft, expired/active notifications; call GET /api/notifications/zone/:zoneId; assert all results are sent + non-expired.
    - **Validates: Requirements 2.4**


- [ ] 5. Backend — Zone Controller and Routes

  - Create `backend/controllers/zoneController.js`:
    - `getAllZones`: return all zones where `active: true`.
    - `createZone`: validate required fields (`zoneId`, `name`, `district`); check for existing `zoneId`; create and return 201.
    - `updateZone`: find by `_id`, update allowed fields (`name`, `district`, `description`, `active`), return updated.
    - `deactivateZone`: set `active: false`, return updated.
  - Create `backend/routes/zoneRoutes.js`:
    - `GET /` → authMiddleware, getAllZones
    - `POST /` → authMiddleware, requireRole('super_admin'), createZone
    - `PATCH /:id` → authMiddleware, requireRole('super_admin'), updateZone
    - `DELETE /:id` → authMiddleware, requireRole('super_admin'), deactivateZone
  - _Requirements: 2.9_

- [ ] 6. Backend — Maintenance Controller and Device Route Updates

  - Create `backend/controllers/maintenanceController.js`:
    - `logMaintenance`: validate `activity` is present; create `MaintenanceLog` with `loggedBy` from `req.user`; return 201 with created log.
    - `getMaintenanceHistory`: find all logs for `deviceId`, sort `{ date: -1 }`, return `{ logs }`.
    - `toggleMaintenanceMode`: find Device by `deviceId`; update `maintenanceMode`; save; emit `device:maintenanceMode` via `req.app.get('io')`; return updated device.
  - Edit `backend/routes/deviceRoutes.js`:
    - Add `POST /:id/maintenance` → authMiddleware, requireRole('super_admin','technician'), logMaintenance
    - Add `GET /:id/maintenance` → authMiddleware, requireRole('super_admin','officer','technician'), getMaintenanceHistory
    - Add `PATCH /:id/maintenance-mode` → authMiddleware, requireRole('super_admin','technician'), toggleMaintenanceMode
    - Update existing `POST /` → add requireRole('super_admin','technician')
    - Update existing `PATCH /:id` → add requireRole('super_admin','technician')
  - _Requirements: 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 6.1 Write property test — maintenance log loggedBy matches authenticated user
    - **Property — loggedBy invariant**
    - For any authenticated user creating a maintenance log, `log.loggedBy.userId` and `log.loggedBy.name` must match the JWT-derived user.
    - **Validates: Requirements 3.3**

- [ ] 7. Backend — User Management Controller and Routes

  - Create `backend/controllers/userController.js`:
    - `getAllUsers`: paginate via `page`/`limit` query params; return `{ users: users.map(u => u.toSafeObject()), pagination }`.
    - `updateUser`: check `req.params.id !== req.user.id` (return 400 if same); update only allowed fields (`role`, `isActive`, `organization`, `assignedLocations`); return updated safe object.
    - `deactivateUser`: check not self; set `isActive: false`; save; return `{ message: 'User deactivated' }`.
  - Create `backend/routes/userRoutes.js`:
    - `GET /` → authMiddleware, requireRole('super_admin'), getAllUsers
    - `PATCH /:id` → authMiddleware, requireRole('super_admin'), updateUser
    - `DELETE /:id` → authMiddleware, requireRole('super_admin'), deactivateUser
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 7.1 Write property test — cannot modify own account
    - **Property 7: Role update does not allow self-modification**
    - For any super_admin user, PATCH /api/users/:ownId should always return 400.
    - **Validates: Requirements 4.3**

- [ ] 8. Backend — Update Reading Controller (Critical Alert → Draft Notification)

  - Edit `backend/controllers/readingController.js`:
    - Import `Notification` and `Zone` models.
    - After the `for (const check of alertChecks)` loop, add logic: for each created alert where `check.severity === 'critical'`, attempt to find an active Zone where `zone.zoneId` matches `locationId` (or the first active zone if no match); if found, create a draft Notification.
    - Set `sentBy: { userId: null, name: 'System', role: 'system' }`, `zone: { zoneId, name }`, `type: 'CONTAMINATION_WARNING'`, `message: check.remediation`, `linkedAlertId: alert._id`, `linkedParameter: check.parameter`, `status: 'draft'`, `expiresAt: new Date(Date.now() + 72*60*60*1000)`.
    - Emit `notification:draft` Socket.io event.
  - _Requirements: 2.6_

  - [ ]* 8.1 Write property test — critical alert auto-creates draft notification
    - **Property 3: Draft auto-creation on critical alerts**
    - For any critical reading with a matching zone, a draft notification must exist after ingest. Seed zones before test, send various critical readings, verify draft count increases.
    - **Validates: Requirements 2.6**

- [ ] 9. Backend — Update Alert Controller (Role Fix)

  - Edit `backend/controllers/alertController.js`:
    - In `resolveAlert`, replace `req.user.role !== 'admin'` with `!['super_admin','officer'].includes(req.user.role)` (return 403).
  - Edit `backend/routes/alertRoutes.js`:
    - Import `requireRole` from `../middleware/roleMiddleware`.
    - Add `requireRole('super_admin','officer')` to `PATCH /:id/resolve`.
  - _Requirements: 1.7_

- [ ] 10. Backend — Update Dashboard Controller

  - Edit `backend/controllers/dashboardController.js`:
    - Import `Notification` and `Device` (already imported).
    - Add `notificationsSent24h`: `await Notification.countDocuments({ status: 'sent', timestamp: { $gte: new Date(Date.now() - 24*60*60*1000) } })`.
    - Add `pendingDraftNotifications`: `await Notification.find({ status: 'draft' }).sort({ timestamp: -1 }).limit(10)`.
    - Add `maintenanceDevices`: `const mDevices = await Device.find({ maintenanceMode: true })`; return `{ count: mDevices.length, devices: mDevices.map(d => ({ deviceId: d.deviceId, name: d.name })) }`.
    - Append all three to the `res.json(...)` response object.
  - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 10.1 Write property test — maintenanceDevices count matches toggled devices
    - **Property 5: Maintenance mode reflects in device status**
    - Toggle maintenance mode on N devices; call GET /api/dashboard/summary; assert `maintenanceDevices.count === N`.
    - **Validates: Requirements 3.3, 5.3**

- [ ] 11. Backend — Wire New Routes in server.js

  - Edit `backend/server.js`:
    - Add `require` for `notificationRoutes`, `zoneRoutes`, `userRoutes`.
    - Mount: `app.use('/api/notifications', notificationRoutes)`, `app.use('/api/zones', zoneRoutes)`, `app.use('/api/users', userRoutes)`.
  - _Requirements: 2.5, 2.9, 4.1_

- [ ] 12. Backend — Checkpoint: Verify All Routes and Role Guards

  - Ensure all tests pass, ask the user if questions arise.
  - Verify with manual curl / REST client or test script that:
    - POST /api/auth/login with inactive user returns 403.
    - POST /api/notifications with viewer token returns 403.
    - GET /api/notifications/zone/:zoneId returns 200 without any auth token.
    - POST /api/devices/:id/maintenance with viewer token returns 403.
    - POST /api/auth/register with non-super_admin token returns 403.
    - Dashboard summary includes `notificationsSent24h`, `pendingDraftNotifications`, `maintenanceDevices`.

- [ ] 13. Backend — Update Seed Script

  - Edit `backend/scripts/seed.js`:
    - Add `Zone`, `Notification`, `MaintenanceLog` to the `deleteMany` cleanup block.
    - Create 4 demo users with bcrypt-hashed passwords:
      - `super_admin@isokosense.com` / `admin123`, role: `super_admin`
      - `officer@isokosense.com` / `officer123`, role: `officer`
      - `technician@isokosense.com` / `tech123`, role: `technician`
      - `viewer@isokosense.com` / `viewer123`, role: `viewer`
    - Create 3 zones: `{ zoneId:'ZONE-KACYIRU', name:'Kacyiru Sector', district:'Gasabo' }`, `{ zoneId:'ZONE-NYAMIRAMBO', name:'Nyamirambo Zone B', district:'Nyarugenge' }`, `{ zoneId:'ZONE-PIPELINE', name:'Pipeline Route 7', district:'Kicukiro' }`.
    - After generating historical readings, force-create 3 guaranteed unresolved alerts (1 critical, 2 warning) by calling `analyzeReading` with out-of-range values directly.
    - Create 5 sample notifications spanning all 4 types across 2 zones with mix of `sent`/`draft` statuses. Set realistic timestamps and `expiresAt`.
    - Create 3 `MaintenanceLog` entries for existing devices. Look up the officer and technician users by email and use their `_id` for `loggedBy.userId`.
    - Log a summary of all created data.
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_


---

## Frontend Tasks

- [ ] 14. Frontend — Create Types File

  - Create `frontend/src/types/index.ts` with TypeScript interfaces:
    - `User` (id, fullName, email, role union type, organization, isActive, lastLogin, assignedLocations)
    - `Alert` (all alert fields including reading sub-object)
    - `Notification` (all notification fields including sentBy and zone sub-objects)
    - `Zone` (zoneId, name, district, description, active)
    - `MaintenanceLog` (all fields including loggedBy sub-object)
    - `Device` (all existing fields plus maintenanceMode)
    - `DashboardSummary` (full shape including new fields)
  - _Requirements: 6.1_

- [ ] 15. Frontend — Update AuthContext

  - Edit `frontend/src/context/AuthContext.tsx`:
    - Update `User` type import from `../types/index`.
    - Replace `isAdmin: user?.role === 'admin'` with the 6 new helpers:
      - `isSuperAdmin: user?.role === 'super_admin'`
      - `isOfficer: user?.role === 'officer'`
      - `isTechnician: user?.role === 'technician'`
      - `isViewer: user?.role === 'viewer'`
      - `canNotify: ['super_admin','officer'].includes(user?.role)`
      - `canResolveAlerts: ['super_admin','officer'].includes(user?.role)`
      - `canManageDevices: ['super_admin','technician'].includes(user?.role)`
    - Add all new helpers to the context value object.
    - Keep `isAdmin` temporarily as an alias (`isAdmin: isSuperAdmin`) to prevent breaking during migration, then remove after all pages are updated.
  - _Requirements: 6.2_

- [ ] 16. Frontend — Update API Client

  - Edit `frontend/src/api/client.js`:
    - Add all new API methods as documented in the design: `getNotifications`, `getZoneNotifications`, `getNotification`, `sendNotification`, `extendNotification`, `deleteNotification`, `getZones`, `createZone`, `updateZone`, `getUsers`, `updateUser`, `deactivateUser`, `logMaintenance`, `getMaintenanceLogs`, `toggleMaintenanceMode`.
    - Add `createUser` as an alias for `register` (or expose `register` with token auth).
  - _Requirements: 6.2_

- [ ] 17. Frontend — Create RoleGuard Component

  - Create `frontend/src/components/RoleGuard.tsx`:
    - Accept `roles: string[]` and `children: React.ReactNode` props.
    - Use `useAuth()` to get `user`.
    - If `user?.role` is in `roles`, render children; otherwise `<Navigate to="/" replace />`.
  - _Requirements: 6.3_

- [ ] 18. Frontend — Update Sidebar for 4-Role Navigation

  - Edit `frontend/src/components/Sidebar.tsx`:
    - Remove `adminLinks` and `viewerLinks` arrays.
    - Import icons for new pages: `Bell` (notifications), `Users` (users), `Settings` (admin).
    - Define role-specific link arrays based on the RBAC matrix from the design.
    - Use `isSuperAdmin`, `isOfficer`, `isTechnician`, `isViewer` from `useAuth()` to select the correct link set.
    - Replace `isAdmin` usage with `isSuperAdmin`.
    - Show role badge in the user footer section with appropriate colors.
  - _Requirements: 6.1_

- [ ] 19. Frontend — Update App.tsx with New Routes

  - Edit `frontend/src/App.tsx`:
    - Import `NotificationsPage`, `UsersPage`, `AdminPanel`, `RoleGuard`.
    - Add routes:
      - `<Route path="/notifications" element={<NotificationsPage />} />`
      - `<Route path="/users" element={<RoleGuard roles={['super_admin']}><UsersPage /></RoleGuard>} />`
      - `<Route path="/admin" element={<RoleGuard roles={['super_admin']}><AdminPanel /></RoleGuard>} />`
  - _Requirements: 6.1, 6.3_

- [ ] 20. Frontend — Create NotificationDispatchModal

  - Create `frontend/src/components/NotificationDispatchModal.tsx`:
    - Props: `onClose: () => void`, `linkedAlert?: Alert`, `defaultZoneId?: string`.
    - Fetch zones from `api.getZones()` on mount for the zone selector dropdown.
    - Zone selector, type selector with 4 color-coded type badges:
      - `CONTAMINATION_WARNING` → red badge
      - `DO_NOT_USE` → gray-900 badge
      - `SERVICE_DISRUPTION` → orange badge
      - `WATER_NOW_SAFE` → green badge
    - Message textarea, auto-populated from `linkedAlert?.remediation` if prop provided.
    - Affected parameter display if `linkedAlert` provided.
    - Preview card showing the notification as it will appear to the public.
    - "Send Now" button → calls `api.sendNotification({ zoneId, type, message, linkedAlertId: linkedAlert?._id, linkedParameter: linkedAlert?.parameter, status: 'sent' })`.
    - On success: call `onClose()` and show a brief success state.
    - Only super_admin sees "Save Draft" option.
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 21. Frontend — Create NotificationsPage

  - Create `frontend/src/pages/NotificationsPage.tsx`:
    - Fetch `api.getNotifications({ status: 'sent', includeExpired: 'false' })` on mount.
    - Group notifications by `zone.name` using `Array.reduce`.
    - For each notification, render a card with:
      - Color-coded type badge (use a `NOTIFICATION_BADGE_COLORS` map).
      - Message text.
      - Relative time: `Math.floor((Date.now() - new Date(n.timestamp).getTime()) / 3600000)` hours ago.
      - Sender attribution: `n.sentBy.name`.
    - Client-side expiry filter: filter out where `new Date(n.expiresAt) < new Date()`.
    - For `canNotify` users: "Send Notification" button in the page header → opens `NotificationDispatchModal`.
    - For `canNotify` users: "Drafts" tab/section fetching `api.getNotifications({ status: 'draft' })`.
    - For drafts: "Review & Send" button opens modal pre-filled with draft data.
    - For `isSuperAdmin`: "Delete" button on sent notification cards.
    - Empty state: "No active notifications for this zone."
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ] 22. Frontend — Create UsersPage

  - Create `frontend/src/pages/UsersPage.tsx`:
    - Fetch `api.getUsers()` on mount. Show pagination if `pagination.pages > 1`.
    - Table columns: full name, email, role badge, status badge, last login (formatted), organization.
    - Role badge colors: super_admin=purple, officer=blue, technician=amber, viewer=gray.
    - Status badge: Active=green, Inactive=red.
    - "Add User" button → `CreateUserModal` (inline in file or separate component).
    - `CreateUserModal`: fields fullName, email, password, role select, organization; calls `api.register(payload)` (which requires super_admin token automatically via client headers); on success refreshes list.
    - Inline role edit: `<select>` dropdown for role, calls `api.updateUser(id, { role })` on change.
    - "Deactivate" button: calls `api.deactivateUser(id)`, updates row to inactive.
    - "Reactivate" button for inactive users: calls `api.updateUser(id, { isActive: true })`.
    - Show logged-in user's own row with "(You)" label, disable Deactivate for own row.
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 23. Frontend — Create AdminPanel

  - Create `frontend/src/pages/AdminPanel.tsx`:
    - Three sections laid out with tabs or clearly separated cards: System Health, Community Zones, Notification Statistics.
    - **System Health**: fetch `api.getDashboardSummary()` for device stats and `fetch('/api/health')` for API status. Show: total devices, active devices, maintenance devices count, API status badge.
    - **Community Zones**: fetch `api.getZones()`. CRUD table: zone name, district, active badge. "Add Zone" button opens inline form (zoneId, name, district, description). "Edit" pencil icon → inline editing. "Deactivate" button.
    - **Notification Statistics**: fetch `api.getNotifications({ includeExpired: 'true', limit: '100' })`. Count by type. Render a Recharts `BarChart` with 4 bars (one per type) using the type's badge color.
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 24. Frontend — Create MaintenanceModal

  - Create `frontend/src/components/MaintenanceModal.tsx`:
    - Props: `device: Device`, `onClose: () => void`.
    - Two tabs: "Log Activity" and "History".
    - **Log Activity tab**: `activity` text input (required), `notes` textarea, `maintenanceMode` toggle switch showing current state from `device.maintenanceMode`. "Submit" button:
      - Calls `api.logMaintenance(device.deviceId, { activity, notes, maintenanceMode })`.
      - If `maintenanceMode` toggle changed, also calls `api.toggleMaintenanceMode(device.deviceId, newMode)`.
      - Show success message on completion.
    - **History tab**: on tab activation, fetch `api.getMaintenanceLogs(device.deviceId)`. Render list of entries: date, activity, notes, who logged it, maintenanceMode indicator.
  - _Requirements: 12.3, 12.4, 12.5, 12.6, 12.7_

- [ ] 25. Frontend — Update DevicesPage

  - Edit `frontend/src/pages/DevicesPage.tsx`:
    - Import `useAuth`, `MaintenanceModal`, `canManageDevices`.
    - Replace `if (!isAdmin)` guard with role-based rendering: viewers see a read-only table, technicians see table with maintenance actions but no add/deactivate, super_admins see full access.
    - Add `maintenanceMode` column or row indicator: show orange "Maintenance" pill badge when `device.maintenanceMode === true`.
    - Add "Maintenance" button (wrench icon) to each row, visible to super_admin and technician. Clicking opens `MaintenanceModal` for that device.
    - For super_admin: keep existing "Add Device" button and active/inactive toggle.
    - State: `const [maintenanceDevice, setMaintenanceDevice] = useState(null)` — opens modal when set.
    - Render `{maintenanceDevice && <MaintenanceModal device={maintenanceDevice} onClose={() => { setMaintenanceDevice(null); fetchDevices(); }} />}`.
  - _Requirements: 12.1, 12.2, 12.3, 12.7, 12.8_

- [ ] 26. Frontend — Update AlertsPage

  - Edit `frontend/src/pages/AlertsPage.tsx`:
    - Replace `const { isAdmin } = useAuth()` with `const { canNotify, canResolveAlerts } = useAuth()`.
    - Change resolve button visibility: `canResolveAlerts && !alert.resolved` (was `isAdmin`).
    - Add "Notify Community" button in the expanded alert detail panel, visible when `canNotify`:
      - Import and use `NotificationDispatchModal`.
      - State: `const [notifyAlert, setNotifyAlert] = useState(null)`.
      - Button: `<button onClick={() => setNotifyAlert(alert)}>Notify Community</button>` with a bell icon.
    - Render modal: `{notifyAlert && <NotificationDispatchModal linkedAlert={notifyAlert} onClose={() => setNotifyAlert(null)} />}`.
  - _Requirements: 11.3, 11.4_

- [ ] 27. Frontend — Update OverviewPage

  - Edit `frontend/src/pages/OverviewPage.tsx`:
    - Destructure `canNotify` from `useAuth()`.
    - Import `NotificationDispatchModal`.
    - After the stat cards grid, conditionally render the "Pending Community Notifications" panel for `canNotify` users:
      - Read `summary.pendingDraftNotifications` (up to 3 items).
      - Each draft card shows: zone name, type badge, truncated message, "Review & Send" button.
      - "Review & Send" opens `NotificationDispatchModal` with pre-populated fields from the draft.
    - In the recent alerts feed, for critical alerts and `canNotify`, add a small "Notify" button with a bell icon that opens `NotificationDispatchModal` pre-populated with the alert.
    - State: `const [notifyAlert, setNotifyAlert] = useState(null)` and `const [notifyDraft, setNotifyDraft] = useState(null)`.
  - _Requirements: 11.1, 11.2_

- [ ] 28. Frontend — Update LiveMonitoringPage

  - Edit `frontend/src/pages/LiveMonitoringPage.tsx`:
    - Destructure `canNotify` from `useAuth()`.
    - After the parameter cards grid, compute `const anyWarning = PARAMETERS.some(p => getParameterStatus(reading?.[p.key], p.key) !== 'safe')`.
    - Render a dismissible banner when `anyWarning && canNotify`:
      - State: `const [bannerDismissed, setBannerDismissed] = useState(false)`. Reset on new reading.
      - Banner shows: warning/critical icon + parameter name + status.
      - "Notify Community" button → opens `NotificationDispatchModal` with type pre-set: critical → 'DO_NOT_USE', warning → 'CONTAMINATION_WARNING'.
      - "×" button sets `bannerDismissed(true)`.
    - Import and use `NotificationDispatchModal`.
  - _Requirements: 11.5_

- [ ] 29. Frontend — Checkpoint: Verify All Role Behaviors

  - Ensure all tests pass, ask the user if questions arise.
  - Manual verification checklist:
    - Login as each of the 4 roles; confirm sidebar shows correct links.
    - As viewer: confirm no action buttons visible in Alerts, Devices pages.
    - As technician: confirm Maintenance button visible in Devices, no Notify in Alerts.
    - As officer: confirm Notify buttons visible, Resolve button visible, Devices page is read-only.
    - As super_admin: confirm full access across all pages.
    - Navigate to `/users` as officer; confirm redirect to `/`.
    - Navigate to `/admin` as technician; confirm redirect to `/`.

- [ ] 30. Create README.md

  - Create `README.md` at the project root `d:\Project setup\Progress\IsokoSense\README.md`:
    - **Project Overview**: 1-2 paragraph description of IsokoSense, its purpose (water quality monitoring for Rwandan water authorities), and technology stack.
    - **ASCII Architecture Diagram**: text-art diagram showing: IoT Devices → Backend API → MongoDB; Frontend → Backend API; Frontend ↔ Socket.io.
    - **Prerequisites**: Node.js 18+, MongoDB (local or Atlas), npm.
    - **Backend Setup**: `cd backend`, `npm install`, copy `.env.example` to `.env` and fill in `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`. `npm run dev`.
    - **Frontend Setup**: `cd frontend`, `npm install`, copy `.env.example` to `.env` and set `VITE_API_URL`. `npm run dev`.
    - **Environment Variables**: document all backend vars (`MONGODB_URI`, `PORT`, `JWT_SECRET`, `CORS_ORIGIN`, `OFFLINE_THRESHOLD_MINUTES`, `API_URL`) and frontend var (`VITE_API_URL`).
    - **API Endpoints**: table per resource group (auth, readings, alerts, devices, notifications, zones, users, dashboard) with Method, Path, Auth, Role, Description.
    - **Role Descriptions and Demo Credentials**: table with role, email, password, description for each of the 4 demo users seeded by `scripts/seed.js`.
    - **Running the Simulator**: `cd backend && npm run simulate` — description of what it does (sends randomized readings every 15s, 12% anomaly rate).
    - **Running the Seed Script**: `cd backend && npm run seed` — warns this clears all data and repopulates with demo data.
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8_

- [ ] 31. Final Checkpoint — Full System Verification

  - Ensure all tests pass, ask the user if questions arise.
  - Run seed script: `cd backend && npm run seed` — verify output shows 4 users, 3 zones, 5 notifications, 3 maintenance logs.
  - Start backend: `cd backend && npm run dev` — verify no startup errors.
  - Start frontend: `cd frontend && npm run dev` — verify no TypeScript errors.
  - Run simulator for 30 seconds: verify new readings appear in Live Monitoring page.
  - Verify Socket.io: critical reading → check draft notification appears in Notifications/Drafts tab.
  - Verify end-to-end: officer login → send notification → public zone feed shows notification → 72h expiry set correctly.

---

## Notes

- Tasks marked with `*` are optional property/integration tests — skip for faster MVP delivery.
- All backend tasks (1–13) must be complete before starting frontend tasks (14–30) to avoid API shape mismatches.
- The existing `admin` and `viewer` roles in production data will need to be migrated manually or via a migration script — the seed script clears all users, so this only matters for production databases with real users.
- The `isAdmin` helper in `AuthContext` should be kept as a temporary alias until all references across existing pages are updated in Tasks 26–28.
- Socket.io client integration is noted but not explicitly tasked — the existing frontend pages already handle `socket.io-client` patterns where applicable. Add socket listeners for `notification:new` and `notification:draft` in `NotificationsPage` and `OverviewPage` respectively as part of those page implementations.
