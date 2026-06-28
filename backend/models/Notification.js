const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    linkedAlertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alert' },
    linkedParameter: String,
    type: { type: String, default: 'CONTAMINATION_WARNING' },
    status: { type: String, default: 'sent' },
    zone: {
      zoneId: String,
      name: String
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
