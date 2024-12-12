const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for serverless environments
        executablePath: puppeteer.executablePath(), // Use Puppeteer's bundled Chromium
    },
});

client.initialize();

module.exports = (req, res) => {
    res.status(200).send('WhatsApp Bot is running!');
};
