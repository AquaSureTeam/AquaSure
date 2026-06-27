const THRESHOLDS = {
  ph: {
    safeMin: 6.5,
    safeMax: 8.5,
    warningLow: 6.0,
    warningHigh: 9.0,
    criticalLow: 5.0,
    criticalHigh: 10.0,
    safeRange: '6.5 – 8.5',
  },
  turbidity: {
    safeMax: 4,
    warningMax: 10,
    safeRange: '< 4 NTU',
  },
  temperature: {
    safeMin: 10,
    safeMax: 25,
    warningMax: 35,
    criticalLow: 5,
    safeRange: '10°C – 25°C',
  },
  tds: {
    safeMax: 500,
    warningMax: 1000,
    safeRange: '< 500 mg/L',
  },
};

const REMEDIATION = {
  ph_low_warning:
    'Monitor closely. Avoid direct consumption. Check for pipe corrosion or industrial runoff upstream.',
  ph_low_critical:
    'Do NOT use water for drinking or cooking. Shut off distribution immediately. Add pH correction (lime dosing). Notify water authority and test for heavy metal leaching.',
  ph_high_warning:
    'Limit consumption. Flush pipeline. Investigate source of alkalinity.',
  ph_high_critical:
    'Suspend distribution. Test for chemical contamination. Apply acid neutralization treatment. Report to health authorities.',
  turbidity_warning:
    'Boil water before use. Inspect filters and sedimentation tanks. Check for upstream disturbance.',
  turbidity_critical:
    'Immediately halt water supply. Deploy coagulation and flocculation treatment. Test for pathogen presence. Issue public health notice.',
  temperature_high_warning:
    'Monitor for bacterial growth risk. Increase flushing frequency. Inspect insulation around pipes.',
  temperature_high_critical:
    'Suspend distribution. High risk of Legionella and bacterial contamination. Disinfect pipeline with chlorination. Do not use until temperature normalizes.',
  temperature_low_critical:
    'Suspend distribution. Water temperature critically low — risk of pipe freezing and contamination. Inspect heating systems and insulate pipelines.',
  tds_warning:
    'Do not use for drinking. Check for mineral leaching or agricultural runoff. Run filtration check.',
  tds_critical:
    'Shut down supply immediately. Conduct full chemical analysis. Deploy reverse osmosis or ion exchange treatment. Notify health and environmental authorities.',
};

function getRemediation(parameter, severity, direction) {
  const key = `${parameter}_${direction || 'high'}_${severity}`;
  if (REMEDIATION[key]) return REMEDIATION[key];

  const fallbackKey = `${parameter}_${severity}`;
  return REMEDIATION[fallbackKey] || 'Contact water quality authority for assessment.';
}

function evaluatePh(value) {
  const t = THRESHOLDS.ph;
  if (value < t.criticalLow || value > t.criticalHigh) {
    return {
      parameter: 'ph',
      measuredValue: value,
      safeRange: t.safeRange,
      severity: 'critical',
      direction: value < t.criticalLow ? 'low' : 'high',
      remediation: getRemediation('ph', 'critical', value < t.criticalLow ? 'low' : 'high'),
    };
  }
  if (value < t.warningLow || value > t.warningHigh) {
    return {
      parameter: 'ph',
      measuredValue: value,
      safeRange: t.safeRange,
      severity: 'warning',
      direction: value < t.warningLow ? 'low' : 'high',
      remediation: getRemediation('ph', 'warning', value < t.warningLow ? 'low' : 'high'),
    };
  }
  if (value < t.safeMin || value > t.safeMax) {
    return {
      parameter: 'ph',
      measuredValue: value,
      safeRange: t.safeRange,
      severity: 'warning',
      direction: value < t.safeMin ? 'low' : 'high',
      remediation: getRemediation('ph', 'warning', value < t.safeMin ? 'low' : 'high'),
    };
  }
  return null;
}

function evaluateTurbidity(value) {
  const t = THRESHOLDS.turbidity;
  if (value > t.warningMax) {
    return {
      parameter: 'turbidity',
      measuredValue: value,
      safeRange: t.safeRange,
      severity: 'critical',
      direction: 'high',
      remediation: getRemediation('turbidity', 'critical'),
    };
  }
  if (value >= t.safeMax) {
    return {
      parameter: 'turbidity',
      measuredValue: value,
      safeRange: t.safeRange,
      severity: 'warning',
      direction: 'high',
      remediation: getRemediation('turbidity', 'warning'),
    };
  }
  return null;
}

function evaluateTemperature(value) {
  const t = THRESHOLDS.temperature;
  if (value > t.warningMax || value < t.criticalLow) {
    return {
      parameter: 'temperature',
      measuredValue: value,
      safeRange: t.safeRange,
      severity: 'critical',
      direction: value > t.warningMax ? 'high' : 'low',
      remediation:
        value > t.warningMax
          ? getRemediation('temperature', 'critical', 'high')
          : getRemediation('temperature', 'critical', 'low'),
    };
  }
  if (value > t.safeMax) {
    return {
      parameter: 'temperature',
      measuredValue: value,
      safeRange: t.safeRange,
      severity: 'warning',
      direction: 'high',
      remediation: getRemediation('temperature', 'warning', 'high'),
    };
  }
  if (value < t.safeMin) {
    return {
      parameter: 'temperature',
      measuredValue: value,
      safeRange: t.safeRange,
      severity: 'warning',
      direction: 'low',
      remediation: getRemediation('temperature', 'warning', 'high'),
    };
  }
  return null;
}

function evaluateTds(value) {
  const t = THRESHOLDS.tds;
  if (value > t.warningMax) {
    return {
      parameter: 'tds',
      measuredValue: value,
      safeRange: t.safeRange,
      severity: 'critical',
      direction: 'high',
      remediation: getRemediation('tds', 'critical'),
    };
  }
  if (value > t.safeMax) {
    return {
      parameter: 'tds',
      measuredValue: value,
      safeRange: t.safeRange,
      severity: 'warning',
      direction: 'high',
      remediation: getRemediation('tds', 'warning'),
    };
  }
  return null;
}

function getParameterStatus(parameter, value) {
  const evaluators = {
    ph: evaluatePh,
    turbidity: evaluateTurbidity,
    temperature: evaluateTemperature,
    tds: evaluateTds,
  };
  const result = evaluators[parameter]?.(value);
  if (!result) return 'safe';
  return result.severity;
}

function analyzeReading(reading) {
  const alerts = [];
  const outOfRange = [];

  const checks = [
    evaluatePh(reading.ph),
    evaluateTurbidity(reading.turbidity),
    evaluateTemperature(reading.temperature),
    evaluateTds(reading.tds),
  ];

  for (const check of checks) {
    if (check) {
      alerts.push(check);
      outOfRange.push({
        parameter: check.parameter,
        value: check.measuredValue,
        severity: check.severity,
        safeRange: check.safeRange,
      });
    }
  }

  let overallStatus = 'Safe';
  if (alerts.some((a) => a.severity === 'critical')) {
    overallStatus = 'Critical';
  } else if (alerts.length > 0) {
    overallStatus = 'Warning';
  }

  return { alerts, outOfRange, overallStatus };
}

module.exports = {
  THRESHOLDS,
  analyzeReading,
  getParameterStatus,
  evaluatePh,
  evaluateTurbidity,
  evaluateTemperature,
  evaluateTds,
};
