const Device = require('../models/Device');
const { getDeviceStatus } = require('../services/deviceStatusService');

function formatDevice(device) {
  const obj = device.toObject();
  return {
    ...obj,
    id: obj._id,
    status: getDeviceStatus(obj.lastPing),
  };
}

exports.getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find().sort({ name: 1 });
    res.json({ devices: devices.map(formatDevice) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerDevice = async (req, res) => {
  try {
    const { deviceId, locationId, name, type, location, description } = req.body;

    if (!deviceId || !locationId || !name || !type) {
      return res.status(400).json({
        message: 'deviceId, locationId, name, and type are required',
      });
    }

    if (!['IsokoUnit', 'IsokoChamber'].includes(type)) {
      return res.status(400).json({ message: 'type must be IsokoUnit or IsokoChamber' });
    }

    const existing = await Device.findOne({ deviceId });
    if (existing) {
      return res.status(409).json({ message: 'Device already registered' });
    }

    const device = await Device.create({
      deviceId,
      locationId,
      name,
      type,
      location,
      description,
      active: true,
    });

    res.status(201).json({ message: 'Device registered', device: formatDevice(device) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const device = await Device.findOne({ deviceId: req.params.id });
    if (!device) return res.status(404).json({ message: 'Device not found' });

    const { name, locationId, location, active, description, type } = req.body;
    if (name !== undefined) device.name = name;
    if (locationId !== undefined) device.locationId = locationId;
    if (location !== undefined) device.location = location;
    if (active !== undefined) device.active = active;
    if (description !== undefined) device.description = description;
    if (type !== undefined) device.type = type;

    await device.save();
    res.json({ message: 'Device updated', device: formatDevice(device) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDeviceStatus = async (req, res) => {
  try {
    const device = await Device.findOne({ deviceId: req.params.id });
    if (!device) return res.status(404).json({ message: 'Device not found' });

    res.json({
      deviceId: device.deviceId,
      status: getDeviceStatus(device.lastPing),
      lastPing: device.lastPing,
      active: device.active,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
