const fileInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
const explanationBtn = document.getElementById('explanationBtn');

// Hide video and button at the start
videoPreview.style.display = 'none';
explanationBtn.style.display = 'none';

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const videoURL = URL.createObjectURL(file);
    videoPreview.src = videoURL;
    videoPreview.style.display = 'block'; // Show video
    explanationBtn.style.display = 'inline-block'; // Show button
  } else {
    // If no file selected, hide them again
    videoPreview.style.display = 'none';
    explanationBtn.style.display = 'none';
  }
});

explanationBtn.addEventListener('click', () => {
  alert("This is where we will show the fish's behavior and habitat information.");
});
