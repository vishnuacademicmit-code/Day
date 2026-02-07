const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const pCanvas = document.getElementById('canvas-particles');
const pCtx = pCanvas.getContext('2d');

let width, height;
let sparks = [];

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    pCanvas.width = width;
    pCanvas.height = height;
}

window.addEventListener('resize', resize);
resize();

// Firefly Class
class Firefly {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1; // Small dots
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.5 + 0.1; // Slow, ambient movement
        // Warm yellow/greenish firefly colors
        this.color = `hsla(${Math.random() * 60 + 40}, 100%, 50%, 0.8)`;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.angle += Math.random() * 0.2 - 0.1; // Meander

        // Wrap around screen
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        // Fireflies glow
        context.shadowBlur = 10;
        context.shadowColor = this.color;

        // Blink logic
        const flicker = Math.random() > 0.95 ? 0 : 1;
        context.globalAlpha = flicker;

        context.fill();
        context.shadowBlur = 0; // Reset
    }
}

// Spark Class
class Spark {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        // Romantic: Slower, floaty speed
        const speed = Math.random() * 1.5 + 0.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1.0;
        // Romantic: Longer life, slow fade
        this.decay = Math.random() * 0.01 + 0.005;
        this.size = Math.random() * 20 + 15; // Bigger sparks
        // Romantic: Warm Golds and Soft Pinks
        const hue = Math.random() > 0.5 ? 45 : 340; // Gold or Pinkish
        this.color = `hsl(${hue}, 100%, ${Math.random() * 20 + 70}%)`;
    }

    update() {
        // Romantic: Add slight friction/drag
        this.vx *= 0.99;
        this.vy *= 0.99;

        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.size *= 0.96;
    }

    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.life); // Slow rotation based on life

        // Draw Star Shape 
        context.beginPath();
        const spikes = 4;
        const outerRadius = this.size;
        const innerRadius = this.size / 3;

        for (let i = 0; i < spikes * 2; i++) {
            const r = (i % 2 === 0) ? outerRadius : innerRadius;
            const angle = (Math.PI * i) / spikes;
            context.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }

        context.closePath();
        context.shadowBlur = 20; // Bigger glow
        context.shadowColor = this.color;
        context.fillStyle = this.color;
        context.globalAlpha = this.life;
        context.fill();
        context.restore();
    }
}

let fireflies = [];
for (let i = 0; i < 50; i++) {
    fireflies.push(new Firefly());
}

function animate() {
    // --- CANVAS 1: MASK / REVEAL (Fades text slowly) ---
    ctx.globalCompositeOperation = 'source-over';
    // Fade the mask slowly so text stays revealed for a bit
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = 'destination-out';
    // Cut holes for the sparks (The Light)
    sparks.forEach((spark) => {
        spark.update(); // Update physics here

        ctx.save();
        ctx.translate(spark.x, spark.y);
        ctx.beginPath();
        const cutSize = spark.size * 2.0;
        ctx.arc(0, 0, cutSize, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.restore();
    });

    // --- CANVAS 2: PARTICLES (Clean movement, no trails) ---
    pCtx.clearRect(0, 0, width, height); // Clear fully every frame

    // Draw Fireflies
    fireflies.forEach(fly => {
        fly.update();
        fly.draw(pCtx);
    });

    // Draw Sparks
    sparks.forEach((spark) => {
        spark.draw(pCtx);
    });

    // Remove dead sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
        if (sparks[i].life <= 0 || sparks[i].size < 0.5) {
            sparks.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

// Initial full black cover on mask
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, width, height);

animate();

// Interactions
function spawnSparks(x, y) {
    if (Math.random() > 0.3) {
        sparks.push(new Spark(x, y));
    }
}

// Listeners on the TOP canvas (or document)
document.addEventListener('mousemove', (e) => {
    spawnSparks(e.clientX, e.clientY);
});

document.addEventListener('touchmove', (e) => {
    spawnSparks(e.touches[0].clientX, e.touches[0].clientY);
    initAudio();
});

document.addEventListener('click', (e) => {
    spawnSparks(e.clientX, e.clientY);
    initAudio();
});

// Sky Atmosphere Generation
function createAtmosphere() {
    const sky = document.getElementById('sky-container');

    // Create Stars
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

    // Create Clouds
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

// Overlay Logic
const overlay = document.getElementById('start-overlay');
if (overlay) {
    overlay.addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 1000);
        initAudio(); // Force audio on this robust interaction
    });
}

createAtmosphere();
// Try to play immediately (browser may block)
window.addEventListener('load', initAudio);

// Audio Handling
const audio = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');
let audioInitialized = false;
let isMuted = false; // Start logical state as Unmuted

function initAudio() {
    if (audioInitialized) return;

    audio.volume = 0.15; // Set volume to 15%
    audio.muted = false; // Force unmute
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
