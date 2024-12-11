const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const port = 3000;

// WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    console.log('QR Code received, scan it with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Bot is ready!');
});

client.on('message', async (msg) => {
    console.log(`Message received: ${msg.body}`);
    if (msg.body.toLowerCase() === 'hello') {
        msg.reply('Hi! How can I assist you today?');
    }
});

client.initialize();

// Express API for bot health check
app.get('/', (req, res) => {
    res.send('WhatsApp Bot is running!');
});

app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
});
