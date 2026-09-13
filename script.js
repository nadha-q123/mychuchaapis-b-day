```js
/* =========================================================
   PERSONAL SETTINGS
========================================================= */

const SPOTIFY_PLAYLIST_URL = "";


/* =========================================================
   SCREEN NAVIGATION
========================================================= */

const screens = document.querySelectorAll(".screen");

function goTo(id) {
  screens.forEach(screen => {
    screen.classList.remove("active");
  });

  const nextScreen = document.getElementById(id);

  if (!nextScreen) {
    console.error("Screen not found:", id);
    return;
  }

  nextScreen.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (id === "wheel" && typeof drawWheel === "function") {
    drawWheel();
  }

  if (id === "final" && typeof startHearts === "function") {
    startHearts();
  }
}


/* =========================================================
   FLIP CARDS
========================================================= */

function flipCard(card) {
  if (card) {
    card.classList.toggle("flipped");
  }
}


/* =========================================================
   PHOTO LIGHTBOX
========================================================= */

function openPhoto(src, caption) {
  const img = document.getElementById("lightboxImg");
  const text = document.getElementById("lightboxCaption");
  const lightbox = document.getElementById("lightbox");

  if (!img || !lightbox) return;

  img.src = src;

  if (text) {
    text.textContent = caption || "";
  }

  lightbox.classList.add("show");
}


function closePhoto(e) {
  const lightbox = document.getElementById("lightbox");

  if (!lightbox) return;

  if (
    !e ||
    e.target.id === "lightbox" ||
    e.target.classList.contains("close")
  ) {
    lightbox.classList.remove("show");
  }
}


/* =========================================================
   SPOTIFY
========================================================= */

function setupSpotify() {

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

  if (!box) return;

  box.innerHTML = `
    <p class="spotify-title">YOUR SPOTIFY PLAYLIST</p>

    <iframe
      style="border-radius:14px"
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

const audio = document.getElementById("audio");
const musicBtn = document.getElementById("musicBtn");

