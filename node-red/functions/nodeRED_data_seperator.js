// Sıcaklık ve nem değerlerini ayır
if (msg.payload && msg.payload.sicaklik && msg.payload.nem) {
    // Sıcaklık mesajı
    var tempMsg = {
        topic: "sicaklik",
        payload: msg.payload.sicaklik
    };

    // Nem mesajı
    var humMsg = {
        topic: "nem",
        payload: msg.payload.nem
    };

    // Her iki mesajı da farklı çıkışlardan gönder
    return [tempMsg, humMsg];
}
return [null, null];