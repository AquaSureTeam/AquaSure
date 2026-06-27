const Alert = require('../models/Alert');

exports.getAllAlerts = async (req, res) => {
  try {
    const { severity, resolved, startDate, endDate } = req.query;
    const filter = {};

    if (severity) filter.severity = severity;
    if (resolved !== undefined) filter.resolved = resolved === 'true';
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const alerts = await Alert.find(filter).sort({
      resolved: 1,
      severity: -1,
      timestamp: -1,
    });

    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id).populate('readingId');
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json({ alert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resolveAlert = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can resolve alerts' });
    }

    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    if (alert.resolved) {
      return res.status(400).json({ message: 'Alert is already resolved' });
    }

    alert.resolved = true;
    alert.resolvedAt = new Date();
    alert.resolvedBy = req.user.id;
    await alert.save();

    if (req.app.get('io')) {
      req.app.get('io').emit('alert:resolved', alert);
    }

    res.json({ message: 'Alert resolved', alert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
