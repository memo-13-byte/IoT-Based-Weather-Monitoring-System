// Telegram komutlarını işle
var command = msg.payload.content;
var chatId = msg.payload.chatId;

if (command === "/status" || command === "/durum") {
    // Global context'ten son sensör değerlerini al
    var temp = global.get("lastTemp") || "Bilinmiyor";
    var hum = global.get("lastHum") || "Bilinmiyor";
    var lastUpdate = global.get("lastUpdate") || "Bilinmiyor";

    var response = "📊 *Güncel Sensör Durumu*\n" +
        "🌡️ Sıcaklık: " + temp + "°C\n" +
        "💧 Nem: " + hum + "%\n" +
        "⏱️ Son güncelleme: " + lastUpdate;

    return {
        payload: {
            chatId: chatId,
            type: "message",
            content: response,
            options: {
                parse_mode: "Markdown"
            }
        }
    };
}
else if (command === "/help" || command === "/yardim") {
    var helpText = "📱 *ESP32 Sensör Bot Komutları*\n\n" +
        "/status veya /durum - Güncel sensör değerlerini göster\n" +
        "/help veya /yardim - Bu yardım mesajını göster";

    return {
        payload: {
            chatId: chatId,
            type: "message",
            content: helpText,
            options: {
                parse_mode: "Markdown"
            }
        }
    };
}

return null;