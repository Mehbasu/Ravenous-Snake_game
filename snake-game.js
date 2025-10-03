// Game constants
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const GRID_SIZE = 20;
const GRID_WIDTH = CANVAS_WIDTH / GRID_SIZE;
const GRID_HEIGHT = CANVAS_HEIGHT / GRID_SIZE;

// Colors
const COLORS = {
    // Snake colors
    SNAKE_HEAD: '#228b22',
    SNAKE_BODY: '#32cd32', 
    SNAKE_BELLY: '#90ee90',
    SNAKE_PATTERN: '#006400',
    
    // Background gradient colors
    PURPLE_DARK: '#4b0082',
    PINK_LIGHT: '#ffb6c1',
    
    // UI colors
    WHITE: '#ffffff',
    BLACK: '#000000'
};

// Food types with colors
const FOOD_TYPES = {
    apple: { color: '#ff4500', highlight: '#ff8c64', stem: '#8b4513', leaf: '#228b22' },
    carrot: { color: '#ff8c00', highlight: '#ffc864', stem: '#228b22', leaf: '#32cd32' },
    grapes: { color: '#800080', highlight: '#c864c8', stem: '#8b4513', leaf: '#228b22' },
    banana: { color: '#ffff00', highlight: '#ffff96', stem: '#8b4513', leaf: '#228b22' },
    cherry: { color: '#dc143c', highlight: '#ff6496', stem: '#8b4513', leaf: '#228b22' },
    orange: { color: '#ffa500', highlight: '#ffc864', stem: '#8b4513', leaf: '#228b22' }
};

