// script.js — frontend only, no backend/model code

// Get DOM elements
const fileInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
const canvas = document.getElementById('overlay');

// Hide video/canvas initially
videoPreview.style.display = 'none';
canvas.style.display = 'none';

// Handle video upload
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];

  if (file) {
    const videoURL = URL.createObjectURL(file);
    videoPreview.src = videoURL;
    videoPreview.muted = true; // allow autoplay if needed
    videoPreview.style.display = 'block';
    canvas.style.display = 'block';

    // Match canvas size to video
    videoPreview.onloadeddata = () => {
      canvas.width = videoPreview.videoWidth;
      canvas.height = videoPreview.videoHeight;
    };
  } else {
    videoPreview.style.display = 'none';
    canvas.style.display = 'none';
  }
});
