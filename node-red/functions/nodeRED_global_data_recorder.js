// Sensör verilerini global değişkenlere kaydet
if (msg.payload && msg.payload.sicaklik && msg.payload.nem) {
    // Global değişkenlere kaydet
    global.set("lastTemp", msg.payload.sicaklik);
    global.set("lastHum", msg.payload.nem);
    global.set("lastUpdate", new Date().toLocaleString('tr-TR'));
}

// Mesajı değiştirmeden geçir
return msg;