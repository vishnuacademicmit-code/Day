// --- BACKGROUND EFFECTS (COPIED FROM PREVIOUS) ---
const width = window.innerWidth;
const height = window.innerHeight;

const canvas = document.createElement('canvas');
canvas.id = 'bg-canvas';
canvas.width = width;
canvas.height = height;
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '0';
canvas.style.pointerEvents = 'none';
document.body.prepend(canvas);

const ctx = canvas.getContext('2d');

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Firefly {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.5 + 0.1;
        this.color = `hsla(${Math.random() * 60 + 40}, 100%, 50%, 0.8)`;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.angle += Math.random() * 0.2 - 0.1;

        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.shadowBlur = 10;
        context.shadowColor = this.color;

        const flicker = Math.random() > 0.95 ? 0 : 1;
        context.globalAlpha = flicker;

        context.fill();
        context.shadowBlur = 0;
    }
}

let fireflies = [];
for (let i = 0; i < 30; i++) {
    fireflies.push(new Firefly());
}

function createAtmosphere() {
    const sky = document.getElementById('sky-container');
    if (!sky) return;

    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 40 + 'vh';
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.animationDelay = Math.random() * 3 + 's';
        sky.appendChild(star);
    }

    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.classList.add('cloud');
        const size = Math.random() * 300 + 200;
        cloud.style.width = size + 'px';
        cloud.style.height = size * 0.6 + 'px';
        cloud.style.top = Math.random() * 50 + 'vh';
        cloud.style.left = Math.random() * 100 + 'vw';
        cloud.style.animationDuration = (Math.random() * 40 + 40) + 's';
        sky.appendChild(cloud);
    }
}

function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireflies.forEach(fly => {
        fly.update();
        fly.draw(ctx);
    });
    requestAnimationFrame(animateBackground);
}

// --- MEMORY RUN LOGIC ---

// Configuration
const TOTAL_IMAGES = 25;
const IMAGE_DURATION = 2000; // 2 seconds per image
let currentIndex = 1;

const polaroid = document.getElementById('current-polaroid');
const photoImg = document.getElementById('photo-img');
const caption = document.getElementById('photo-caption');
const loadingIndicator = document.getElementById('loading-indicator');


// Preload images to avoid lag
const images = [];
let loadedCount = 0;

function preloadImages() {
    for (let i = 1; i <= TOTAL_IMAGES; i++) {
        const img = new Image();
        img.src = `gallery_images/img${i}.jpeg`;
        img.onload = () => {
            loadedCount++;
            if (loadedCount === TOTAL_IMAGES) {
                startMemoryRun();
            }
        };
        img.onerror = () => {
            // If image fails, count it anyway so we don't stick forever
            loadedCount++;
            if (loadedCount === TOTAL_IMAGES) {
                startMemoryRun();
            }
        };
        images.push(img);
    }

    // Fallback in case loading takes too long (3s max wait)
    setTimeout(() => {
        if (loadedCount < TOTAL_IMAGES) startMemoryRun();
    }, 3000);
}

function updatePolaroid(index) {
    // Fade out
    polaroid.classList.remove('active');

    setTimeout(() => {
        // Change src
        const imgPath = `gallery_images/img${index}.jpeg`;
        photoImg.src = imgPath;
        //caption.textContent = `Memory ${index}`;

        // Random slight rotation for realism
        const rot = Math.random() * 6 - 3; // -3 to 3 deg
        polaroid.style.transform = `rotate(${rot}deg)`;

        // Fade in
        polaroid.classList.add('active');
    }, 400); // Wait for fade out
}

function startMemoryRun() {
    loadingIndicator.style.display = 'none';


    // Show first image immediately
    updatePolaroid(currentIndex);

    // Cycle every 2 seconds
    setInterval(() => {
        currentIndex++;
        if (currentIndex > TOTAL_IMAGES) currentIndex = 1; // Loop back
        updatePolaroid(currentIndex);
    }, IMAGE_DURATION);
}

// Initialization
createAtmosphere();
animateBackground();
preloadImages();
// Try to play immediately (browser may block)
window.addEventListener('load', initAudio);


// --- AUDIO HANDLING ---
const audio = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');
let audioInitialized = false;
let isMuted = false; // Start logical state as Unmuted

function initAudio() {
    if (audioInitialized) return;

    audio.volume = 0.15;
    audio.muted = false;
    audio.play().then(() => {
        audioInitialized = true;
        isMuted = false;
        updateMuteButton();
    }).catch(err => {
        console.log("Audio autoplay failed:", err);
    });
}

muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    if (!audioInitialized) {
        initAudio();
        return;
    }

    if (audio.paused) {
        audio.play();
        isMuted = false;
    } else {
        isMuted = !isMuted;
        audio.muted = isMuted;
    }
    updateMuteButton();
});

function updateMuteButton() {
    if (audio.muted) {
        muteBtn.textContent = '🔇';
    } else {
        muteBtn.textContent = '🔊';
    }
}

// Attempt to play on any click in the gallery
document.addEventListener('click', () => initAudio());
document.addEventListener('touchstart', () => initAudio());



