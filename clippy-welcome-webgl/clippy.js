// Canvas setup
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d', { alpha: false });

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Clippy character
class Clippy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.bounce = 0;
        this.blinkTimer = 0;
        this.isBlinking = false;
    }

    update(dt) {
        this.bounce += dt * 2;
        this.blinkTimer += dt;

        if (this.blinkTimer > 3) {
            this.isBlinking = true;
            if (this.blinkTimer > 3.15) {
                this.isBlinking = false;
                this.blinkTimer = 0;
            }
        }
    }

    draw() {
        const offsetY = Math.sin(this.bounce) * 12;

        ctx.save();
        ctx.translate(this.x, this.y + offsetY);

        // Paperclip wire
        const gradient = ctx.createLinearGradient(-50, 0, 50, 0);
        gradient.addColorStop(0, '#7880A0');
        gradient.addColorStop(0.5, '#C8D0E8');
        gradient.addColorStop(1, '#7880A0');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 18;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(-40, -150);
        ctx.lineTo(-40, 10);
        ctx.quadraticCurveTo(-40, 35, -20, 35);
        ctx.quadraticCurveTo(0, 35, 0, 10);
        ctx.lineTo(0, -150);
        ctx.quadraticCurveTo(0, -170, 20, -170);
        ctx.quadraticCurveTo(40, -170, 40, -150);
        ctx.lineTo(40, -10);
        ctx.quadraticCurveTo(40, 15, 20, 15);
        ctx.quadraticCurveTo(5, 15, 5, 0);
        ctx.lineTo(5, -130);
        ctx.stroke();

        // Eyes
        const eyeY = -120;

        // Left eye
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(-30, eyeY, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (!this.isBlinking) {
            // Left pupil
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.ellipse(-28, eyeY + 3, 11, 14, 0, 0, Math.PI * 2);
            ctx.fill();

            // Left highlight
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(-33, eyeY - 3, 7, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Eyelid
            ctx.fillStyle = '#C8D0E8';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.ellipse(-30, eyeY, 25, 24, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        // Right eye
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(20, eyeY, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (!this.isBlinking) {
            // Right pupil
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.ellipse(22, eyeY + 3, 11, 14, 0, 0, Math.PI * 2);
            ctx.fill();

            // Right highlight
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(17, eyeY - 3, 7, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Eyelid
            ctx.fillStyle = '#C8D0E8';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.ellipse(20, eyeY, 25, 24, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        // Eyebrows
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        // Left eyebrow
        ctx.beginPath();
        ctx.moveTo(-48, eyeY - 32);
        ctx.quadraticCurveTo(-30, eyeY - 39, -12, eyeY - 32);
        ctx.stroke();

        // Right eyebrow
        ctx.beginPath();
        ctx.moveTo(2, eyeY - 32);
        ctx.quadraticCurveTo(20, eyeY - 39, 38, eyeY - 32);
        ctx.stroke();

        ctx.restore();
    }
}

// Spark particle system
class Spark {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.size = Math.random() * 4 + 2;
        this.color = ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#00FFFF'][Math.floor(Math.random() * 5)];
    }

    update(dt) {
        this.x += this.vx * dt * 60;
        this.y += this.vy * dt * 60;
        this.life -= this.decay;
        this.vx *= 0.98;
        this.vy *= 0.98;
        return this.life > 0;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Window physics
const clockWindow = document.getElementById('clockWindow');
const countdownWindow = document.getElementById('countdownWindow');
const sparks = [];

let clock = {
    x: Math.random() * (window.innerWidth - 250),
    y: Math.random() * (window.innerHeight - 200),
    dx: 2,
    dy: 1.5,
    element: clockWindow
};

let countdown = {
    x: Math.random() * (window.innerWidth - 350),
    y: Math.random() * (window.innerHeight - 250),
    dx: -1.8,
    dy: -2.2,
    element: countdownWindow
};

function checkCollision(rect1, rect2) {
    return !(rect1.right < rect2.left ||
             rect1.left > rect2.right ||
             rect1.bottom < rect2.top ||
             rect1.top > rect2.bottom);
}

function updateWindows(dt) {
    const speed = dt * 60;

    clock.x += clock.dx * speed;
    clock.y += clock.dy * speed;
    countdown.x += countdown.dx * speed;
    countdown.y += countdown.dy * speed;

    const clockRect = {
        left: clock.x,
        top: clock.y,
        right: clock.x + clockWindow.offsetWidth,
        bottom: clock.y + clockWindow.offsetHeight
    };

    const countdownRect = {
        left: countdown.x,
        top: countdown.y,
        right: countdown.x + countdownWindow.offsetWidth,
        bottom: countdown.y + countdownWindow.offsetHeight
    };

    // Check collision between windows
    if (checkCollision(clockRect, countdownRect)) {
        const collisionX = (Math.max(clockRect.left, countdownRect.left) +
                           Math.min(clockRect.right, countdownRect.right)) / 2;
        const collisionY = (Math.max(clockRect.top, countdownRect.top) +
                           Math.min(clockRect.bottom, countdownRect.bottom)) / 2;

        // Create sparks
        for (let i = 0; i < 25; i++) {
            sparks.push(new Spark(collisionX, collisionY));
        }

        const overlapX = Math.min(clockRect.right - countdownRect.left,
                                  countdownRect.right - clockRect.left);
        const overlapY = Math.min(clockRect.bottom - countdownRect.top,
                                  countdownRect.bottom - clockRect.top);

        if (overlapX < overlapY) {
            clock.dx = -clock.dx;
            countdown.dx = -countdown.dx;
            if (clock.x < countdown.x) {
                clock.x -= overlapX / 2;
                countdown.x += overlapX / 2;
            } else {
                clock.x += overlapX / 2;
                countdown.x -= overlapX / 2;
            }
        } else {
            clock.dy = -clock.dy;
            countdown.dy = -countdown.dy;
            if (clock.y < countdown.y) {
                clock.y -= overlapY / 2;
                countdown.y += overlapY / 2;
            } else {
                clock.y += overlapY / 2;
                countdown.y -= overlapY / 2;
            }
        }
    }

    // Bounce off edges
    if (clock.x + clockRect.right - clockRect.left >= window.innerWidth || clock.x <= 0) {
        clock.dx = -clock.dx;
        clock.x = Math.max(0, Math.min(clock.x, window.innerWidth - (clockRect.right - clockRect.left)));
    }
    if (clock.y + clockRect.bottom - clockRect.top >= window.innerHeight || clock.y <= 0) {
        clock.dy = -clock.dy;
        clock.y = Math.max(0, Math.min(clock.y, window.innerHeight - (clockRect.bottom - clockRect.top)));
    }

    if (countdown.x + countdownRect.right - countdownRect.left >= window.innerWidth || countdown.x <= 0) {
        countdown.dx = -countdown.dx;
        countdown.x = Math.max(0, Math.min(countdown.x, window.innerWidth - (countdownRect.right - countdownRect.left)));
    }
    if (countdown.y + countdownRect.bottom - countdownRect.top >= window.innerHeight || countdown.y <= 0) {
        countdown.dy = -countdown.dy;
        countdown.y = Math.max(0, Math.min(countdown.y, window.innerHeight - (countdownRect.bottom - countdownRect.top)));
    }

    clockWindow.style.left = clock.x + 'px';
    clockWindow.style.top = clock.y + 'px';
    countdownWindow.style.left = countdown.x + 'px';
    countdownWindow.style.top = countdown.y + 'px';
}

// Clock and countdown updates
function updateClock() {
    const now = new Date();
    const options = { timeZone: 'America/Chicago', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const timeStr = now.toLocaleTimeString('en-US', options);
    document.getElementById('time').textContent = timeStr;

    const dateOptions = { timeZone: 'America/Chicago', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', dateOptions);
    document.getElementById('date').textContent = dateStr;
}

function updateCountdown() {
    const targetDate = new Date('2026-02-19T09:00:00-06:00');
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        document.getElementById('countdown').textContent = 'Tom is back!';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown').textContent =
        `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

// Message rotation
const messages = [
    "Hi! It looks like you're starting your workday. Would you like help with that?",
    "Welcome back! Ready to get some work done today?",
    "Good morning! I'm here to help you be productive!",
    "It looks like you're writing a letter. Would you like help? (Just kidding!)",
    "Did you know? You can press Ctrl+S to save your work!",
    "Tip of the day: Take regular breaks to stay fresh and focused!",
    "I see you're looking at me. Need any assistance?",
    "Having a great day? Let me know if you need anything!",
    "Remember: There's no 'I' in 'team', but there is in 'Clippy'!",
    "Pro tip: Stay hydrated and take breaks every hour!",
    "You're doing great! Keep up the good work!",
    "Coffee break time? Don't forget to save your work first!"
];

let currentMessageIndex = 0;
setInterval(() => {
    const messageEl = document.getElementById('message');
    messageEl.style.opacity = 0;
    setTimeout(() => {
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        messageEl.textContent = messages[currentMessageIndex];
        messageEl.style.opacity = 1;
    }, 500);
}, 8000);

// Initialize
const clippy = new Clippy(window.innerWidth * 0.5 - 200, window.innerHeight * 0.45);
updateClock();
updateCountdown();
setInterval(updateClock, 1000);
setInterval(updateCountdown, 1000);

// Main animation loop
let lastTime = performance.now();

function animate(currentTime) {
    const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
    lastTime = currentTime;

    // Clear canvas
    ctx.fillStyle = '#008080';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw clippy
    clippy.update(dt);
    clippy.draw();

    // Update windows
    updateWindows(dt);

    // Update and draw sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
        if (!sparks[i].update(dt)) {
            sparks.splice(i, 1);
        } else {
            sparks[i].draw();
        }
    }

    requestAnimationFrame(animate);
}

animate(lastTime);
