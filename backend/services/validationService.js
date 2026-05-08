function validateReadings(readings) {
    const errors = [];
    if (readings.ph == null || isNaN(readings.ph)) errors.push("Invalid ph sensor");
    if (readings.turbidity == null || isNaN(readings.turbidity)) errors.push("Invalid turbidity sensor");
    if (readings.tds == null || isNaN(readings.tds)) errors.push("Invalid tds sensor")
    if (readings.temperature == null || isNaN(readings.temperature)) errors.push("Invalid temperature sensor");

    return {
        valid: error.length === 0,
        errors
    };
}

module.exports = validateReadings;