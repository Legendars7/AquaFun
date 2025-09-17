const fileInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
const explanationBtn = document.getElementById('explanationBtn');

// When a file is selected
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const videoURL = URL.createObjectURL(file);
    videoPreview.src = videoURL;
    videoPreview.style.display = 'block';
    explanationBtn.style.display = 'inline-block';
  }
});

// When "Explanation" button is clicked
explanationBtn.addEventListener('click', () => {
  alert("This is where we will show the fish's behavior and habitat information.");
});
