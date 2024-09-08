const fileInput = document.querySelector("input");
const downloadBtn = document.querySelector("button");
const form = document.getElementById("downloadForm");
const messageDiv = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevents the form from submitting
    const url = fileInput.value.trim(); // get the URL input
    
    if (!url) {
        alert("Please provide a valid URL");
        return;
    }

    messageDiv.innerText = "Downloading...";
    downloadBtn.innerText = "File Downloading...";

    // Check if the URL is from social media platforms that require server-side processing
    const isSpecialPlatform = /tiktok\.com|facebook\.com|instagram\.com|telegram\.org|x\.com|snapchat\.com/.test(url);

    if (isSpecialPlatform) {
        try {
            // Handle special platforms via server-side
            const response = await fetch('/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ url }),
            });

            if (response.ok) {
                messageDiv.innerText = 'Download completed!';
            } else {
                messageDiv.innerText = 'Failed to download video.';
            }
        } catch (error) {
            messageDiv.innerText = 'An error occurred while downloading.';
            console.error(error);
        }
    } else {
        // Handle direct URL download via client-side
        fetchFile(url);
    }
});

// Function for client-side direct file download
function fetchFile(url) {
    fetch(url).then(res => res.blob()).then(file => {
        let tempUrl = URL.createObjectURL(file);
        let aTag = document.createElement("a");
        aTag.href = tempUrl;
        aTag.download = url.replace(/^.*[\\\/]/, '');
        document.body.appendChild(aTag);
        aTag.click();
        aTag.remove();
        URL.revokeObjectURL(tempUrl);
        messageDiv.innerText = "Download completed!";
        downloadBtn.innerText = "Download File!";
    }).catch(() => {
        messageDiv.innerText = "Failed to download file!";
        downloadBtn.innerText = "Download File!";
        alert("Failed to download file!!");
    });
}
