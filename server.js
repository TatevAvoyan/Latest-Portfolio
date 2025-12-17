// Simple Node.js server using Express
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (CSS, JS, images, videos)
app.use(express.static('public'));
app.use('/images', express.static('public/images'));
app.use('/videos', express.static('public/videos'));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});

