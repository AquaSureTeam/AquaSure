
require('dotenv').config();

const API_URL = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;

const DEVICES = [
  { deviceId: 'ISU-001', locationId: 'LOC-KIGALI-NORTH' },
  { deviceId: 'ISU-002', locationId: 'LOC-KIGALI-SOUTH' },
  { deviceId: 'ISC-001', locationId: 'LOC-PIPELINE-A' },
];

function randomInRange(min, max, decimals = 2) {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
}

function generateNormalReading(device) {
  return {
    deviceId: device.deviceId,
    locationId: device.locationId,
    ph: randomInRange(6.8, 8.2),
    turbidity: randomInRange(0.5, 3.5),
    temperature: randomInRange(12, 23),
    tds: randomInRange(150, 450),
    timestamp: new Date().toISOString(),
  };
}

function generateAnomalyReading(device) {
  const anomalyType = Math.floor(Math.random() * 4);
  const base = generateNormalReading(device);

  switch (anomalyType) {
    case 0:
      base.ph = randomInRange(4.5, 5.5);
      break;
    case 1:
      base.turbidity = randomInRange(12, 25);
      break;
    case 2:
      base.temperature = randomInRange(36, 42);
      break;
    case 3:
      base.tds = randomInRange(1100, 1800);
      break;
    default:
      break;
  }

  return base;
}

async function sendReading(reading) {
  try {
    const response = await fetch(`${API_URL}/api/readings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reading),
    });

    const data = await response.json();
    const alertCount = data.alerts?.length || 0;
    const status = data.overallStatus || 'Unknown';

    console.log(
      `[${new Date().toISOString()}] ${reading.deviceId} | pH:${reading.ph} Turb:${reading.turbidity} Temp:${reading.temperature}°C TDS:${reading.tds} | Status: ${status}${alertCount ? ` | ${alertCount} alert(s)` : ''}`
    );
  } catch (error) {
    console.error(`Failed to send reading for ${reading.deviceId}:`, error.message);
  }
}

async function tick() {
  for (const device of DEVICES) {
    const injectAnomaly = Math.random() < 0.12;
    const reading = injectAnomaly ? generateAnomalyReading(device) : generateNormalReading(device);
    await sendReading(reading);
  }
}

console.log(`IsokoSense Simulator started — posting to ${API_URL}/api/readings every 15s`);
console.log('Devices:', DEVICES.map((d) => d.deviceId).join(', '));

tick();
setInterval(tick, 15000);
