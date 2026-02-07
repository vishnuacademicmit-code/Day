// Re-use atmosphere from gallery logic
const sky = document.getElementById('sky-container');
if (sky) {
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 40 + 'vh';
        star.style.width = Math.random() * 2 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 3 + 's';
        sky.appendChild(star);
    }
}

// --- AUDIO LOGIC ---
const audio = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');

window.addEventListener('load', () => {
    audio.volume = 0.15;
    audio.play().catch(() => console.log("Audio autoplay blocked"));
    setTimeout(openScroll, 1000);
});

muteBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        muteBtn.textContent = '🔊';
    } else {
        if (audio.muted) {
            audio.muted = false;
            muteBtn.textContent = '🔊';
        } else {
            audio.muted = true;
            muteBtn.textContent = '🔇';
        }
    }
});

// --- SCROLL & SPARKLE WRITING LOGIC ---
const scrollContainer = document.getElementById('scroll-container');
const scrollContent = document.querySelector('.scroll-content');
const typewriterText = document.getElementById('typewriter-text');
const homeBtn = document.querySelector('.home-btn');
const cursorTarget = document.getElementById('cursor-target');

const message = "Happy Birthday, \nFor the special person, For the girl I once knew, and For the strong woman I see now.\n\nWishing you a year filled with meaningful memories and gentle wins along the way.Hope this year gives you plenty of moments where you just smile and think, yeah…\n\nOnce again Happy Birthday\nSilpha Miss 😉";

function openScroll() {
    // Vertical Unroll Trigger
    scrollContainer.classList.add('scroll-open');
    setTimeout(() => {
        startWriting();
    }, 2500);
}

function startWriting() {
    scrollContent.style.opacity = '1';
    let i = 0;

    function createSparkle() {
        const rect = cursorTarget.getBoundingClientRect();
        for (let j = 0; j < 3; j++) {
            const p = document.createElement('div');
            p.className = 'sparkle-char';
            p.innerHTML = '✨';
            p.style.left = rect.left + (Math.random() * 20 - 10) + 'px';
            p.style.top = rect.top + (Math.random() * 20 - 10) + 'px';
            p.style.fontSize = (Math.random() * 10 + 8) + 'px';
            p.style.opacity = '1';
            p.style.position = 'fixed';
            p.style.transition = "all 0.6s ease-out";

            document.body.appendChild(p);

            setTimeout(() => {
                p.style.transform = `translate(${(Math.random() - 0.5) * 30}px, ${-20 - Math.random() * 20}px) scale(0)`;
                p.style.opacity = '0';
            }, 10);

            setTimeout(() => p.remove(), 600);
        }
    }

    function type() {
        if (i < message.length) {
            let char = message.charAt(i);
            const span = document.createElement('span');
            span.innerHTML = char === '\n' ? '<br>' : char;
            typewriterText.insertBefore(span, cursorTarget);

            if (char !== ' ' && char !== '\n') {
                createSparkle();
            }

            i++;
            setTimeout(type, Math.random() * 60 + 30);
        } else {
            finishAnimation();
        }
    }
    type();
}

function finishAnimation() {
    setTimeout(() => {
        homeBtn.style.display = 'block';
        setTimeout(() => homeBtn.style.opacity = '1', 100);
    }, 1000);
}

