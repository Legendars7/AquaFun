// script.js – detection scaffold

const fileInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

let model;

// 1) Load the model once at page load
async function loadModel() {
  try {
    console.log("Loading model...");
    model = await tf.loadGraphModel('best_web_model/model.json');
    console.log("Model loaded!");
  } catch (err) {
    console.error("Error loading model:", err);
  }
}
loadModel();

// 2) Handle video upload
videoPreview.style.display = 'none';
canvas.style.display = 'none';

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) {
    videoPreview.style.display = 'none';
    canvas.style.display = 'none';
    return;
  }

  const videoURL = URL.createObjectURL(file);
  videoPreview.src = videoURL;
  videoPreview.muted = true; // allow autoplay on most browsers
  videoPreview.style.display = 'block';
  canvas.style.display = 'block';

  videoPreview.onloadeddata = () => {
    canvas.width = videoPreview.videoWidth;
    canvas.height = videoPreview.videoHeight;
    videoPreview.play().then(() => {
      runDetection();
    });
  };
});

// 3) Detection loop: run every frame
async function runDetection() {
  // keep the loop alive
  requestAnimationFrame(runDetection);

  // wait for model and playing video
  if (!model) return;
  if (videoPreview.paused || videoPreview.ended) return;

  // Build input tensor (adjust input size later if needed)
  const inputTensor = tf.tidy(() =>
    tf.browser.fromPixels(videoPreview)
      .resizeBilinear([320, 320])  // common YOLO export size (we'll confirm)
      .expandDims(0)
      .div(255.0)
  );

  // Run inference
  let output;
  try {
    output = await model.executeAsync(inputTensor);
  } catch (err) {
    console.error("Model execute error:", err);
    tf.dispose(inputTensor);
    return;
  }

  // One-time logging so we can learn the output format
  if (!window.__loggedOnce) {
    console.log("Raw output:", output);
    if (Array.isArray(output)) {
      output.forEach((t, i) => {
        console.log(`Output[${i}] shape:`, t.shape);
        t.data().then(d => {
          console.log(`Output[${i}] sample:`, Array.from(d).slice(0, 20));
        });
      });
    } else {
      console.log("Output shape:", output.shape);
      output.data().then(d => {
        console.log("Output sample:", Array.from(d).slice(0, 20));
      });
    }
    window.__loggedOnce = true;
  }

  // TEMP: draw a dummy box so you know the canvas is aligned
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 120, 60);
  ctx.fillStyle = 'red';
  ctx.font = '16px Arial';
  ctx.fillText("Detecting...", 24, 18);

  // Cleanup tensors
  if (Array.isArray(output)) {
    output.forEach(t => t.dispose && t.dispose());
  } else {
    output.dispose && output.dispose();
  }
  inputTensor.dispose();
}
