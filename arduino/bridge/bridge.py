# bridge.py — reads Arduino Serial and posts to IsokoSense API
# Run: pip install pyserial requests
# Then: python bridge.py

import serial
import requests
import json
import time
from datetime import datetime, timezone

# ─── CONFIG ────────────────────────────────────────────────────
SERIAL_PORT  = "COM3"          # Windows: COM3, COM4 etc.
                               # Mac/Linux: /dev/ttyUSB0 or /dev/ttyACM0
BAUD_RATE    = 9600
API_URL      = "http://localhost:5000/api/readings"   # Your backend URL
                               # Change to your deployed URL when live

def main():
    print(f"Connecting to Arduino on {SERIAL_PORT}...")

    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=2)
        print("Connected. Listening for sensor data...")
    except Exception as e:
        print(f"Could not connect to serial port: {e}")
        print("Check that Arduino is plugged in and port is correct.")
        return

    while True:
        try:
            line = ser.readline().decode("utf-8").strip()

            if not line:
                continue

            print(f"Arduino → {line}")

            # Only process lines that carry sensor payload
            if line.startswith("PAYLOAD:"):
                raw_json = line[len("PAYLOAD:"):]

                try:
                    data = json.loads(raw_json)
                except json.JSONDecodeError:
                    print("Bad JSON received, skipping.")
                    continue

                # Add real timestamp (Arduino UNO has no clock)
                data["timestamp"] = datetime.now(timezone.utc).isoformat()

                # POST to IsokoSense API
                try:
                    response = requests.post(
                        API_URL,
                        json=data,
                        headers={"Content-Type": "application/json"},
                        timeout=10
                    )

                    if response.status_code == 200:
                        result = response.json()
                        print(f"✅ Data sent. Status: {result.get('status')}")

                        # Print any triggered alerts
                        alerts = result.get("alerts", [])
                        if alerts:
                            print(f"⚠️  {len(alerts)} alert(s) triggered:")
                            for alert in alerts:
                                print(f"   [{alert['severity'].upper()}] "
                                      f"{alert['parameter']} = {alert['value']}")
                                print(f"   → {alert['remediation'][:80]}...")
                    else:
                        print(f"❌ API error {response.status_code}: "
                              f"{response.text[:100]}")

                except requests.exceptions.ConnectionError:
                    print("❌ Cannot reach API. Is your backend running?")
                except requests.exceptions.Timeout:
                    print("❌ API request timed out.")

        except KeyboardInterrupt:
            print("\nStopped by user.")
            ser.close()
            break
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(1)

if __name__ == "__main__":
    main()