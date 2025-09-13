#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include "esp_wpa2.h"  // WPA2-Enterprise desteği için gerekli

#define DHTPIN 4          // GPIO4 → DHT22 data pin
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// 📡 eduroam WiFi (WPA2-Enterprise)
const char* ssid = "eduroam";
const char* identity = "mehmet_kocadere@hacettepe.edu.tr";
const char* username = "mehmet_kocadere@hacettepe.edu.tr";
const char* password = "Joker1280";

// 🔗 MQTT ayarları (Raspberry Pi IP’si)
const char* mqtt_server = "10.225.249.174";
const int mqtt_port = 1883;
const char* mqtt_topic = "sensor/dht22";

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  WiFi.disconnect(true);  // Eski ağları temizle
  WiFi.mode(WIFI_STA);    // İstasyon modu (client)
  
  // WPA2 Enterprise ayarları
  esp_wifi_sta_wpa2_ent_set_identity((uint8_t *)identity, strlen(identity));
  esp_wifi_sta_wpa2_ent_set_username((uint8_t *)username, strlen(username));
  esp_wifi_sta_wpa2_ent_set_password((uint8_t *)password, strlen(password));
  esp_wifi_sta_wpa2_ent_enable();

  WiFi.begin(ssid);
  Serial.print("📡 WiFi ağına bağlanılıyor: ");
  Serial.println(ssid);

  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 30) {
    delay(500);
    Serial.print(".");
    retry++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ Bağlantı başarılı!");
    Serial.print("🌐 IP adresi: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ Bağlantı başarısız!");
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("🔁 MQTT sunucusuna bağlanılıyor...");
    if (client.connect("ESP32Client")) {
      Serial.println("✅ MQTT bağlantısı tamam!");
    } else {
      Serial.print("Hata kodu: ");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (!isnan(temperature) && !isnan(humidity)) {
    String payload = "{\"sicaklik\": " + String(temperature, 1) + ", \"nem\": " + String(humidity, 1) + "}";
    client.publish(mqtt_topic, payload.c_str());
    Serial.println("📤 Gönderildi: " + payload);
  } else {
    Serial.println("⚠️ DHT22 okuma hatası!");
  }

  delay(5000);
}
