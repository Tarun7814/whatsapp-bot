// Import the necessary libraries
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const port = process.env.PORT || 4002;
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const { IgApiClient } = require('instagram-private-api');
const usernames = 'tarun78145t';
const password = '7814556230tT@';

// Import Firebase modules for Firestore
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

// Import Firebase configuration
const firebaseConfig = require("./firebaseConfig");

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);

// Create a new WhatsApp client instance
const client = new Client({
    authStrategy: new LocalAuth(), // Uses a local folder for authentication persistence
});

async function getInstagramProfilePicture(username) {
    const ig = new IgApiClient();
    
    try {
        // Login to Instagram
        await ig.state.generateDevice(usernames);
        await ig.account.login(usernames, password);
        
        // Get the user by username
        const user = await ig.user.searchExact(username);
        console.error(user.profile_pic_url);
        const profilePicUrl = user.profile_pic_url;

        if (profilePicUrl) {
            return profilePicUrl;
        } else {
            console.error('Profile picture not found.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching Instagram profile picture:', error);
        return null;
    }
}



// Generate and display the QR code in the terminal
client.on('qr', (qr) => {
    console.log('Scan this QR code with your WhatsApp app:');
    qrcode.generate(qr, { small: true });
});

// Listen for authentication success
client.on('ready', () => {
    console.log('WhatsApp Web client is ready!');
    getInstagramProfilePicture("its__tarun____")
});

// Listen for incoming messages
client.on('message', async (message) => {
    console.log(`Received message: ${message.body}`);

    // Example: Save message to Firestore
    try {
        const docRef = await addDoc(collection(db, "messages"), {
            from: message.from,
            body: message.body,
            timestamp: message.timestamp,
        });
        console.log("Message saved to Firestore with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }

    // Example: Reply to a specific message
    if (message.body.toLowerCase() === 'hello') {
        message.reply('Hi there! How can I help you?');
    }


    // if (message.body.toLowerCase() === 'photo') {
    //     console.log('Sending photo...');

    //     // Path to the image you want to send
    //     const imagePath = path.join(__dirname, 'images.jpeg');
        
    //     // Create a MessageMedia object for the image
    //     const media = MessageMedia.fromFilePath(imagePath);
        
    //     // Send the image to the chat
    //     message.reply(media)
    //         .then(response => {
    //             console.log('Image sent successfully:', response);
    //         })
    //         .catch(error => {
    //             console.error('Error sending image:', error);
    //         });
    // }

    if (message.body.toLowerCase().startsWith('profile ')) {
        const username = message.body.split(' ')[1]; // Extract the username after 'profile'

        console.log(`Fetching profile picture for: ${username}`);

        // Get Instagram profile picture URL
        const profilePicUrl = await getInstagramProfilePicture(username);

        if (profilePicUrl) {
            console.log('Profile picture URL:', profilePicUrl);

            // Fetch the image data and save it to a file
            const response = await axios.get(profilePicUrl, { responseType: 'arraybuffer' });

            // Save the image to a file
            const imagePath = path.join(__dirname, 'profile_pic.jpg');
            fs.writeFileSync(imagePath, response.data);

            // Create a MessageMedia object for the image
            const media = MessageMedia.fromFilePath(imagePath);

            // Send the image to the user
            message.reply(media)
                .then(() => {
                    console.log('Profile picture sent successfully!');
                    fs.unlinkSync(imagePath); // Clean up the saved image
                })
                .catch((error) => {
                    console.error('Error sending profile picture:', error);
                });
        } else {
            message.reply('Sorry, could not fetch the Instagram profile picture.');
        }
    }
});

// Log errors
client.on('error', (error) => {
    console.error('An error occurred:', error);
});

// Start the WhatsApp client
client.initialize();

// Express route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the Express server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
