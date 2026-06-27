function validateReadingPayload(body) {
  const errors = [];
  const { deviceId, locationId, ph, turbidity, temperature, tds, timestamp } = body;

  if (!deviceId || typeof deviceId !== 'string') {
    errors.push('deviceId is required and must be a string');
  }
  if (!locationId || typeof locationId !== 'string') {
    errors.push('locationId is required and must be a string');
  }
  if (ph == null || typeof ph !== 'number' || Number.isNaN(ph)) {
    errors.push('ph is required and must be a number');
  }
  if (turbidity == null || typeof turbidity !== 'number' || Number.isNaN(turbidity)) {
    errors.push('turbidity is required and must be a number');
  }
  if (temperature == null || typeof temperature !== 'number' || Number.isNaN(temperature)) {
    errors.push('temperature is required and must be a number');
  }
  if (tds == null || typeof tds !== 'number' || Number.isNaN(tds)) {
    errors.push('tds is required and must be a number');
  }
  if (!timestamp || Number.isNaN(Date.parse(timestamp))) {
    errors.push('timestamp is required and must be a valid ISO string');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateReadingPayload };
