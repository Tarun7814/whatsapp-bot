const { Client } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: '/tmp/.wwebjs_auth' // Use a temporary directory
    }),
});

client.on('qr', (qr) => {
    console.log('QR Code received, scan it with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Bot is ready!');
});

client.initialize();

module.exports = (req, res) => {
    res.status(200).send('WhatsApp Bot is running!');
};
