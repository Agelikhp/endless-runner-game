// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let playerX = 50;
let playerY = canvas.height - 50; // Start near the bottom
let playerWidth = 30;
let playerHeight = 30;
let gravity = 2; // Slower fall
let jumpPower = 100; // Increased jump power for higher jumps
let isJumping = false;
let jumpCount = 0; // To track the number of jumps
const maxJumpCount = 100000; // Allow two jumps (normal jump + double jump)
let obstacles = [];
let score = 0;
let gameSpeed = 3; // Initial game speed
let level = 1; // Current level
let scoreThreshold = 5; // Score needed to level up
let speedIncrement = 0.5; // How much to increase the game speed each level

// Start the game
function startGame() {
    document.addEventListener('keydown', jump);
    setInterval(updateGame, 20); // Update the game every 20 ms
}

// Jump function
function jump(event) {
    if (event.code === 'Space') {
        if (jumpCount < maxJumpCount) { // Check if the player can jump
            isJumping = true; // Set jumping state
            playerY -= jumpPower; // Apply jump power
            jumpCount++; // Increment jump count
        }
    }
}

// Update game elements
function updateGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply gravity
    if (isJumping) {
        playerY += gravity;
        if (playerY >= canvas.height - playerHeight) {
            playerY = canvas.height - playerHeight; // Reset to ground level
            isJumping = false; // Player is now grounded
            jumpCount = 0; // Reset jump count when grounded
        }
    }

    // Draw the player
    ctx.fillStyle = 'blue'; // Player color
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

    // Update obstacles
    updateObstacles();

    // Level up based on score
    if (score >= level * scoreThreshold) {
        level++; // Increase level
        gameSpeed += speedIncrement; // Increase game speed
        console.log('Level Up! Current Level: ' + level + ', Game Speed: ' + gameSpeed);
    }

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
    ctx.fillText('Level: ' + level, 10, 40); // Display current level
}

// Update obstacles
function updateObstacles() {
    // Create new obstacles
    if (Math.random() < 0.02) {
        const obstacleWidth = 20;
        const obstacleHeight = Math.random() * (canvas.height - 50) + 20; // Random height
        obstacles.push({ x: canvas.width, y: canvas.height - obstacleHeight, width: obstacleWidth, height: obstacleHeight });
    }

    // Move obstacles
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= gameSpeed; // Move obstacles based on game speed

        // Check for collision
        if (
            playerX < obstacles[i].x + obstacles[i].width &&
            playerX + playerWidth > obstacles[i].x &&
            playerY + playerHeight > obstacles[i].y
        ) {
            alert('Game Over! Your score: ' + score);
            document.location.reload(); // Reload the game
        }

        // Draw obstacles
        ctx.fillStyle = 'red'; // Obstacle color
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);

        // Increase score
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
            i--;
        }
    }
}

// Start the game
startGame();