// Import the necessary libraries
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express')
const app = express()
const port = process.env.PORT || 4001;

// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth(), // Uses a local folder for authentication persistence
});

// Generate and display the QR code in the terminal
client.on('qr', (qr) => {
    console.log('Scan this QR code with your WhatsApp app:');
    qrcode.generate(qr, { small: true });
});

// Listen for authentication success
client.on('ready', () => {
    console.log('WhatsApp Web client is ready!');
});

// Listen for incoming messages
client.on('message', (message) => {
    console.log(`Received message: ${message.body}`);

    // Example: Reply to a specific message
    if (message.body.toLowerCase() === 'hello') {
        message.reply('Hi there! How can I help you?');
    }
});

// Log errors
client.on('error', (error) => {
    console.error('An error occurred:', error);
});

// Start the client
client.initialize();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })