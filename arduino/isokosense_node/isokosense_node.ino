// IsokoSense Sensor Node — Arduino UNO (Serial) or ESP32 (Wi-Fi)
// For UNO: outputs JSON via Serial → Python bridge reads it → posts to API
// For ESP32: posts directly to API via Wi-Fi

// ─── PIN DEFINITIONS ───────────────────────────────────────────
#define PH_PIN        A0   // Potentiometer 1 simulating pH sensor
#define TDS_PIN       A1   // Potentiometer 2 simulating TDS sensor
#define TEMP_PIN      A2   // TMP36 temperature sensor
#define TURBIDITY_PIN A3   // Future: turbidity sensor (set to 0 for now)
#define RED_LED       8    // Red LED — unsafe water
#define GREEN_LED     9    // Green LED — safe water
#define BUZZER_PIN    10   // Buzzer — critical alert

// ─── DEVICE CONFIG ─────────────────────────────────────────────
const String DEVICE_ID   = "IU-001";        // Must match your DB device
const String LOCATION_ID = "loc-kacyiru-01";
const int    SEND_INTERVAL = 15000;         // Send every 15 seconds

unsigned long lastSendTime = 0;

void setup() {
  Serial.begin(9600);
  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  // Startup signal
  digitalWrite(GREEN_LED, HIGH);
  delay(1000);
  digitalWrite(GREEN_LED, LOW);

  Serial.println("IsokoSense Node Starting...");
}

void loop() {
  unsigned long now = millis();

  if (now - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = now;

    // ─── READ SENSORS ─────────────────────────────────────────
    float ph          = readPH();
    float tds         = readTDS();
    float temperature = readTemperature();
    float turbidity   = readTurbidity();

    // ─── LOCAL STATUS CHECK ───────────────────────────────────
    bool isSafe = checkSafety(ph, tds, temperature, turbidity);
    updateLocalIndicators(isSafe);

    // ─── BUILD JSON PAYLOAD ───────────────────────────────────
    // This JSON is what gets sent to POST /api/readings
    String payload = buildPayload(ph, tds, temperature, turbidity);

    // Print to Serial — Python bridge will read this and POST to API
    Serial.println("PAYLOAD:" + payload);
  }
}

// ─── SENSOR READING FUNCTIONS ──────────────────────────────────

float readPH() {
  int raw = analogRead(PH_PIN);          // 0–1023
  // Map potentiometer range to pH 0–14
  // In real system: calibrate with pH 4.0 and pH 7.0 buffer solutions
  float voltage = raw * (5.0 / 1023.0);
  float ph = 3.5 * voltage;              // Approximate: adjust per sensor
  return constrain(ph, 0.0, 14.0);
}

float readTDS() {
  int raw = analogRead(TDS_PIN);         // 0–1023
  // Map to TDS 0–2000 mg/L
  // Real sensor: use temperature-compensated formula
  float voltage = raw * (5.0 / 1023.0);
  float tds = (voltage / 5.0) * 2000.0;
  return tds;
}

float readTemperature() {
  int raw = analogRead(TEMP_PIN);
  // TMP36 formula: voltage = raw * 5.0/1024, temp = (voltage-0.5)*100
  float voltage = raw * (5.0 / 1024.0);
  float tempC = (voltage - 0.5) * 100.0;
  return tempC;
}

float readTurbidity() {
  // No turbidity sensor in simulation yet — return a safe default
  // When you add the sensor: int raw = analogRead(TURBIDITY_PIN);
  // Real sensor outputs HIGHER voltage for CLEANER water (inverse)
  return 1.5;  // Safe placeholder (< 4 NTU = safe)
}

// ─── SAFETY CHECK (mirrors ContaminationEngine thresholds) ─────

bool checkSafety(float ph, float tds, float temp, float turb) {
  if (ph < 6.5 || ph > 8.5)   return false;
  if (tds > 500)               return false;
  if (temp < 10 || temp > 25)  return false;
  if (turb > 4)                return false;
  return true;
}

// ─── LOCAL INDICATORS ──────────────────────────────────────────

void updateLocalIndicators(bool isSafe) {
  if (isSafe) {
    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(RED_LED, LOW);
    noTone(BUZZER_PIN);
  } else {
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(RED_LED, HIGH);
    // Buzzer beeps for critical local alert
    tone(BUZZER_PIN, 1000, 500);
  }
}

// ─── JSON PAYLOAD BUILDER ──────────────────────────────────────

String buildPayload(float ph, float tds, float temp, float turb) {
  String json = "{";
  json += "\"deviceId\":\"" + DEVICE_ID + "\",";
  json += "\"locationId\":\"" + LOCATION_ID + "\",";
  json += "\"ph\":"          + String(ph, 2) + ",";
  json += "\"turbidity\":"   + String(turb, 2) + ",";
  json += "\"temperature\":" + String(temp, 2) + ",";
  json += "\"tds\":"         + String(tds, 2) + ",";
  json += "\"timestamp\":\"" + getTimestamp() + "\"";
  json += "}";
  return json;
}

String getTimestamp() {
  // UNO has no real clock — Python bridge will replace this
  // ESP32 version uses NTP for real timestamps
  return "AUTO";
}