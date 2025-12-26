---
title: "Happy New Year 2026"
date: 2025-12-26
ShowPostNavLinks: true
showHero: true
description: "Happy New Year"
tags: ["Happy New Year", "2026", ]

---
# Happy New Year 2026!

<div style="text-align: center;">

## Pacific Time Zone

<style>
    .countdown-container {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px;
        border-radius: 20px;
        margin: 20px 0;
        position: relative;
        overflow: hidden;
    }

    .countdown-title {
        color: #ffd700;
        font-size: 2em;
        margin-bottom: 30px;
        text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
        animation: glow 2s ease-in-out infinite alternate;
    }

    .countdown-display {
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
        margin: 30px 0;
    }

    .time-box {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        padding: 25px 35px;
        min-width: 120px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease;
    }

    .time-box:hover {
        transform: scale(1.05);
    }

    .time-number {
        font-size: 3em;
        font-weight: bold;
        color: #ffffff;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        display: block;
        font-family: 'Courier New', monospace;
    }

    .time-text {
        font-size: 1em;
        color: #ffd700;
        text-transform: uppercase;
        margin-top: 10px;
        letter-spacing: 2px;
        font-weight: bold;
    }

    .celebration-text {
        display: none;
        font-size: 3em;
        color: #ffd700;
        animation: celebrate 1s ease-in-out infinite;
        text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
    }

    .light {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        animation: float-light 3s ease-in-out infinite;
        opacity: 0.7;
        pointer-events: none;
    }

    @keyframes glow {
        from { text-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
        to { text-shadow: 0 0 30px rgba(255, 215, 0, 1), 0 0 40px rgba(255, 255, 255, 0.6); }
    }

    @keyframes celebrate {
        0%, 100% { transform: scale(1) rotate(-5deg); }
        50% { transform: scale(1.1) rotate(5deg); }
    }

    @keyframes float-light {
        0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.7; }
        50% { transform: translateY(-30px) translateX(15px); opacity: 1; }
    }

    .firework-particle {
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        pointer-events: none;
    }

    .confetti-piece {
        position: absolute;
        width: 10px;
        height: 10px;
        pointer-events: none;
    }
</style>

<div class="countdown-container" id="countdownContainer">
    <div class="countdown-title">Countdown to New Year 2026</div>
        <div class="countdown-display" id="countdownDisplay">
            <div class="time-box">
                <span class="time-number" id="days">00</span>
                <span class="time-text">Days</span>
            </div>
            <div class="time-box">
                <span class="time-number" id="hours">00</span>
                <span class="time-text">Hours</span>
            </div>
            <div class="time-box">
                <span class="time-number" id="minutes">00</span>
                <span class="time-text">Minutes</span>
            </div>
            <div class="time-box">
                <span class="time-number" id="seconds">00</span>
                <span class="time-text">Seconds</span>
            </div>
        </div>
        <div class="celebration-text" id="celebration">
            🎉 HAPPY NEW YEAR! 🎊
        </div>
</div>

<script>
(function() {
    const container = document.getElementById('countdownContainer');
    const countdownDisplay = document.getElementById('countdownDisplay');
    const celebration = document.getElementById('celebration');

    // Create floating lights
    function createFloatingLights() {
        const colors = ['#ffd700', '#ff69b4', '#00ff00', '#00bfff', '#ff6347', '#9370db', '#ffffff'];
        for (let i = 0; i < 30; i++) {
            const light = document.createElement('div');
            light.className = 'light';
            light.style.left = Math.random() * 100 + '%';
            light.style.top = Math.random() * 100 + '%';
            light.style.background = colors[Math.floor(Math.random() * colors.length)];
            light.style.animationDelay = Math.random() * 3 + 's';
            light.style.animationDuration = (Math.random() * 2 + 2) + 's';
            light.style.boxShadow = `0 0 15px ${colors[Math.floor(Math.random() * colors.length)]}`;
            container.appendChild(light);
        }
    }

    // Create firework effect
    function createFirework(x, y) {
        const colors = ['#ffd700', '#ff69b4', '#00ff00', '#00bfff', '#ff6347', '#9370db'];
        const particles = 25;

        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            particle.style.left = x + '%';
            particle.style.top = y + '%';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            const angle = (Math.PI * 2 * i) / particles;
            const velocity = 50 + Math.random() * 80;

            container.appendChild(particle);

            let pos = 0;
            const animation = setInterval(() => {
                pos += 2;
                const tx = Math.cos(angle) * pos;
                const ty = Math.sin(angle) * pos;
                particle.style.transform = `translate(${tx}px, ${ty}px)`;
                particle.style.opacity = 1 - (pos / velocity);

                if (pos >= velocity) {
                    clearInterval(animation);
                    particle.remove();
                }
            }, 20);
        }
    }

    // Random fireworks display
    function startFireworks() {
        setInterval(() => {
            const x = Math.random() * 80 + 10;
            const y = Math.random() * 80 + 10;
            createFirework(x, y);
        }, 1200);
    }

    // Create confetti
    function createConfetti() {
        const colors = ['#ffd700', '#ff69b4', '#00ff00', '#00bfff', '#ff6347', '#9370db'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-20px';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

                container.appendChild(confetti);

                let pos = 0;
                const fall = setInterval(() => {
                    pos += 3;
                    confetti.style.top = pos + 'px';
                    confetti.style.transform = `rotate(${pos * 2}deg)`;
                    confetti.style.opacity = 1 - (pos / 400);

                    if (pos >= 400) {
                        clearInterval(fall);
                        confetti.remove();
                    }
                }, 30);
            }, i * 50);
        }
    }

    // Update countdown
    function updateCountdown() {
        const now = new Date();
        const pacificTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));

        let newYear = new Date('2026-01-01T00:00:00-08:00');

        if (pacificTime >= newYear) {
            newYear = new Date('2027-01-01T00:00:00-08:00');
        }

        const timeRemaining = newYear - new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));

        if (timeRemaining <= 0) {
            countdownDisplay.style.display = 'none';
            celebration.style.display = 'block';
            createConfetti();
            setInterval(createConfetti, 3000);
            return;
        }

        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    // Initialize
    createFloatingLights();
    startFireworks();
    updateCountdown();
    setInterval(updateCountdown, 1000);
})();
</script>

</div>

---

Celebrating the arrival of 2026 in **Pacific Time Zone** with lights, fireworks and festive animations!

