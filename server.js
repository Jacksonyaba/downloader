const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Handle video download requests for special platforms
app.post('/download', (req, res) => {
    const videoUrl = req.body.url;

    if (!videoUrl) {
        return res.status(400).send('No URL provided.');
    }

    // Define output path where the video will be saved
    const outputFilePath = path.join(__dirname, 'downloads', '%(title)s.%(ext)s');

    // Execute yt-dlp to download video
    exec(`yt-dlp -o "${outputFilePath}" ${videoUrl}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error downloading video: ${error}`);
            console.error(stderr); // Log stderr to see any yt-dlp specific errors
            return res.status(500).send('Failed to download video. Please check the console.');
        }
        
        console.log(`Video downloaded successfully: ${stdout}`);
        res.send('Video downloaded successfully!');
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