function toggleMusic() {

  if (!audio || !musicBtn) {
    return;
  }

  const source = audio.querySelector("source");

  if (!source) {
    alert(
      "Add an MP3 file to your assets folder and set its filename in index.html."
    );
    return;
  }

  const src = source.getAttribute("src");

  if (!src) {
    alert(
      "Add an MP3 file to your assets folder and set its filename in index.html."
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
   SPIN WHEEL
========================================================= */

const gifts = [
  "Boots 👢",
  "A date night 💕",
  "Movie night 🎬",
  "Unlimited subscription to more kisses & hugs 💋🤗",
  "You choose! ✦",
  "One mystery gift 🎁"
];

const canvas = document.getElementById("wheelCanvas");

let ctx = null;

if (canvas) {
  ctx = canvas.getContext("2d");
}

let currentAngle = 0;
let spinning = false;


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

  const slice = (Math.PI * 2) / gifts.length;

  ctx.clearRect(0, 0, size, size);

  const fills = [
    "#f1d2d9",
    "#ead8cf",
    "#f4e4c9",
    "#e5d4df",
    "#f0d8c6",
    "#e7d8cc"
  ];

  for (let i = 0; i < gifts.length; i++) {

    const angle = currentAngle + i * slice;

    ctx.beginPath();

    ctx.moveTo(center, center);

    ctx.arc(
      center,
      center,
      radius,
      angle,
      angle + slice
    );

    ctx.closePath();

    ctx.fillStyle = fills[i % fills.length];
    ctx.fill();

    ctx.strokeStyle = "#fffaf4";
    ctx.lineWidth = 4;
    ctx.stroke();


    /* TEXT */

    ctx.save();

    ctx.translate(center, center);

    ctx.rotate(angle + slice / 2);

    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#603d46";
    ctx.font = "600 15px Poppins";

    wrapText(
      gifts[i],
      radius - 25,
      0,
      125,
      18
    );

    ctx.restore();
  }


  /* CENTER CIRCLE */

  ctx.beginPath();

  ctx.arc(
    center,
    center,
    38,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = "#8f4e61";
  ctx.fill();

  ctx.fillStyle = "#fff";

  ctx.font = "25px serif";

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

  if (!ctx) return;

  const words = text.split(" ");

  let line = "";
  const lines = [];

  for (const word of words) {

    const testLine = line + word + " ";

    if (
      ctx.measureText(testLine).width > maxWidth &&
      line
    ) {

      lines.push(line.trim());

      line = word + " ";

    } else {

      line = testLine;

    }
  }

  lines.push(line.trim());

  const startY =
    y -
    ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((lineText, index) => {

    ctx.fillText(
      lineText,
      x,
      startY + index * lineHeight
    );

  });
}


/* =========================================================
   SPIN WHEEL
========================================================= */

function spinWheel() {

  if (spinning) {
    return;
  }

  if (!canvas || !ctx) {
    console.error("Wheel canvas not found.");
    return;
  }

  const button = document.getElementById("spinBtn");
  const result = document.getElementById("wheelResult");

  if (!button || !result) {
    console.error("Wheel button or result element not found.");
    return;
  }

  spinning = true;

  button.disabled = true;
  button.textContent = "SPINNING... ♡";

  result.textContent = "";


  /* Pick random gift */

  const extraSpins =
    5 + Math.floor(Math.random() * 3);

  const index =
    Math.floor(Math.random() * gifts.length);

  const slice =
    (Math.PI * 2) / gifts.length;


  /* Calculate target angle */

  const target =
    -Math.PI / 2 -
    (index * slice + slice / 2);

  const normalized =
    currentAngle % (Math.PI * 2);

  let delta =
    target - normalized;

  while (delta < 0) {
    delta += Math.PI * 2;
  }


  const startAngle = currentAngle;

  const finalAngle =
    startAngle +
    extraSpins * Math.PI * 2 +
    delta;


  const duration = 4200;

  const startTime = performance.now();


  /* Animation */

  function animate(now) {

    const progress =
      Math.min(
        (now - startTime) / duration,
        1
      );

    /* Smooth easing */

    const ease =
      1 - Math.pow(1 - progress, 4);


    currentAngle =
      startAngle +
      (finalAngle - startAngle) *
      ease;


    drawWheel();


    if (progress < 1) {

      requestAnimationFrame(animate);

    } else {

      /* Finished */

      currentAngle = finalAngle;

      drawWheel();

      spinning = false;

      button.disabled = false;

      button.textContent = "SPIN AGAIN ✦";

      result.innerHTML =
        `You got: <span>${gifts[index]}</span> 🎉`;

      paperConfetti();

      burstHearts();
    }
  }


  requestAnimationFrame(animate);
}


/* =========================================================
   PAPER CONFETTI
========================================================= */

function paperConfetti() {

  const pieces = 90;

  for (let i = 0; i < pieces; i++) {

    const piece =
      document.createElement("span");

    piece.className =
      "paper-confetti";

    const angle =
      Math.random() * Math.PI * 2;

    const distance =
      180 + Math.random() * 520;


    piece.style.setProperty(
      "--x",
      Math.cos(angle) * distance + "px"
    );

    piece.style.setProperty(
      "--y",
      Math.sin(angle) * distance - 120 + "px"
    );

    piece.style.setProperty(
      "--r",
      Math.random() * 1080 - 540 + "deg"
    );

    piece.style.setProperty(
      "--duration",
      1.8 + Math.random() * 1.5 + "s"
    );


    piece.style.width =
      6 + Math.random() * 7 + "px";

    piece.style.height =
      8 + Math.random() * 10 + "px";


    piece.style.borderRadius =
      Math.random() > 0.6
        ? "50%"
        : "2px";


    piece.style.background =
      `hsl(${Math.floor(Math.random() * 360)}, 75%, 65%)`;


    piece.style.left =
      50 + (Math.random() * 8 - 4) + "%";

    piece.style.top =
      52 + (Math.random() * 8 - 4) + "%";


    document.body.appendChild(piece);


    setTimeout(() => {

      piece.remove();

    }, 3500);
  }
}


/* =========================================================
   FINAL SURPRISE
========================================================= */

function reveal() {

  const secretButton =
    document.querySelector(".secret-btn");

  const gift =
    document.querySelector(".gift");

  const finalMessage =
    document.getElementById("finalMessage");


  if (secretButton) {
    secretButton.style.display = "none";
  }

  if (gift) {
    gift.style.display = "none";
  }

  if (finalMessage) {
    finalMessage.classList.add("show");
  }

  burstHearts();
}


/* =========================================================
   RESTART
========================================================= */

function restart() {

  const finalMessage =
    document.getElementById("finalMessage");

  const secretButton =
    document.querySelector(".secret-btn");

  const gift =
    document.querySelector(".gift");


  if (finalMessage) {
    finalMessage.classList.remove("show");
  }

  if (secretButton) {
    secretButton.style.display = "inline-block";
  }

  if (gift) {
    gift.style.display = "block";
  }

  goTo("welcome");
}


/* =========================================================
   FLOATING HEARTS
========================================================= */

function createHeart() {

  const heartsContainer =
    document.getElementById("hearts");

  if (!heartsContainer) {
    return;
  }


  const heart =
    document.createElement("span");

  heart.className =
    "floating-heart";

  heart.textContent =
    Math.random() > 0.2
      ? "♡"
      : "✦";


  heart.style.left =
    Math.random() * 100 + "vw";

  heart.style.fontSize =
    12 + Math.random() * 18 + "px";

  heart.style.animationDuration =
    7 + Math.random() * 7 + "s";


  heartsContainer.appendChild(heart);


  setTimeout(() => {

    heart.remove();

  }, 15000);
}


/* =========================================================
   START HEARTS
========================================================= */

function startHearts() {

  for (let i = 0; i < 18; i++) {

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

  for (let i = 0; i < 50; i++) {

    setTimeout(
      createHeart,
      i * 35
    );

  }
}


/* =========================================================
   RANDOM BACKGROUND HEARTS
========================================================= */

setInterval(() => {

  if (
    document.visibilityState === "visible"
  ) {
    createHeart();
  }

}, 1800);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    setupSpotify();

    drawWheel();

  }
);
```
