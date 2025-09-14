# IoT-Based Weather Monitoring System

Real-time IoT weather monitoring system using ESP32, DHT22 sensor, MQTT protocol, and Raspberry Pi with Node-RED dashboard and multi-channel notifications.

## Features

- Real-time temperature and humidity monitoring
- MQTT wireless communication protocol
- Email and Telegram notifications
- Web-based dashboard with Node-RED
- Automated threshold alerts

## Technologies Used

- ESP32 microcontroller
- DHT22 temperature/humidity sensor
- MQTT protocol
- Raspberry Pi 4
- Node-RED
- JavaScript

## System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   ESP32 + DHT22 │────│  MQTT Protocol   │────│  Raspberry Pi 4 │
│   (Publisher)   │    │  (Wireless)      │    │  (MQTT Broker)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         │
                                               ┌─────────────────┐
                                               │    Node-RED     │
                                               │ (Data Processing│
                                               │ & Automation)   │
                                               └─────────────────┘
                                                         │
                                        ┌────────────────┼────────────────┐
                                        │                │                │
                                ┌────────────────┐   ┌──────────────┐ ┌────────────────┐
                                │  Web Dashboard │   │ Email Alerts │ │ Telegram Bot   │
                                │   (Real-time)  │   │ (Gmail SMTP) │ │ (Notifications)│
                                └────────────────┘   └──────────────┘ └────────────────┘
```

### Component Details

**Hardware Layer:**
- **ESP32 Microcontroller**: Handles sensor data collection and wireless communication
- **DHT22 Sensor**: Measures temperature and humidity with high accuracy
- **Power Supply**: 5V USB or battery powered for portable operation

**Communication Layer:**
- **MQTT Protocol**: Lightweight messaging protocol for IoT communication
- **Wi-Fi Connection**: Supports both standard networks and WPA2-Enterprise (eduroam)
- **Topic Structure**: `sensor/dht22` for centralized data transmission

**Processing Layer:**
- **Raspberry Pi 4**: Central hub running Mosquitto MQTT broker
- **Node-RED**: Visual programming tool for data flow and automation
- **Real-time Processing**: 5-second data sampling with threshold monitoring

**Application Layer:**
- **Web Dashboard**: Real-time visualization with gauges and charts
- **Email Notifications**: Automated alerts via Gmail SMTP
- **Telegram Integration**: Bot commands and instant notifications

## Installation

### Prerequisites

- Raspberry Pi 4 with Raspbian OS
- ESP32 development board
- DHT22 temperature/humidity sensor
- Jumper wires and breadboard
- Wi-Fi network access

### Hardware Setup

1. **ESP32 and DHT22 Connection:**
   ```
   DHT22 VCC  → ESP32 3.3V
   DHT22 GND  → ESP32 GND
   DHT22 DATA → ESP32 GPIO4
   ```

2. **Power the ESP32 via USB or external power supply**

### Software Installation

#### 1. Raspberry Pi Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Mosquitto MQTT Broker
sudo apt install mosquitto mosquitto-clients -y
sudo systemctl enable mosquitto
sudo systemctl start mosquitto

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs -y

# Install Node-RED
sudo npm install -g --unsafe-perm node-red
sudo systemctl enable nodered
sudo systemctl start nodered

# Install Node-RED dependencies
cd ~/.node-red
npm install node-red-contrib-telegrambot
npm install node-red-node-email
npm install node-red-dashboard
```

#### 2. ESP32 Setup

```bash
# Install Arduino IDE or PlatformIO
# Add ESP32 board support in Arduino IDE:
# File → Preferences → Additional Board Manager URLs:
# https://dl.espressif.com/dl/package_esp32_index.json

# Install required libraries:
# - WiFi (built-in)
# - PubSubClient
# - DHT sensor library
```

#### 3. Configuration

**MQTT Broker Configuration:**
```bash
# Edit Mosquitto config
sudo nano /etc/mosquitto/mosquitto.conf

# Add these lines:
listener 1883
allow_anonymous true
persistence true
persistence_location /var/lib/mosquitto/
```

**ESP32 Configuration:**
- Update Wi-Fi credentials in `hardware/esp32_dht22_mqtt.ino`
- Set MQTT broker IP address (Raspberry Pi IP)
- Configure sensor pin assignments

**Node-RED Setup:**
1. Access Node-RED at `http://raspberry-pi-ip:1880`
2. Import the flow from `node-red/flows.json`
3. Configure email credentials in email nodes
4. Set up Telegram bot token in Telegram nodes
5. Deploy the flow

### Usage

1. **Power on the system:**
   - Start Raspberry Pi and ensure MQTT broker is running
   - Power ESP32 - it will automatically connect and start transmitting

2. **Access Dashboard:**
   - Open browser and go to `http://raspberry-pi-ip:1880/ui`
   - View real-time temperature and humidity data

3. **Configure Alerts:**
   - Modify temperature threshold in Node-RED function
   - Update email recipients and Telegram chat IDs
   - Customize notification intervals

4. **Telegram Commands:**
   - `/status` or `/durum` - Get current sensor readings
   - `/help` or `/yardim` - Show available commands

## Project Structure

```
IoT-Based-Weather-Monitoring-System/
├── README.md
├── hardware/
│   └── esp32_dht22_mqtt.ino
├── node-red/
│   ├── flows.json
│   └── functions/
│       ├── nodeRED_data_seperator.js
│       ├── nodeRED_global_data_recorder.js
│       ├── nodeRED_telegram_command_processor.js
│       └── nodeRED_temperature_controller.js
├── documentation/
│   └── Final_Report.pdf
└── screenshots/
    ├── IoT-Based Weather Monitoring System Temperature and Humidity Dashboard Screenshot.jpeg
    ├── IoT-Based Weather Monitoring System Temperature and Humidity Email Notification Screenshot.jpeg
    └── IoT-Based Weather Monitoring System Temperature and Humidity Telegram Notification Screenshot.jpeg
```

## Troubleshooting

### Common Issues

**ESP32 won't connect to Wi-Fi:**
- Check credentials and network compatibility
- Ensure WPA2-Enterprise configuration is correct for eduroam

**No data in dashboard:**
- Verify MQTT broker is running: `sudo systemctl status mosquitto`
- Check ESP32 serial monitor for connection status
- Confirm Node-RED flow is deployed

**Email notifications not working:**
- Enable 2-factor authentication and app passwords in Gmail
- Check SMTP settings in Node-RED email node

**Telegram bot not responding:**
- Verify bot token is correct
- Ensure chat ID matches your Telegram account

## Performance Optimization

- **Power Management**: Configure ESP32 deep sleep for battery operation
- **Data Retention**: Set up InfluxDB for historical data storage
- **Scalability**: Add multiple sensor nodes using unique MQTT topics
- **Security**: Implement MQTT authentication and SSL/TLS encryption

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- **Author**: Mehmet Oğuz Kocadere
- **Email**: canmehmetoguz@gmail.com
- **GitHub**: [memo-13-byte](https://github.com/memo-13-byte)
- **LinkedIn**: [mehmet-oğuz-kocadere](https://www.linkedin.com/in/mehmet-o%C4%9Fuz-kocadere/)

## Acknowledgments

- Hacettepe University Computer Engineering Department
- BBM460 Wireless and Mobile Networks Laboratory Course
- Node-RED Community for excellent documentation
- ESP32 and Arduino communities for hardware support
