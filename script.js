const SERVER_NAME = 'Cidade Noturna Roleplay';
const SERVER_IP = '190.102.40.7';
const SERVER_PORT = '23453';
const AUTO_CONNECT_SECONDS = 8;
const CONNECT_URI = `mtasa://${SERVER_IP}:${SERVER_PORT}`;

const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
const countdownLabel = document.getElementById('countdownLabel');
const mtaWarning = document.getElementById('mtaWarning');
const bubblesContainer = document.getElementById('bubblesContainer');
const connectNowBtn = document.getElementById('connectNowBtn');
const copyAddressBtn = document.getElementById('copyAddressBtn');
const toggleMusicBtn = document.getElementById('toggleMusicBtn');
const bgMusic = document.getElementById('bgMusic');
const skylineWindows = document.querySelector('.skyline-front .windows');
const skylineBuildings = document.querySelectorAll('.skyline-front .buildings rect');
const starsContainer = document.querySelector('.stars');
 
let mtaOpened = false;
let hasAttemptedOpen = false;
let musicEnabled = true;
 
const progressStages = [
    'Verificando arquivos do servidor',
    'Sincronizando recursos',
    'Preparando conexão segura',
    'Quase pronto para jogar'
];
 
for (let i = 0; i < 35; i += 1) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
 
    const size = Math.random() * 17 + 8;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${15 + Math.random() * 10}s`;
    bubble.style.animationDelay = `${Math.random() * 5}s`;
    bubble.style.opacity = Math.random() * 0.6 + 0.2;
 
    bubblesContainer.appendChild(bubble);
}
 
// Gera um céu bem estrelado, com brilho e tamanhos variados + estrelas cadentes ocasionais
function generateStars() {
    if (!starsContainer) {
        return;
    }
 
    const STAR_COUNT = 180;
 
    for (let i = 0; i < STAR_COUNT; i += 1) {
        const star = document.createElement('div');
        star.className = 'star';
 
        const size = Math.random() * 2 + 0.8;
        const top = Math.random() * 70; // mantém mais estrelas na parte de cima do céu
        const left = Math.random() * 100;
        const duration = 2 + Math.random() * 4;
        const delay = Math.random() * 5;
        const minOpacity = (Math.random() * 0.3 + 0.1).toFixed(2);
        const maxOpacity = (Math.random() * 0.4 + 0.6).toFixed(2);
 
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.top = `${top}%`;
        star.style.left = `${left}%`;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;
        star.style.setProperty('--min-opacity', minOpacity);
        star.style.setProperty('--max-opacity', maxOpacity);
 
        if (Math.random() > 0.85) {
            star.style.boxShadow = `0 0 ${size * 3}px rgba(200, 107, 255, 0.6)`;
        }
 
        starsContainer.appendChild(star);
    }
 
    // Estrelas cadentes esporádicas
    for (let i = 0; i < 3; i += 1) {
        const shooting = document.createElement('div');
        shooting.className = 'star shooting';
        shooting.style.top = `${Math.random() * 35}%`;
        shooting.style.left = `${50 + Math.random() * 45}%`;
        shooting.style.animationDelay = `${Math.random() * 12}s`;
        starsContainer.appendChild(shooting);
    }
}
 
// Gera janelas acesas dentro de cada prédio do skyline, piscando aleatoriamente
function generateSkylineWindows() {
    if (!skylineWindows || !skylineBuildings.length) {
        return;
    }
 
    const svgNS = 'http://www.w3.org/2000/svg';
 
    skylineBuildings.forEach((building) => {
        const bx = parseFloat(building.getAttribute('x'));
        const by = parseFloat(building.getAttribute('y'));
        const bw = parseFloat(building.getAttribute('width'));
        const bh = parseFloat(building.getAttribute('height'));
 
        const winSize = 6;
        const gap = 4;
        const cols = Math.max(1, Math.floor((bw - gap) / (winSize + gap)));
        const rows = Math.max(1, Math.floor((bh - gap) / (winSize + gap)));
 
        for (let r = 0; r < rows; r += 1) {
            for (let c = 0; c < cols; c += 1) {
                if (Math.random() > 0.55) {
                    continue;
                }
 
                const wx = bx + gap + c * (winSize + gap);
                const wy = by + gap + r * (winSize + gap);
 
                const rect = document.createElementNS(svgNS, 'rect');
                rect.setAttribute('x', wx);
                rect.setAttribute('y', wy);
                rect.setAttribute('width', winSize);
                rect.setAttribute('height', winSize);
                rect.style.fill = Math.random() > 0.7 ? 'var(--accent-cyan)' : 'var(--primary)';
                rect.style.opacity = (Math.random() * 0.5 + 0.4).toFixed(2);
                rect.style.animation = `windowPulse ${4 + Math.random() * 5}s ease-in-out ${Math.random() * 4}s infinite`;
 
                skylineWindows.appendChild(rect);
            }
        }
    });
}
 
window.addEventListener('blur', () => {
    if (hasAttemptedOpen) {
        mtaOpened = true;
    }
});
 
function updateProgress(value) {
    const clamped = Math.max(0, Math.min(100, value));
    const stageIndex = Math.min(progressStages.length - 1, Math.floor(clamped / 25));
 
    progressBar.style.width = `${clamped}%`;
    progressLabel.textContent = `${progressStages[stageIndex]}... ${clamped}%`;
}
 
async function copyServerAddress() {
    const address = `${SERVER_IP}:${SERVER_PORT}`;
    try {
        await navigator.clipboard.writeText(address);
        copyAddressBtn.textContent = 'Endereço copiado!';
        setTimeout(() => {
            copyAddressBtn.textContent = 'Copiar endereço';
        }, 1800);
    } catch {
        copyAddressBtn.textContent = address;
    }
}
 
function showWarningIfMtaDidNotOpen() {
    setTimeout(() => {
        if (!mtaOpened) {
            mtaWarning.style.display = 'block';
        }
    }, 2200);
}
 
function updateMusicButtonLabel() {
    toggleMusicBtn.textContent = musicEnabled ? '🔊 Música: ligada' : '🔇 Música: desligada';
}
 
function startMusic() {
    if (!musicEnabled) {
        return;
    }
 
    bgMusic.volume = 0.35;
    bgMusic.play().catch(() => {
        countdownLabel.textContent = 'Clique em qualquer lugar para iniciar a música';
    });
}
 
function toggleMusic() {
    musicEnabled = !musicEnabled;
 
    if (musicEnabled) {
        startMusic();
    } else {
        bgMusic.pause();
    }
 
    updateMusicButtonLabel();
}
 
function connectToServer() {
    hasAttemptedOpen = true;
    window.location.href = CONNECT_URI;
    showWarningIfMtaDidNotOpen();
}
 
function startLoadingScreen() {
    let progress = 0;
    let countdown = AUTO_CONNECT_SECONDS;
 
    updateProgress(progress);
    countdownLabel.textContent = `Conexão automática em ${countdown}s`;
 
    const timer = setInterval(() => {
        progress += Math.ceil(Math.random() * 9);
        updateProgress(progress);
 
        countdown -= 1;
        if (countdown >= 0) {
            countdownLabel.textContent = `Conexão automática em ${countdown}s`;
        }
 
        if (countdown <= 0 || progress >= 100) {
            clearInterval(timer);
            updateProgress(100);
            countdownLabel.textContent = 'Abrindo o MTA...';
            connectToServer();
        }
    }, 1000);
}
 
connectNowBtn.addEventListener('click', connectToServer);
copyAddressBtn.addEventListener('click', copyServerAddress);
toggleMusicBtn.addEventListener('click', toggleMusic);
 
window.addEventListener('click', startMusic, { once: true });
window.addEventListener('keydown', startMusic, { once: true });
 
document.getElementById('serverName').textContent = SERVER_NAME;
updateMusicButtonLabel();
generateStars();
generateSkylineWindows();
startMusic();
startLoadingScreen();