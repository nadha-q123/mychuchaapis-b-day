/* =========================================================
   BIRTHDAY WEBSITE — MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   PERSONAL SETTINGS
========================================================= */

const SPOTIFY_PLAYLIST_URL = "https://open.spotify.com/playlist/0nVwYuyQeo4Gn0JG6Mx4Hw?si=JWK02CGtRf-Bzf6dybAsvA";


/* =========================================================
   SCREEN NAVIGATION
========================================================= */

function goTo(id) {

    const screens = document.querySelectorAll(".screen");

    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    const nextScreen = document.getElementById(id);

    if (!nextScreen) {
        console.error("Cannot find screen:", id);
        return;
    }

    nextScreen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    /* Draw wheel whenever wheel screen opens */

    if (id === "wheel") {
        setTimeout(() => {
            drawWheel();
        }, 50);
    }


    /* Start hearts on final screen */

    if (id === "final") {
        startHearts();
    }
}


/* =========================================================
   FLIP CARDS
========================================================= */

function flipCard(card) {

    if (!card) {
        return;
    }

    card.classList.toggle("flipped");

    console.log(
        "Card flipped:",
        card.classList.contains("flipped")
    );
}


/* =========================================================
   PHOTO LIGHTBOX
========================================================= */

function openPhoto(src, caption) {

    const lightbox = document.getElementById("lightbox");
    const img = document.getElementById("lightboxImg");
    const text = document.getElementById("lightboxCaption");

    if (!lightbox || !img) {
        return;
    }

    img.src = src;

    if (text) {
        text.textContent = caption || "";
    }

    lightbox.classList.add("show");
}


function closePhoto(event) {

    const lightbox = document.getElementById("lightbox");

    if (!lightbox) {
        return;
    }

    if (
        !event ||
        event.target === lightbox ||
        event.target.classList.contains("close")
    ) {
        lightbox.classList.remove("show");
    }
}


/* =========================================================
   SPOTIFY
========================================================= */

function setupSpotify() {

    /*
       The Spotify iframe is already inside index.html.
       Therefore we don't need to replace it.
    */

    if (!SPOTIFY_PLAYLIST_URL) {
        return;
    }

    const match = SPOTIFY_PLAYLIST_URL.match(
        /playlist[/:]([A-Za-z0-9]+)/
    );

    if (!match) {
        console.error("Invalid Spotify playlist URL.");
        return;
    }

    const box = document.querySelector(".spotify-box");

    if (!box) {
        return;
    }

    box.innerHTML = `
        <p class="spotify-title">
            YOUR SPOTIFY PLAYLIST
        </p>

        <iframe
            class="spotify-embed"
            src="https://open.spotify.com/embed/playlist/${match[1]}?utm_source=generator"
            width="100%"
            height="352"
            frameborder="0"
            allowfullscreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy">
        </iframe>
    `;
}


/* =========================================================
   BACKGROUND MUSIC
========================================================= */

function toggleMusic() {

    const audio = document.getElementById("audio");
    const musicBtn = document.getElementById("musicBtn");

    if (!audio || !musicBtn) {
        return;
    }

    const source = audio.querySelector("source");

    if (!source || !source.getAttribute("src")) {

        alert(
            "There is no background music file connected yet."
        );

        return;
    }

    if (audio.paused) {

        audio.play()
            .then(() => {
                musicBtn.textContent = "❚❚";
            })
            .catch(error => {
                console.error("Audio could not play:", error);
            });

    } else {

        audio.pause();
        musicBtn.textContent = "♫";
    }
}


/* =========================================================
   SPIN WHEEL DATA
========================================================= */

const gifts = [

    "Boots 👢",

    "A date night 💕",

    "Movie night 🎬",

    "Unlimited subscription to more kisses & hugs 💋🤗",

    "You choose! ✦",

    "One mystery gift 🎁"

];


/* =========================================================
   WHEEL VARIABLES
========================================================= */

let canvas = null;
let ctx = null;

let currentAngle = 0;
let spinning = false;


/* =========================================================
   INITIALIZE CANVAS
========================================================= */

function initializeWheel() {

    canvas = document.getElementById("wheelCanvas");

    if (!canvas) {
        console.error("wheelCanvas was not found.");
        return;
    }

    ctx = canvas.getContext("2d");

    if (!ctx) {
        console.error("Could not get canvas context.");
        return;
    }

    drawWheel();
}


/* =========================================================
   DRAW WHEEL
========================================================= */

