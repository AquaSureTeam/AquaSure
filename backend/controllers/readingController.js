const Reading = require('../models/Reading');
const Alert = require('../models/Alert');
const Device = require('../models/Device');
const { validateReadingPayload } = require('../services/validationService');
const { analyzeReading } = require('../services/contaminationEngine');

function emitEvent(req, event, data) {
  if (req.app.get('io')) {
    req.app.get('io').emit(event, data);
  }
}

exports.ingestReading = async (req, res) => {
  try {
    const { valid, errors } = validateReadingPayload(req.body);
    if (!valid) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const { deviceId, locationId, ph, turbidity, temperature, tds, timestamp } = req.body;
    const { alerts: alertChecks, overallStatus } = analyzeReading({
      ph,
      turbidity,
      temperature,
      tds,
    });

    const reading = await Reading.create({
      deviceId,
      locationId,
      ph,
      turbidity,
      temperature,
      tds,
      timestamp: new Date(timestamp),
      overallStatus,
    });

    const device = await Device.findOne({ deviceId });
    const locationName = device?.location?.name || locationId;

    if (device) {
      device.lastPing = new Date(timestamp);
      await device.save();
    }

    const createdAlerts = [];
    for (const check of alertChecks) {
      const alert = await Alert.create({
        readingId: reading._id,
        deviceId,
        locationId,
        locationName,
        parameter: check.parameter,
        measuredValue: check.measuredValue,
        safeRange: check.safeRange,
        severity: check.severity,
        remediation: check.remediation,
        reading: { ph, turbidity, temperature, tds, timestamp: new Date(timestamp) },
        timestamp: new Date(timestamp),
      });
      createdAlerts.push(alert);
    }

    const response = {
      status: 'ok',
      overallStatus,
      reading,
      alerts: createdAlerts,
    };

    emitEvent(req, 'reading:new', response);
    if (createdAlerts.length > 0) {
      emitEvent(req, 'alert:new', createdAlerts);
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllReadings = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);
    const skip = (page - 1) * limit;

    const [readings, total] = await Promise.all([
      Reading.find().sort({ timestamp: -1 }).skip(skip).limit(limit),
      Reading.countDocuments(),
    ]);

    res.json({
      readings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLatestReadings = async (req, res) => {
  try {
    const latest = await Reading.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$deviceId',
          reading: { $first: '$$ROOT' },
        },
      },
    ]);

    res.json({
      readings: latest.map((item) => item.reading),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDeviceReadings = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);
    const skip = (page - 1) * limit;

    const filter = { deviceId };
    const [readings, total] = await Promise.all([
      Reading.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit),
      Reading.countDocuments(filter),
    ]);

    res.json({
      readings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDeviceHistory = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { startDate, endDate } = req.query;

    const filter = { deviceId };
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const readings = await Reading.find(filter).sort({ timestamp: 1 }).limit(2000);

    res.json({ deviceId, readings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
