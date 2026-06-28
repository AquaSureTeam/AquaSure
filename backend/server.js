const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const readingRoutes = require('./routes/readingRoutes');
const alertRoutes = require('./routes/alertRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const server = http.createServer(app);

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

// When tinkercad-bridge.html is opened from the filesystem the browser
// sends origin: null — we must allow that too (only in development).
const allowedOrigins = [corsOrigin, 'null', null];

const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST', 'PATCH'] },
});

app.set('io', io);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (null / file://) and listed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'IsokoSense API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`IsokoSense API running on port ${PORT}`);
  });
});

module.exports = { app, server, io };
