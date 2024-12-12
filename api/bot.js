const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

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

module.exports = (req, res) => {
    if (req.url === '/favicon.ico') {
        res.status(204).end(); // No Content
        return;
    }

    res.status(200).send('WhatsApp Bot is running!');
};
