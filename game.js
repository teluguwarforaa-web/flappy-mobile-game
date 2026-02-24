const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 600;

let bird = {
    x: 80,
    y: 200,
    width: 30,
    height: 30,
    gravity: 0.6,
    lift: -12,
    velocity: 0
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height) {
        endGame();
    }

    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

function createPipe() {
    let gap = 150;
    let topHeight = Math.random() * 300 + 50;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + gap,
        width: 60
    });
}

function drawPipes() {
    ctx.fillStyle = "green";

    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);

        pipe.x -= 2;

        // Collision
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
        ) {
            endGame();
        }

        // Score
        if (pipe.x + pipe.width === bird.x) {
            score++;
            document.getElementById("score").innerText = score;
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function endGame() {
    gameOver = true;
    alert("Game Over! Score: " + score);
    location.reload();
}

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateBird();
    drawBird();

    if (frame % 100 === 0) {
        createPipe();
    }

    drawPipes();

    frame++;
    requestAnimationFrame(gameLoop);
}

function jump() {
    bird.velocity = bird.lift;
}

document.addEventListener("click", jump);
document.addEventListener("touchstart", jump);

gameLoop();
