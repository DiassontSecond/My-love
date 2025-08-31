// script.js
function toggleMenu() {
  document.querySelector("nav .menu").classList.toggle("active");
}

// Плавный скролл при клике на пункт меню
document.querySelectorAll("nav .menu a").forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault(); // предотвращаем резкий переход
    const targetId = this.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
    // Скрываем меню на мобильном
    document.querySelector("nav .menu").classList.remove("active");
  });
});

/* --- Фон с сердечками --- */
const canvas = document.getElementById("heartsCanvas");
const ctx = canvas.getContext("2d");
let hearts = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Heart {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height;
    this.size = 12 + Math.random() * 20;
    this.speed = 1 + Math.random() * 2;
    this.opacity = 0.4 + Math.random() * 0.6;
  }
  draw() {
    ctx.fillStyle = `rgba(255, 77, 109, ${this.opacity})`;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.bezierCurveTo(this.x - this.size/2, this.y - this.size/2,
                      this.x - this.size, this.y + this.size/3,
                      this.x, this.y + this.size);
    ctx.bezierCurveTo(this.x + this.size, this.y + this.size/3,
                      this.x + this.size/2, this.y - this.size/2,
                      this.x, this.y);
    ctx.fill();
  }
  update() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.y = -this.size;
      this.x = Math.random() * canvas.width;
    }
    this.draw();
  }
}

for (let i = 0; i < 80; i++) {
  hearts.push(new Heart());
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  hearts.forEach(h => h.update());
  requestAnimationFrame(animate);
}
animate();

/* --- ПАЗЛ --- */
const puzzleCanvas = document.getElementById("puzzleCanvas");
if (puzzleCanvas) {
  const ctxP = puzzleCanvas.getContext("2d");
  const img = new Image();
  img.src = "img/puzzle.jpg"; // твое фото
  const rows = 4, cols = 2;   // 8 частей (2 по ширине × 4 по высоте)
  const pieceSize = 120;      // размер кусочка
  puzzleCanvas.width = cols * pieceSize;
  puzzleCanvas.height = rows * pieceSize;

  let pieces = [];
  let dragging = null;
  let offsetX, offsetY;

  img.onload = () => {
    // режем картинку
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        pieces.push({
          sx: c * (img.width / cols),
          sy: r * (img.height / rows),
          sw: img.width / cols,
          sh: img.height / rows,
          x: Math.random() * (puzzleCanvas.width - pieceSize),
          y: Math.random() * (puzzleCanvas.height - pieceSize),
          correctX: c * pieceSize,
          correctY: r * pieceSize,
          placed: false
        });
      }
    }
    drawPuzzle();
  };

  function drawPuzzle() {
    ctxP.clearRect(0,0,puzzleCanvas.width,puzzleCanvas.height);
    pieces.forEach(p => {
      ctxP.drawImage(img, p.sx, p.sy, p.sw, p.sh,
                     p.x, p.y, pieceSize, pieceSize);
      ctxP.strokeStyle = "white";
      ctxP.lineWidth = 2;
      ctxP.strokeRect(p.x, p.y, pieceSize, pieceSize);
    });
  }

  function getPieceAt(x, y) {
    return pieces.find(p =>
      x > p.x && x < p.x + pieceSize &&
      y > p.y && y < p.y + pieceSize
    );
  }

  function startDrag(e) {
    e.preventDefault();
    const rect = puzzleCanvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    dragging = getPieceAt(x, y);
    if (dragging) {
      offsetX = x - dragging.x;
      offsetY = y - dragging.y;
    }
  }

  function moveDrag(e) {
    if (!dragging) return;
    const rect = puzzleCanvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    dragging.x = x - offsetX;
    dragging.y = y - offsetY;
    drawPuzzle();
  }

  function endDrag() {
    if (!dragging) return;
    // проверка на совпадение
    if (Math.abs(dragging.x - dragging.correctX) < 15 &&
        Math.abs(dragging.y - dragging.correctY) < 15) {
      dragging.x = dragging.correctX;
      dragging.y = dragging.correctY;
      dragging.placed = true;
    }
    dragging = null;
    drawPuzzle();

    // если все на месте → показать сообщение
    if (pieces.every(p => p.placed)) {
      setTimeout(() => {
        document.getElementById("gameResult").textContent = "Я тебя безумно сильно люблю 💖";
      }, 1000);
    }
  }

  // мышь
  puzzleCanvas.addEventListener("mousedown", startDrag);
  puzzleCanvas.addEventListener("mousemove", moveDrag);
  puzzleCanvas.addEventListener("mouseup", endDrag);

  // сенсор
  puzzleCanvas.addEventListener("touchstart", startDrag);
  puzzleCanvas.addEventListener("touchmove", moveDrag);
  puzzleCanvas.addEventListener("touchend", endDrag);
}
document.addEventListener("DOMContentLoaded", () => {
  const mainPhoto = document.getElementById("mainPhoto");
  const loveSong = document.getElementById("loveSong");

  mainPhoto.addEventListener("click", () => {
    loveSong.play();
  });
});