function drawWheel() {

    if (!canvas || !ctx) {
        return;
    }

    const size = canvas.width;
    const center = size / 2;
    const radius = size / 2 - 8;

    const slice =
        (Math.PI * 2) / gifts.length;


    ctx.clearRect(
        0,
        0,
        size,
        size
    );


    const fills = [

        "#f1d2d9",
        "#ead8cf",
        "#f4e4c9",
        "#e5d4df",
        "#f0d8c6",
        "#e7d8cc"

    ];


    /* Draw each slice */

    for (let i = 0; i < gifts.length; i++) {

        const angle =
            currentAngle + i * slice;


        ctx.beginPath();

        ctx.moveTo(
            center,
            center
        );

        ctx.arc(
            center,
            center,
            radius,
            angle,
            angle + slice
        );

        ctx.closePath();


        ctx.fillStyle =
            fills[i % fills.length];

        ctx.fill();


        ctx.strokeStyle =
            "#fffaf4";

        ctx.lineWidth = 4;

        ctx.stroke();


        /* Text */

        ctx.save();

        ctx.translate(
            center,
            center
        );

        ctx.rotate(
            angle + slice / 2
        );

        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        ctx.fillStyle = "#603d46";

        ctx.font =
            "600 15px Poppins, sans-serif";


        wrapText(
            gifts[i],
            radius - 25,
            0,
            130,
            18
        );

        ctx.restore();
    }


    /* Center circle */

    ctx.beginPath();

    ctx.arc(
        center,
        center,
        40,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#8f4e61";

    ctx.fill();


    ctx.fillStyle = "#ffffff";

    ctx.font =
        "28px serif";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "♡",
        center,
        center
    );
}


/* =========================================================
   WRAP WHEEL TEXT
========================================================= */

function wrapText(
    text,
    x,
    y,
    maxWidth,
    lineHeight
) {

    if (!ctx) {
        return;
    }

    const words =
        text.split(" ");

    const lines = [];

    let line = "";


    for (const word of words) {

        const testLine =
            line + word + " ";

        const width =
            ctx.measureText(testLine).width;


        if (
            width > maxWidth &&
            line !== ""
        ) {

            lines.push(
                line.trim()
            );

            line =
                word + " ";

        } else {

            line =
                testLine;
        }
    }


    if (line.trim()) {
        lines.push(line.trim());
    }


    const startY =
        y -
        ((lines.length - 1) * lineHeight) / 2;


    lines.forEach(
        (lineText, index) => {

            ctx.fillText(
                lineText,
                x,
                startY +
                index * lineHeight
            );

        }
    );
}


/* =========================================================
   SPIN THE WHEEL
========================================================= */

function spinWheel() {

    console.log("SPIN BUTTON CLICKED");


    if (spinning) {
        return;
    }


    /* Re-find canvas in case navigation happened */

    if (!canvas) {
        initializeWheel();
    }


    if (!canvas || !ctx) {

        console.error(
            "Wheel is not initialized."
        );

        return;
    }


    const button =
        document.getElementById("spinBtn");

    const result =
        document.getElementById("wheelResult");


    if (!button || !result) {

        console.error(
            "Spin button or result is missing."
        );

        return;
    }


    spinning = true;

    button.disabled = true;

    button.textContent =
        "SPINNING... ♡";

    result.textContent = "";


    /* Random winning gift */

    const index =
        Math.floor(
            Math.random() * gifts.length
        );


    const slice =
        (Math.PI * 2) /
        gifts.length;


    /*
       Pointer is at the top.
       Calculate angle that places
       selected slice in front of pointer.
    */

    const target =
        -Math.PI / 2 -
        (
            index * slice +
            slice / 2
        );


    const fullCircle =
        Math.PI * 2;


    const normalized =
        ((currentAngle % fullCircle) +
            fullCircle) %
        fullCircle;


    let delta =
        target - normalized;


    while (delta < 0) {

        delta += fullCircle;
    }


    const extraSpins =
        5 +
        Math.floor(
            Math.random() * 3
        );


    const startAngle =
        currentAngle;


    const finalAngle =
        startAngle +
        extraSpins * fullCircle +
        delta;


    const duration = 4200;

    const startTime =
        performance.now();


    function animate(now) {

        const progress =
            Math.min(
                (now - startTime) /
                    duration,
                1
            );


        /* Ease out */

        const ease =
            1 -
            Math.pow(
                1 - progress,
                4
            );


        currentAngle =
            startAngle +
            (
                finalAngle -
                startAngle
            ) * ease;


        drawWheel();


        if (progress < 1) {

            requestAnimationFrame(
                animate
            );

        } else {

            currentAngle =
                finalAngle;

            drawWheel();


            spinning = false;

            button.disabled = false;

            button.textContent =
                "SPIN AGAIN ✦";


            result.innerHTML =
                `You got: <span>${gifts[index]}</span> 🎉`;


            paperConfetti();

            burstHearts();
        }
    }


    requestAnimationFrame(
        animate
    );
}


