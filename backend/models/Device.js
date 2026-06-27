const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, unique: true },
    locationId: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['IsokoUnit', 'IsokoChamber'],
      required: true,
    },
    location: {
      name: String,
      district: String,
      lat: Number,
      lng: Number,
    },
    active: { type: Boolean, default: true },
    lastPing: Date,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Device', deviceSchema);
