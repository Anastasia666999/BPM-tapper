const bpmNumber = document.getElementById('bpm_number');
const tapButton = document.getElementById('tap_bpm');
const bpmInput = document.getElementById('bpm-input');
const startButton = document.getElementById('start-btn');
const pulse = document.getElementById('circle_pulse');
const circleColor = document.querySelector('.bpm_display');

const taps = [];
let resetTimer;
let isRunning = false;

function handleTap() {

    if (isRunning) {
        stopMetronom();
        taps.length = 0; 
    }

    const currentTime = performance.now();

    taps.push(currentTime);

    if (taps.length > 8) {
        taps.shift();
    }

    if (taps.length >= 2) {
        let interval = 0;

        for (let i = 1; i < taps.length; i++) {
            interval += taps[i] - taps[i - 1];
        }

        const averageInterval = interval / (taps.length - 1);
        const bpm = 60000 / averageInterval;
        const roundedBpm = Math.round(bpm);
        const clampedBpm = Math.min(240, Math.max(40, roundedBpm));

        bpmInput.value = clampedBpm;
        bpmNumber.textContent = clampedBpm; 
    }

    clearTimeout(resetTimer);

    resetTimer = setTimeout(() => {
        taps.length = 0;

        if (!isRunning) {
            bpmNumber.textContent = '00';
        }
    }, 3000);
}


tapButton.addEventListener('click', handleTap);

document.addEventListener('keydown', (event) => {
    if (event.code === "Space" && !event.repeat) {
        event.preventDefault();
        handleTap();
    }
})

const soundButton = document.querySelector('.btn-sound');
const iconBtnSound = document.getElementById('icon-btn-sound');
const textSoundButton = document.getElementById('text-sound-btn');

let soundEnabled = true;

soundButton.addEventListener("click", () => {
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
        iconBtnSound.src = 'img/звук.svg';
        textSoundButton.textContent = 'вкл'
    } else {
        iconBtnSound.src = 'img/беззвук.svg';
        textSoundButton.textContent = 'выкл';
    }
})

let audioContext;
let metronomeTimer;

// Функция воспроизведения одного звука
function playSound() {
    if (!soundEnabled) return;

    if (!audioContext) {
        audioContext = new AudioContext();
    }

    // генератор звука
    const oscillator = audioContext.createOscillator();
    oscillator.connect(audioContext.destination);

    oscillator.frequency.value = 1200;

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
}
 
function startMetronome(bpm) {

    clearInterval(metronomeTimer);

    // интервал между ударами
    const interval = 60000 / bpm;

    metronomeTimer = setInterval(() => {
        playSound();
        console.log('удар')

        pulse.classList.remove('active');
        void pulse.offsetWidth;
        pulse.classList.add('active')


        circleColor.classList.remove('active');
        void circleColor.offsetWidth;
        circleColor.classList.add('active')

    }, interval);
}

function stopMetronom() {
    clearInterval(metronomeTimer);
    textButton.textContent = 'Старт';
    iconButton.src = "img/старт.svg";
    startButton.classList.remove('stop');
    isRunning = false;
}


const iconButton = document.getElementById('icon-running');
const textButton = document.getElementById('text-btn');


startButton.addEventListener("click", () => {

    if (isRunning) {
        stopMetronom();
    } else {
        const bpm = Number(bpmInput.value);

        if (bpm < 40 || bpm > 240 || !Number.isFinite(bpm)) {
            alert("Введите BPM от 40 до 240");
            return;
        }

        bpmNumber.textContent = bpm;

        startMetronome(bpm);
        textButton.textContent = 'Стоп';
        iconButton.src = "img/стоп.svg";
        startButton.classList.add('stop');
        isRunning = true;
    }
});

bpmInput.addEventListener('input', () => {
    const bpm = Number(bpmInput.value);

    if (!Number.isInteger(bpm) || bpm < 40 || bpm > 240) {
        return;
    }

    bpmNumber.textContent = bpm;

    if (isRunning) {
        startMetronome(bpm);
    }
})


