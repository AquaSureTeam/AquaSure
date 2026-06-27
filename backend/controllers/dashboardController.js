const Device = require('../models/Device');
const Reading = require('../models/Reading');
const Alert = require('../models/Alert');
const { getDeviceStatus } = require('../services/deviceStatusService');
const { getParameterStatus } = require('../services/contaminationEngine');

exports.getSummary = async (req, res) => {
  try {
    const devices = await Device.find({ active: true });
    const activeDevices = devices.filter((d) => getDeviceStatus(d.lastPing) === 'online');

    const latestReadingsAgg = await Reading.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: '$deviceId', reading: { $first: '$$ROOT' } } },
    ]);
    const latestReadings = latestReadingsAgg.map((r) => r.reading);

    const unresolvedAlerts = await Alert.find({ resolved: false });
    const alertCounts = {
      warning: unresolvedAlerts.filter((a) => a.severity === 'warning').length,
      critical: unresolvedAlerts.filter((a) => a.severity === 'critical').length,
      total: unresolvedAlerts.length,
    };

    let overallStatus = 'Safe';
    if (alertCounts.critical > 0) overallStatus = 'Critical';
    else if (alertCounts.warning > 0) overallStatus = 'Warning';

    const outOfRange = [];
    for (const reading of latestReadings) {
      for (const param of ['ph', 'turbidity', 'temperature', 'tds']) {
        const status = getParameterStatus(param, reading[param]);
        if (status !== 'safe') {
          outOfRange.push({
            deviceId: reading.deviceId,
            parameter: param,
            value: reading[param],
            severity: status,
          });
        }
      }
    }

    const parametersInRange = Math.max(0, latestReadings.length * 4 - outOfRange.length);
    const lastUpdate = latestReadings.reduce((latest, r) => {
      const t = new Date(r.timestamp);
      return !latest || t > latest ? t : latest;
    }, null);

    const monitoringPoints = devices.map((device) => {
      const latest = latestReadings.find((r) => r.deviceId === device.deviceId);
      return {
        deviceId: device.deviceId,
        name: device.name,
        type: device.type,
        location: device.location,
        status: getDeviceStatus(device.lastPing),
        waterStatus: latest?.overallStatus || 'Unknown',
        lastReading: latest || null,
      };
    });

    res.json({
      totalDevices: devices.length,
      activeDevices: activeDevices.length,
      latestReadings,
      alertCounts,
      overallStatus,
      outOfRange,
      parametersInRange,
      totalParameters: latestReadings.length * 4,
      lastUpdate,
      recentAlerts: unresolvedAlerts.slice(0, 5),
      monitoringPoints,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
