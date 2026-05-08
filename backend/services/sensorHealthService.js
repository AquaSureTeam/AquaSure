function sensorHealth(validationResult) {
    if (!validationResult.valid) {
        return "ERROR"
    }
    return "GOOD";
}
module.exports = sensorHealth;