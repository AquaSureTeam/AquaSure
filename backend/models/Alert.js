const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    readingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reading', required: true },
    deviceId: { type: String, required: true, index: true },
    locationId: { type: String, required: true },
    locationName: String,
    parameter: {
      type: String,
      enum: ['ph', 'turbidity', 'temperature', 'tds'],
      required: true,
    },
    measuredValue: { type: Number, required: true },
    safeRange: { type: String, required: true },
    severity: {
      type: String,
      enum: ['warning', 'critical'],
      required: true,
    },
    remediation: { type: String, required: true },
    reading: {
      ph: Number,
      turbidity: Number,
      temperature: Number,
      tds: Number,
      timestamp: Date,
    },
    resolved: { type: Boolean, default: false },
    resolvedAt: Date,
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

alertSchema.index({ resolved: 1, severity: 1, timestamp: -1 });

module.exports = mongoose.model('Alert', alertSchema);
