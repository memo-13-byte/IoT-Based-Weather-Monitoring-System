// Sıcaklık eşiği
const TEMPERATURE_THRESHOLD = 20.0;

// Son bildirim zamanı
if (!context.global.lastNotificationTime) {
    context.global.lastNotificationTime = 0;
}

// Gelen verileri kontrol et
if (msg.payload && msg.payload.sicaklik) {
    const temp = msg.payload.sicaklik;
    const humidity = msg.payload.nem || "N/A";

    // Günlüğe kaydet
    node.status({ fill: "green", shape: "dot", text: `Sıcaklık: ${temp}°C, Nem: ${humidity}%` });

    // Eşik aşıldıysa ve son bildirimden beri en az 5 dakika geçtiyse
    const now = new Date().getTime();
    const fiveMinutes = 5 * 60 * 1000;

    if (temp > TEMPERATURE_THRESHOLD && (now - context.global.lastNotificationTime > fiveMinutes)) {
        // Zaman bilgisini ekle
        const timestamp = new Date().toLocaleString('tr-TR');

        // E-posta içeriği
        const emailMsg = {
            topic: "ESP32 Sıcaklık Uyarısı",
            payload: `ESP32 sensöründen sıcaklık uyarısı!\n\nZaman: ${timestamp}\nSıcaklık: ${temp}°C\nNem: ${humidity}%\n\nBu e-posta, Raspberry Pi üzerindeki Node-RED tarafından otomatik olarak gönderilmiştir.`,
            to: "canmehmetoguz@gmail.com"
        };

        // Telegram mesajı
        const telegramMsg = {
            payload: {
                chatId: "1904540703", // Buraya Telegram ID'nizi yazın
                type: "message",
                content: `🔔 *Sıcaklık Uyarısı*\n\n🌡️ *Sıcaklık:* ${temp}°C\n💧 *Nem:* ${humidity}%\n⏱️ *Zaman:* ${timestamp}\n\n⚠️ Sıcaklık eşik değerini (${TEMPERATURE_THRESHOLD}°C) aştı!`,
                options: {
                    parse_mode: "Markdown"
                }
            }
        };

        // Son bildirim zamanını güncelle
        context.global.lastNotificationTime = now;

        // E-posta ve Telegram mesajlarını gönder
        return [emailMsg, telegramMsg];
    }
}

// Eşik aşılmadıysa hiçbir şey gönderme
return [null, null];