function classifyWater(readings) {
    let water_quality = "GOOD"
    let severity = "GREEN"

    if (
        readings.ph < 6 ||
        readings.ph > 9 ||
        readings.turbidity > 10 ||
        readings.tds > 1000
    ) {
        water_quality = "CRITICAL"
        severity = "RED"
    }
    else if (
        readings.ph < 6.5 ||
        readings.ph > 8.5 ||
        readings.turbidity > 5 ||
        readings.tds > 500
    ) {
        water_quality = "WARNING"
        severity = "YELLOW"
    }

    return { water_quality, severity };
}
module.exports = classifyWater;

