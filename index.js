global.qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
global.express = require("express");
global.app = express();
global.tokens = ["key1","key2","key3"] // tokenler

global.client = new Client({
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Whatsapp Aktif!");
});


client.initialize();

app.get("/api", async (req, res) => {
  let {
    number,
    code,
    token,
  } = req.query;

  if (!number || !code || !token) return res.json({ status: false, message: "Parametreler eksik! (number, code, token)", code: code, number: number, author: "github.com/fastuptime" });
  if (!tokens.includes(token)) return res.json({ status: false, message: "Token hatalı!", code: code, number: number, author: "github.com/fastuptime" });
  if(number.length != 12 && isNaN(number)) return res.json({ status: false, message: "Numara hatalı! (12 haneli olmalı, 90xxxxxxxxxx)", code: code, number: number, author: "github.com/fastuptime" });
  if(code.length != 6) return res.json({ status: false, message: "Kod hatalı! (6 haneli olmalı)", code: code, number: number, author: "github.com/fastuptime" });

  try {
    await client.sendMessage(`${number}@c.us`, code);
    res.json({ status: true, message: "İşlem başarılı!", code: code, number: number, author: "github.com/fastuptime" });
  } catch (e) {
    res.json({ status: false, message: "Mesaj gönderilemedi!", code: code, number: number, author: "github.com/fastuptime", error: e });
  }
});

app.use((req, res) => {
  res.json({ status: false, message: "/api adresine istek atınız!", params: "number, code, token", author: "github.com/fastuptime" });
});

app.listen(80, () => {
  console.log("Sistem Aktif! (80)\ngithub.com/fastuptime\nWhatsapp Aktif olmadan önce /api adresine istek atmayınız!");
});
