const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

canvas.width = 800;
canvas.height = 600;

let fruits = [];
let score = 0;
const gravity = 0.1;

class Fruit {
    constructor(x, y, angle, speed, canSlice = true) {
        this.x = x;
        this.y = y;
        this.radius = canSlice ? 30 : 15;
        this.sliced = false;
        this.canSlice = canSlice;
        
        this.angle = angle;
        this.speed = speed;
        this.velocityX = Math.cos(this.angle) * this.speed;
        this.velocityY = -Math.sin(this.angle) * this.speed * 1.3;

        this.lifeTime = 0;
    }

    update(deltaTime) {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += gravity;
        this.lifeTime += deltaTime;

        if (this.lifeTime > 4000) {
            this.sliced = true;
        }
    }

    draw() {
        if (!this.sliced) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.canSlice ? "green" : "red";
            ctx.fill();
            ctx.stroke();
        }
    }

    isMouseOver(mx, my) {
        return Math.hypot(mx - this.x, my - this.y) < this.radius;
    }

    split() {
        if (!this.sliced && this.canSlice) {
            this.sliced = true;
            score += 10;
            scoreElement.textContent = score;

            fruits.push(new Fruit(this.x - 10, this.y, this.angle - 0.3, this.speed / 1.5, false));
            fruits.push(new Fruit(this.x + 10, this.y, this.angle + 0.3, this.speed / 1.5, false));
        }
    }
}

function spawnFruit() {
    let x = Math.random() * (canvas.width - 100) + 50;
    let angle = Math.PI / 4 + Math.random() * (Math.PI / 2);
    let speed = Math.random() * 3 + 5;
    fruits.push(new Fruit(x, canvas.height - 10, angle, speed));
}

canvas.addEventListener("mousemove", (event) => {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    fruits.forEach(fruit => {
        if (fruit.isMouseOver(mouseX, mouseY)) {
            fruit.split();
        }
    });
});

let lastTime = 0;
function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fruits.forEach(fruit => {
        fruit.update(deltaTime);
        fruit.draw();
    });

    fruits = fruits.filter(fruit => !fruit.sliced && fruit.y < canvas.height && fruit.x > -50 && fruit.x < canvas.width + 50);

    requestAnimationFrame(gameLoop);
}

setInterval(spawnFruit, 1200);
requestAnimationFrame(gameLoop);
