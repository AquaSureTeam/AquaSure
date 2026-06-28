const Notification = require('../models/Notification');

exports.createNotification = async (req, res) => {
  try {
    const { message, linkedAlertId, linkedParameter, type, status, zone } = req.body;

    const newNotification = new Notification({
      message,
      linkedAlertId,
      linkedParameter,
      type,
      status,
      zone,
      sender: req.user ? req.user.id : null,
    });

    await newNotification.save();

    // Emit via socket.io if we want real-time updates for clients
    const io = req.app.get('io');
    if (io) {
      io.emit('notification', newNotification);
    }

    res.status(201).json({ success: true, notification: newNotification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Failed to create notification', error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 }).limit(50);
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};