// Directions
const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.gameOverElement = document.getElementById('gameOver');
        this.startScreenElement = document.getElementById('startScreen');
        this.finalScoreElement = document.getElementById('finalScore');
        
        // Game states
        this.gameState = 'start'; // 'start', 'playing', 'paused', 'gameOver'
        this.gameStarted = false;
        this.animationId = null;
        
        // Mobile detection
        this.isMobile = this.detectMobile();
        
        this.resetGame();
        this.setupEventListeners();
        this.setupTouchControls();
        this.showStartScreen();
        this.draw(); // Draw initial state
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               ('ontouchstart' in window) ||
               (window.innerWidth <= 768);
    }
    
    setupTouchControls() {
        // Mobile direct canvas touch controls
        if (this.isMobile) {
            this.setupCanvasTouchControls();
        }
        
        // Desktop and mobile swipe gesture support
        this.setupSwipeControls();
    }
    
    setupCanvasTouchControls() {
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            
            // Get touch position relative to canvas
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const touchX = touch.clientX - rect.left;
            const touchY = touch.clientY - rect.top;
            
            // Convert to game coordinates
            const gameX = (touchX / rect.width) * CANVAS_WIDTH;
            const gameY = (touchY / rect.height) * CANVAS_HEIGHT;
            
            this.handleCanvasTouch(gameX, gameY);
        });
        
        // Prevent default touch behaviors on canvas
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    }
    
    handleCanvasTouch(touchX, touchY) {
        if (this.gameState !== 'playing' || this.gameOver) return;
        
        // Get snake head position in pixels
        const head = this.snake[0];
        const headX = (head.x + 0.5) * GRID_SIZE;
        const headY = (head.y + 0.5) * GRID_SIZE;
        
        // Calculate direction based on touch position relative to snake head
        const deltaX = touchX - headX;
        const deltaY = touchY - headY;
        
        const currentDir = this.direction;
        
        // Determine primary direction (horizontal or vertical)
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal movement
            if (deltaX > 0 && currentDir !== DIRECTIONS.LEFT) {
                this.direction = DIRECTIONS.RIGHT;
            } else if (deltaX < 0 && currentDir !== DIRECTIONS.RIGHT) {
                this.direction = DIRECTIONS.LEFT;
            }
        } else {
            // Vertical movement
            if (deltaY > 0 && currentDir !== DIRECTIONS.UP) {
                this.direction = DIRECTIONS.DOWN;
            } else if (deltaY < 0 && currentDir !== DIRECTIONS.DOWN) {
                this.direction = DIRECTIONS.UP;
            }
        }
    }
    
    handleTouchDirection(direction) {
        if (this.gameState !== 'playing' || this.gameOver) return;
        
        const currentDir = this.direction;
        
        switch(direction) {
            case 'up':
                if (currentDir !== DIRECTIONS.DOWN) {
                    this.direction = DIRECTIONS.UP;
                }
                break;
            case 'down':
                if (currentDir !== DIRECTIONS.UP) {
                    this.direction = DIRECTIONS.DOWN;
                }
                break;
            case 'left':
                if (currentDir !== DIRECTIONS.RIGHT) {
                    this.direction = DIRECTIONS.LEFT;
                }
                break;
            case 'right':
                if (currentDir !== DIRECTIONS.LEFT) {
                    this.direction = DIRECTIONS.RIGHT;
                }
                break;
        }
    }
    
    setupSwipeControls() {
        let startX, startY;
        
        this.canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Minimum swipe distance
            const minSwipeDistance = 30;
            
            if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    // Horizontal swipe
                    this.handleTouchDirection(deltaX > 0 ? 'right' : 'left');
                } else {
                    // Vertical swipe
                    this.handleTouchDirection(deltaY > 0 ? 'down' : 'up');
                }
            }
            
            startX = null;
            startY = null;
        });
    }
    
    showStartScreen() {
        this.gameState = 'start';
        this.startScreenElement.style.display = 'block';
        this.gameOverElement.style.display = 'none';
    }
    
    startGame() {
        this.gameState = 'playing';
        this.gameStarted = true;
        this.startScreenElement.style.display = 'none';
        this.gameOverElement.style.display = 'none';
        this.resetGame();
        this.gameLoop();
    }
    
    resetGame() {
        // Stop any existing game loop
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Snake starts in center
        this.snake = [{ x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2) }];
        this.direction = DIRECTIONS.RIGHT;
        this.score = 0;
        this.gameOver = false;
        this.generateFood();
        this.updateScore();
        
        if (this.gameStarted) {
            this.gameState = 'playing';
            this.gameOverElement.style.display = 'none';
        }
    }
    
    generateFood() {
        do {
            this.foodPos = {
                x: Math.floor(Math.random() * GRID_WIDTH),
                y: Math.floor(Math.random() * GRID_HEIGHT)
            };
        } while (this.snake.some(segment => segment.x === this.foodPos.x && segment.y === this.foodPos.y));
        
        const foodTypeKeys = Object.keys(FOOD_TYPES);
        this.foodType = foodTypeKeys[Math.floor(Math.random() * foodTypeKeys.length)];
    }
    
    setupEventListeners() {
        // Mouse controls for desktop
        if (!this.isMobile) {
            this.canvas.addEventListener('mousemove', (e) => {
                if (this.gameState === 'playing' && !this.gameOver) {
                    this.updateDirectionFromMouse(e);
                }
            });
        }
        
        // Keyboard controls for both desktop and mobile
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing' && !this.gameOver) {
                this.updateDirectionFromKeyboard(e);
            } else if (this.gameState === 'gameOver') {
                if (e.key.toLowerCase() === 'c') {
                    this.resetGame();
                    this.gameLoop();
                }
            } else if (this.gameState === 'start') {
                if (e.key === ' ' || e.key === 'Enter') {
                    this.startGame();
                }
            }
        });
        
        // Prevent zoom on double tap for mobile
        document.addEventListener('touchend', (e) => {
            if (e.target.closest('.game-container')) {
                e.preventDefault();
            }
        });
    }
    
    updateDirectionFromMouse(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Store mouse position for indicator
        this.lastMouseX = mouseX;
        this.lastMouseY = mouseY;
        
        const mouseGridX = Math.floor(mouseX / GRID_SIZE);
        const mouseGridY = Math.floor(mouseY / GRID_SIZE);
        
        const head = this.snake[0];
        const dx = mouseGridX - head.x;
        const dy = mouseGridY - head.y;
        
        // Prevent immediate reverse direction (anti-glitch)
        const currentDir = this.direction;
        
        // Only change direction if mouse is far enough and not reversing
        // Added minimum distance requirement to prevent erratic movement
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            if (Math.abs(dx) > Math.abs(dy)) {
                // Horizontal movement is larger
                if (dx > 0 && currentDir !== DIRECTIONS.LEFT) {
                    this.direction = DIRECTIONS.RIGHT;
                } else if (dx < 0 && currentDir !== DIRECTIONS.RIGHT) {
                    this.direction = DIRECTIONS.LEFT;
                }
            } else {
                // Vertical movement is larger
                if (dy > 0 && currentDir !== DIRECTIONS.UP) {
                    this.direction = DIRECTIONS.DOWN;
                } else if (dy < 0 && currentDir !== DIRECTIONS.DOWN) {
                    this.direction = DIRECTIONS.UP;
                }
            }
        }
    }
    
    updateDirectionFromKeyboard(e) {
        const currentDir = this.direction;
        
        // Prevent reverse direction to avoid instant death
        switch(e.key) {
            case 'ArrowUp':
                if (currentDir !== DIRECTIONS.DOWN) {
                    this.direction = DIRECTIONS.UP;
                }
                break;
            case 'ArrowDown':
                if (currentDir !== DIRECTIONS.UP) {
                    this.direction = DIRECTIONS.DOWN;
                }
                break;
            case 'ArrowLeft':
                if (currentDir !== DIRECTIONS.RIGHT) {
                    this.direction = DIRECTIONS.LEFT;
                }
                break;
            case 'ArrowRight':
                if (currentDir !== DIRECTIONS.LEFT) {
                    this.direction = DIRECTIONS.RIGHT;
                }
                break;
        }
        
        // Prevent default behavior (scrolling)
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
    }
    
    updateSnake() {
        if (this.gameState !== 'playing' || this.gameOver) return;
        
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // Check wall collision with proper bounds
        if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
            this.endGame();
            return;
        }
        
        // Check self collision - only check existing body segments
        for (let i = 0; i < this.snake.length; i++) {
            const segment = this.snake[i];
            if (segment.x === head.x && segment.y === head.y) {
                this.endGame();
                return;
            }
        }
        
        // Add new head
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.foodPos.x && head.y === this.foodPos.y) {
            this.score += 10;
            this.updateScore();
            this.generateFood();
        } else {
            // Remove tail only if no food was eaten
            this.snake.pop();
        }
    }
    
    drawGradientBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        gradient.addColorStop(0, COLORS.PURPLE_DARK);
        gradient.addColorStop(1, COLORS.PINK_LIGHT);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    
    drawSnake() {
        this.snake.forEach((segment, index) => {
            const x = segment.x * GRID_SIZE;
            const y = segment.y * GRID_SIZE;
            
            if (index === 0) {
                // Draw head
                this.drawSnakeHead(x, y);
            } else {
                // Draw body segment
                this.drawSnakeBody(x, y, index);
            }
        });
    }
    
    drawSnakeHead(x, y) {
        // Head gradient
        const gradient = this.ctx.createRadialGradient(
            x + GRID_SIZE/2, y + GRID_SIZE/2, 0,
            x + GRID_SIZE/2, y + GRID_SIZE/2, GRID_SIZE/2
        );
        gradient.addColorStop(0, this.lightenColor(COLORS.SNAKE_HEAD, 30));
        gradient.addColorStop(1, COLORS.SNAKE_HEAD);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.ellipse(x + GRID_SIZE/2, y + GRID_SIZE/2, GRID_SIZE/2 - 1, GRID_SIZE/2 - 1, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Draw eyes
        this.drawEyes(x, y);
        
        // Draw nostrils
        this.drawNostrils(x, y);
    }
    
    drawEyes(x, y) {
        const eyeSize = 4;
        const pupilSize = 2;
        let eye1X, eye1Y, eye2X, eye2Y;
        
        if (this.direction === DIRECTIONS.RIGHT) {
            eye1X = x + 13; eye1Y = y + 6;
            eye2X = x + 13; eye2Y = y + 14;
        } else if (this.direction === DIRECTIONS.LEFT) {
            eye1X = x + 4; eye1Y = y + 6;
            eye2X = x + 4; eye2Y = y + 14;
        } else if (this.direction === DIRECTIONS.UP) {
            eye1X = x + 6; eye1Y = y + 4;
            eye2X = x + 14; eye2Y = y + 4;
        } else {
            eye1X = x + 6; eye1Y = y + 13;
            eye2X = x + 14; eye2Y = y + 13;
        }
        
        // Draw white eyes
        this.ctx.fillStyle = COLORS.WHITE;
        this.ctx.beginPath();
        this.ctx.arc(eye1X, eye1Y, eyeSize, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(eye2X, eye2Y, eyeSize, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Draw pupils
        this.ctx.fillStyle = COLORS.BLACK;
        this.ctx.beginPath();
        this.ctx.arc(eye1X, eye1Y, pupilSize, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(eye2X, eye2Y, pupilSize, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    drawNostrils(x, y) {
        this.ctx.fillStyle = COLORS.BLACK;
        let nostril1X, nostril1Y, nostril2X, nostril2Y;
        
        if (this.direction === DIRECTIONS.RIGHT) {
            nostril1X = x + 17; nostril1Y = y + 8;
            nostril2X = x + 17; nostril2Y = y + 12;
        } else if (this.direction === DIRECTIONS.LEFT) {
            nostril1X = x + 2; nostril1Y = y + 8;
            nostril2X = x + 2; nostril2Y = y + 12;
        } else if (this.direction === DIRECTIONS.UP) {
            nostril1X = x + 8; nostril1Y = y + 2;
            nostril2X = x + 12; nostril2Y = y + 2;
        } else {
            nostril1X = x + 8; nostril1Y = y + 17;
            nostril2X = x + 12; nostril2Y = y + 17;
        }
        
        this.ctx.beginPath();
        this.ctx.arc(nostril1X, nostril1Y, 1, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(nostril2X, nostril2Y, 1, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    drawSnakeBody(x, y, index) {
        // Body gradient
        const gradient = this.ctx.createRadialGradient(
            x + GRID_SIZE/2, y + GRID_SIZE/2, 0,
            x + GRID_SIZE/2, y + GRID_SIZE/2, GRID_SIZE/2
        );
        gradient.addColorStop(0, this.lightenColor(COLORS.SNAKE_BODY, 20));
        gradient.addColorStop(1, COLORS.SNAKE_BODY);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.ellipse(x + GRID_SIZE/2, y + GRID_SIZE/2, GRID_SIZE/2 - 1, GRID_SIZE/2 - 1, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Belly stripe
        this.ctx.fillStyle = COLORS.SNAKE_BELLY;
        this.ctx.beginPath();
        this.ctx.ellipse(x + GRID_SIZE/2, y + GRID_SIZE/2, GRID_SIZE/3, GRID_SIZE/2 - 2, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Scale pattern
        this.ctx.fillStyle = COLORS.SNAKE_PATTERN;
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 3; col++) {
                const scaleX = x + 3 + col * 5 + (row % 2) * 2;
                const scaleY = y + 3 + row * 7;
                if ((index + row + col) % 2 === 0) {
                    this.ctx.beginPath();
                    this.ctx.ellipse(scaleX + 1.5, scaleY + 1.5, 1.5, 1.5, 0, 0, 2 * Math.PI);
                    this.ctx.fill();
                }
            }
        }
    }
    
    drawFood() {
        const x = this.foodPos.x * GRID_SIZE;
        const y = this.foodPos.y * GRID_SIZE;
        const food = FOOD_TYPES[this.foodType];
        
        switch (this.foodType) {
            case 'apple':
                this.drawApple(x, y, food);
                break;
            case 'carrot':
                this.drawCarrot(x, y, food);
                break;
            case 'grapes':
                this.drawGrapes(x, y, food);
                break;
            case 'banana':
                this.drawBanana(x, y, food);
                break;
            case 'cherry':
                this.drawCherry(x, y, food);
                break;
            case 'orange':
                this.drawOrange(x, y, food);
                break;
        }
    }
    
    drawApple(x, y, food) {
        // Apple body
        this.ctx.fillStyle = food.color;
        this.ctx.beginPath();
        this.ctx.arc(x + GRID_SIZE/2, y + GRID_SIZE/2 + 2, GRID_SIZE/2 - 1, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Highlight
        this.ctx.fillStyle = food.highlight;
        this.ctx.beginPath();
        this.ctx.arc(x + GRID_SIZE/2 - 2, y + GRID_SIZE/2, GRID_SIZE/3, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Stem
        this.ctx.fillStyle = food.stem;
        this.ctx.fillRect(x + GRID_SIZE/2 - 1, y + 1, 2, 5);
        
        // Leaf
        this.ctx.fillStyle = food.leaf;
        this.ctx.beginPath();
        this.ctx.ellipse(x + GRID_SIZE/2 + 3, y + 3, 3, 2, 0, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    drawCarrot(x, y, food) {
        // Carrot body
        this.ctx.fillStyle = food.color;
        this.ctx.beginPath();
        this.ctx.moveTo(x + GRID_SIZE/2, y + GRID_SIZE - 2);
        this.ctx.lineTo(x + 3, y + 6);
        this.ctx.lineTo(x + GRID_SIZE - 3, y + 6);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Carrot lines
        this.ctx.strokeStyle = food.stem;
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + 5, y + 8 + i * 3);
            this.ctx.lineTo(x + GRID_SIZE - 5, y + 8 + i * 3);
            this.ctx.stroke();
        }
        
        // Green top
        this.ctx.fillStyle = food.leaf;
        this.ctx.fillRect(x + GRID_SIZE/2 - 3, y + 1, 6, 8);
    }
    
    drawGrapes(x, y, food) {
        const grapeSize = 3;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 2 + row % 2; col++) {
                const grapeX = x + 4 + col * 4 + (row % 2) * 2;
                const grapeY = y + 4 + row * 4;
                
                this.ctx.fillStyle = food.color;
                this.ctx.beginPath();
                this.ctx.arc(grapeX, grapeY, grapeSize, 0, 2 * Math.PI);
                this.ctx.fill();
                
                this.ctx.fillStyle = food.highlight;
                this.ctx.beginPath();
                this.ctx.arc(grapeX - 1, grapeY - 1, grapeSize - 1, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
        
        // Stem
        this.ctx.fillStyle = food.stem;
        this.ctx.fillRect(x + GRID_SIZE/2 - 1, y + 1, 2, 4);
    }
    
    drawBanana(x, y, food) {
        // Banana body
        this.ctx.fillStyle = food.color;
        this.ctx.beginPath();
        this.ctx.ellipse(x + GRID_SIZE/2, y + GRID_SIZE/2, GRID_SIZE/2 - 2, GRID_SIZE/3, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Highlight
        this.ctx.fillStyle = food.highlight;
        this.ctx.beginPath();
        this.ctx.ellipse(x + GRID_SIZE/2, y + GRID_SIZE/2, GRID_SIZE/3, GRID_SIZE/4, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Tips
        this.ctx.fillStyle = food.stem;
        this.ctx.beginPath();
        this.ctx.arc(x + 3, y + GRID_SIZE/2, 2, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x + GRID_SIZE - 3, y + GRID_SIZE/2, 2, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    drawCherry(x, y, food) {
        // Two cherries
        this.ctx.fillStyle = food.color;
        this.ctx.beginPath();
        this.ctx.arc(x + 6, y + 10, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x + 12, y + 12, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Highlights
        this.ctx.fillStyle = food.highlight;
        this.ctx.beginPath();
        this.ctx.arc(x + 5, y + 9, 2, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x + 11, y + 11, 2, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Stems
        this.ctx.strokeStyle = food.stem;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 6, y + 6);
        this.ctx.lineTo(x + 6, y + 3);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x + 12, y + 8);
        this.ctx.lineTo(x + 10, y + 3);
        this.ctx.stroke();
        
        // Leaf
        this.ctx.fillStyle = food.leaf;
        this.ctx.beginPath();
        this.ctx.ellipse(x + 9, y + 3, 2, 1.5, 0, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    drawMouseIndicator() {
        if (this.gameState === 'playing') {
            // Get current mouse position relative to canvas
            const rect = this.canvas.getBoundingClientRect();
            // Only draw if mouse is over canvas
            if (this.lastMouseX && this.lastMouseY) {
                const x = this.lastMouseX;
                const y = this.lastMouseY;
                
                // Draw subtle mouse indicator
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 8, 0, 2 * Math.PI);
                this.ctx.stroke();
                
                // Draw crosshair
                this.ctx.beginPath();
                this.ctx.moveTo(x - 6, y);
                this.ctx.lineTo(x + 6, y);
                this.ctx.moveTo(x, y - 6);
                this.ctx.lineTo(x, y + 6);
                this.ctx.stroke();
            }
        }
    }
    
    drawOrange(x, y, food) {
        // Orange body
        this.ctx.fillStyle = food.color;
        this.ctx.beginPath();
        this.ctx.arc(x + GRID_SIZE/2, y + GRID_SIZE/2, GRID_SIZE/2 - 1, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Highlight
        this.ctx.fillStyle = food.highlight;
        this.ctx.beginPath();
        this.ctx.arc(x + GRID_SIZE/2 - 2, y + GRID_SIZE/2 - 2, GRID_SIZE/3, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Orange texture (dimples)
        this.ctx.fillStyle = '#c87800';
        for (let i = 0; i < 8; i++) {
            const angle = i * 45 * Math.PI / 180;
            const dotX = x + GRID_SIZE/2 + 4 * Math.cos(angle);
            const dotY = y + GRID_SIZE/2 + 4 * Math.sin(angle);
            this.ctx.beginPath();
            this.ctx.arc(dotX, dotY, 1, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Stem
        this.ctx.fillStyle = food.stem;
        this.ctx.beginPath();
        this.ctx.arc(x + GRID_SIZE/2, y + 2, 2, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    endGame() {
        this.gameOver = true;
        this.gameState = 'gameOver';
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.style.display = 'block';
        
        // Stop the game loop
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    lightenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    draw() {
        this.drawGradientBackground();
        this.drawSnake();
        this.drawFood();
        this.drawMouseIndicator();
    }
    
    gameLoop() {
        if (this.gameState === 'playing' && !this.gameOver) {
            this.updateSnake();
        }
        
        this.draw();
        
        // Continue game loop only if game is still active
        if (this.gameState === 'playing' && !this.gameOver) {
            setTimeout(() => {
                this.animationId = requestAnimationFrame(() => this.gameLoop());
            }, 150); // Slower speed: 6.67 FPS (was 100ms/10 FPS)
        }
    }
}

// Global variables and functions for button controls
let gameInstance = null;

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    gameInstance = new SnakeGame();
});

// Global functions for buttons
function startGame() {
    if (gameInstance) {
        gameInstance.startGame();
    }
}

// Enhanced button functions with touch support
function handleStartButton(event) {
    event.preventDefault();
    startGame();
}

function handleResetButton(event) {
    event.preventDefault();
    resetGame();
}

function handleQuitButton(event) {
    event.preventDefault();
    quitGame();
}

function resetGame() {
    if (gameInstance) {
        gameInstance.resetGame();
        gameInstance.gameLoop();
    }
}

function quitGame() {
    if (gameInstance) {
        gameInstance.showStartScreen();
        // Stop any running game loop
        if (gameInstance.animationId) {
            cancelAnimationFrame(gameInstance.animationId);
            gameInstance.animationId = null;
        }
    }
}