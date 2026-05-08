const Reading = require('../models/Reading');

function classify(reading) {
    const { ph, turbidity, tds } = reading;

    if (!ph || !turbidity || !tds) return "INVALID";
    if (ph < 6 || ph > 9) return "CRITICAL";
    if (turbidity > 10) return "CRITICAL";
    if (tds > 1000) return "WARNING";

    return "GOOD";
}

exports.addReading = async (req, res) => {
    try {
        const { device_id, timestamp, location, readings } = req.body;

        if (!device_id || !timestamp || !location || !readings) {
            return res.status(400).json({ message: "Missing data" });
        }

        const status = classify(readings);
        const newReading = new Reading({
            device_id,
            timestamp,
            location,
            ...readings,
            status,
        });

        if (status === "CRITICAL") {
            console.log("ALERT:Critical water condition detected");
        }
        res.status(201).json({
            message: "Reading saved successfully",
            data: newReading
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}