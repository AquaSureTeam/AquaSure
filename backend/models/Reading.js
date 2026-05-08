const mongoose = require("mongoose");

const readingSchema = new mongoose.Schema({

    device_id: {
        type: String,
        required: true
    },

    device_type: {
        type: String,
        enum: ["IsokoUnit", "IsokoChamber"],
        default: "IsokoUnit"
    },

    location: {
        name: String,
        district: String,

        gps: {
            lat: Number,
            lng: Number
        }
    },

    timestamp: {
        type: Date,
        default: Date.now
    },

    readings: {
        ph: Number,
        turbidity: Number,
        tds: Number,
        temperature: Number
    },

    status: {
        water_quality: {
            type: String,
            enum: ["GOOD", "WARNING", "CRITICAL", "INVALID"],
            default: "GOOD"
        },

        severity: {
            type: String,
            enum: ["GREEN", "YELLOW", "RED"],
            default: "GREEN"
        },

        sensor_health: {
            type: String,
            enum: ["GOOD", "SUSPECT", "ERROR"],
            default: "GOOD"
        }
    },

    metadata: {
        sampling_mode: {
            type: String,
            enum: ["NORMAL", "WARNING", "CRITICAL"],
            default: "NORMAL"
        },

        battery_level: Number,

        signal_strength: String,

        firmware_version: String
    }

});

module.exports = mongoose.model("Reading", readingSchema);