/* =========================================================
   PAPER CONFETTI
========================================================= */

function paperConfetti() {

    const pieces = 90;


    for (
        let i = 0;
        i < pieces;
        i++
    ) {

        const piece =
            document.createElement("span");


        piece.className =
            "paper-confetti";


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            180 +
            Math.random() *
            520;


        piece.style.setProperty(
            "--x",
            Math.cos(angle) *
                distance +
                "px"
        );


        piece.style.setProperty(
            "--y",
            Math.sin(angle) *
                distance -
                120 +
                "px"
        );


        piece.style.setProperty(
            "--r",
            (
                Math.random() *
                    1080 -
                540
            ) +
                "deg"
        );


        piece.style.setProperty(
            "--duration",
            (
                1.8 +
                Math.random() *
                    1.5
            ) +
                "s"
        );


        piece.style.width =
            6 +
            Math.random() *
                7 +
            "px";


        piece.style.height =
            8 +
            Math.random() *
                10 +
            "px";


        piece.style.borderRadius =
            Math.random() > 0.6
                ? "50%"
                : "2px";


        piece.style.background =
            `hsl(${
                Math.floor(
                    Math.random() * 360
                )
            }, 75%, 65%)`;


        piece.style.left =
            50 +
            (
                Math.random() *
                    8 -
                4
            ) +
            "%";


        piece.style.top =
            52 +
            (
                Math.random() *
                    8 -
                4
            ) +
            "%";


        document.body.appendChild(
            piece
        );


        setTimeout(
            () => {
                piece.remove();
            },
            3500
        );
    }
}


/* =========================================================
   FINAL SURPRISE
========================================================= */

function reveal() {

    console.log(
        "FINAL BUTTON CLICKED"
    );


    const secretButton =
        document.querySelector(
            ".secret-btn"
        );


    const gift =
        document.querySelector(
            ".gift"
        );


    const finalMessage =
        document.getElementById(
            "finalMessage"
        );


    if (secretButton) {

        secretButton.style.display =
            "none";
    }


    if (gift) {

        gift.style.display =
            "none";
    }


    if (finalMessage) {

        finalMessage.classList.add(
            "show"
        );
    }


    paperConfetti();

    burstHearts();
}


/* =========================================================
   RESTART
========================================================= */

function restart() {

    const finalMessage =
        document.getElementById(
            "finalMessage"
        );


    const secretButton =
        document.querySelector(
            ".secret-btn"
        );


    const gift =
        document.querySelector(
            ".gift"
        );


    if (finalMessage) {

        finalMessage.classList.remove(
            "show"
        );
    }


    if (secretButton) {

        secretButton.style.display =
            "inline-block";
    }


    if (gift) {

        gift.style.display =
            "block";
    }


    goTo("welcome");
}


/* =========================================================
   FLOATING HEARTS
========================================================= */

function createHeart() {

    const heartsContainer =
        document.getElementById(
            "hearts"
        );


    if (!heartsContainer) {
        return;
    }


    const heart =
        document.createElement(
            "span"
        );


    heart.className =
        "floating-heart";


    heart.textContent =
        Math.random() > 0.2
            ? "♡"
            : "✦";


    heart.style.left =
        Math.random() *
            100 +
        "vw";


    heart.style.fontSize =
        12 +
        Math.random() *
            18 +
        "px";


    heart.style.animationDuration =
        7 +
        Math.random() *
            7 +
        "s";


    heartsContainer.appendChild(
        heart
    );


    setTimeout(
        () => {
            heart.remove();
        },
        15000
    );
}


/* =========================================================
   START HEARTS
========================================================= */

function startHearts() {

    for (
        let i = 0;
        i < 18;
        i++
    ) {

        setTimeout(
            createHeart,
            i * 160
        );
    }
}


/* =========================================================
   HEART BURST
========================================================= */

function burstHearts() {

    for (
        let i = 0;
        i < 50;
        i++
    ) {

        setTimeout(
            createHeart,
            i * 35
        );
    }
}


/* =========================================================
   RANDOM BACKGROUND HEARTS
========================================================= */

setInterval(
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            createHeart();
        }

    },
    1800
);


/* =========================================================
   MAKE FUNCTIONS AVAILABLE TO HTML onclick
========================================================= */

window.goTo = goTo;
window.flipCard = flipCard;
window.openPhoto = openPhoto;
window.closePhoto = closePhoto;
window.toggleMusic = toggleMusic;
window.spinWheel = spinWheel;
window.reveal = reveal;
window.restart = restart;


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupSpotify();

        initializeWheel();

        startHearts();

    }
);
