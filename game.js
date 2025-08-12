const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

const gravity = 0.5;
let platforms = [];
let player;

class Player {
  constructor() {
    this.width = 40;
    this.height = 40;
    this.x = 50;
    this.y = 0;
    this.dy = 0;
    this.dx = 0;
    this.jumpPower = -10;
    this.onGround = false;
    this.color = '#ff0000'; // Mario-like color
  }

  update() {
    if (keys['ArrowLeft']) this.dx = -4;
    else if (keys['ArrowRight']) this.dx = 4;
    else this.dx = 0;

    if (keys[' '] && this.onGround) {
      this.dy = this.jumpPower;
      this.onGround = false;
    }

    this.dy += gravity;
    this.x += this.dx;
    this.y += this.dy;

    // Collision with platforms
    this.onGround = false;
    for (let plat of platforms) {
      if (
        this.x < plat.x + plat.width &&
        this.x + this.width > plat.x &&
        this.y + this.height < plat.y + plat.height &&
        this.y + this.height + this.dy >= plat.y
      ) {
        this.dy = 0;
        this.y = plat.y - this.height;
        this.onGround = true;
      }
    }

    // Floor
    if (this.y + this.height > canvas.height) {
      this.dy = 0;
      this.y = canvas.height - this.height;
      this.onGround = true;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = '#654321'; // Dirt brown
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function init() {
  player = new Player();
  platforms = [
    new Platform(0, 360, 800, 40),
    new Platform(200, 300, 100, 20),
    new Platform(400, 250, 100, 20),
    new Platform(600, 200, 100, 20)
  ];
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  player.draw();
  platforms.forEach(p => p.draw());
  requestAnimationFrame(gameLoop);
}

init();
gameLoop();
