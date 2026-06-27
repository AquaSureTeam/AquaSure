const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, index: true },
    locationId: { type: String, required: true, index: true },
    ph: { type: Number, required: true },
    turbidity: { type: Number, required: true },
    temperature: { type: Number, required: true },
    tds: { type: Number, required: true },
    timestamp: { type: Date, required: true, index: true },
    overallStatus: {
      type: String,
      enum: ['Safe', 'Warning', 'Critical'],
      default: 'Safe',
    },
  },
  { timestamps: true }
);

readingSchema.index({ deviceId: 1, timestamp: -1 });

module.exports = mongoose.model('Reading', readingSchema);
