const OFFLINE_THRESHOLD_MS =
  (parseInt(process.env.OFFLINE_THRESHOLD_MINUTES, 10) || 5) * 60 * 1000;

function isDeviceOnline(lastPing) {
  if (!lastPing) return false;
  return Date.now() - new Date(lastPing).getTime() < OFFLINE_THRESHOLD_MS;
}

function getDeviceStatus(lastPing) {
  return isDeviceOnline(lastPing) ? 'online' : 'offline';
}

module.exports = { isDeviceOnline, getDeviceStatus, OFFLINE_THRESHOLD_MS };
