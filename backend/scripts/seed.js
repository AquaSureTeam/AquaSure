
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Device = require('../models/Device');
const Reading = require('../models/Reading');
const Alert = require('../models/Alert');
const { analyzeReading } = require('../services/contaminationEngine');

const DEVICES = [
  {
    deviceId: 'ISU-001',
    locationId: 'LOC-KIGALI-NORTH',
    name: 'Isoko Unit — Nyabugogo Reservoir',
    type: 'IsokoUnit',
    location: { name: 'Nyabugogo Reservoir', district: 'Kigali', lat: -1.9403, lng: 30.0588 },
    description: 'Surface water monitoring at Nyabugogo reservoir inlet',
  },
  {
    deviceId: 'ISU-002',
    locationId: 'LOC-KIGALI-SOUTH',
    name: 'Isoko Unit — Kicukiro Treatment Plant',
    type: 'IsokoUnit',
    location: { name: 'Kicukiro Treatment Plant', district: 'Kigali', lat: -1.9898, lng: 30.1129 },
    description: 'Surface water quality at treatment plant outlet',
  },
  {
    deviceId: 'ISC-001',
    locationId: 'LOC-PIPELINE-A',
    name: 'IsokoChamber — Pipeline Sector A',
    type: 'IsokoChamber',
    location: { name: 'Underground Pipeline A', district: 'Gasabo', lat: -1.9225, lng: 30.1048 },
    description: 'Underground pipeline chamber monitoring point',
  },
];

function randomInRange(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateReading(deviceId, locationId, timestamp, forceAnomaly = false) {
  let ph = randomInRange(6.8, 8.2);
  let turbidity = randomInRange(0.5, 3.5);
  let temperature = randomInRange(12, 23);
  let tds = randomInRange(150, 450);

  if (forceAnomaly) {
    const type = Math.floor(Math.random() * 4);
    if (type === 0) ph = randomInRange(5.2, 5.8);
    if (type === 1) turbidity = randomInRange(5, 12);
    if (type === 2) temperature = randomInRange(28, 38);
    if (type === 3) tds = randomInRange(600, 1200);
  }

  return { deviceId, locationId, ph, turbidity, temperature, tds, timestamp };
}

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/isokosense';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  await Promise.all([User.deleteMany({}), Device.deleteMany({}), Reading.deleteMany({}), Alert.deleteMany({})]);
  console.log('Cleared existing data');

  const hashedAdmin = await bcrypt.hash('admin123', 10);
  const hashedViewer = await bcrypt.hash('viewer123', 10);

  await User.create([
    {
      fullName: 'System Administrator',
      email: 'admin@isokosense.com',
      password: hashedAdmin,
      role: 'admin',
      organization: 'WASAC',
    },
    {
      fullName: 'Monitoring Viewer',
      email: 'viewer@isokosense.com',
      password: hashedViewer,
      role: 'viewer',
      organization: 'WASAC',
    },
  ]);
  console.log('Created demo users (admin@isokosense.com / admin123, viewer@isokosense.com / viewer123)');

  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const intervalMs = 30 * 60 * 1000;

  for (const deviceData of DEVICES) {
    const device = await Device.create({
      ...deviceData,
      active: true,
      lastPing: new Date(),
    });

    let readingCount = 0;
    for (let t = now - sevenDaysMs; t <= now; t += intervalMs) {
      const forceAnomaly = Math.random() < 0.04;
      const payload = generateReading(
        device.deviceId,
        device.locationId,
        new Date(t),
        forceAnomaly
      );
      const { overallStatus, alerts: alertChecks } = analyzeReading(payload);

      const reading = await Reading.create({
        ...payload,
        overallStatus,
      });
      readingCount++;

      for (const check of alertChecks) {
        await Alert.create({
          readingId: reading._id,
          deviceId: device.deviceId,
          locationId: device.locationId,
          locationName: device.location?.name,
          parameter: check.parameter,
          measuredValue: check.measuredValue,
          safeRange: check.safeRange,
          severity: check.severity,
          remediation: check.remediation,
          reading: {
            ph: payload.ph,
            turbidity: payload.turbidity,
            temperature: payload.temperature,
            tds: payload.tds,
            timestamp: payload.timestamp,
          },
          timestamp: payload.timestamp,
          resolved: Math.random() < 0.6,
          resolvedAt: Math.random() < 0.6 ? new Date(t + 3600000) : undefined,
        });
      }
    }

    device.lastPing = new Date();
    await device.save();
    console.log(`Seeded ${readingCount} readings for ${device.deviceId}`);
  }

  const alertCount = await Alert.countDocuments();
  const readingCount = await Reading.countDocuments();
  console.log(`\nSeed complete: ${DEVICES.length} devices, ${readingCount} readings, ${alertCount} alerts`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
