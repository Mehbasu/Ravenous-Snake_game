# 🐍 Ravenous Snake - Realistic Snake Game

A modern, web-based implementation of the classic Snake game with realistic graphics, dual control methods, and multiple food types.

## 🎮 Game Overview

Ravenous Snake is an enhanced version of the classic Snake game featuring:
- **Realistic snake graphics** with detailed segmentation, scales, and animated features
- **Dual control methods** supporting both mouse and keyboard input
- **Multiple food types** with unique appearances and behaviors
- **Beautiful UI** with purple-pink gradient backgrounds and smooth animations
- **Cross-platform compatibility** running in any modern web browser

## 🚀 Quick Start

### Prerequisites
- Python 3.x installed on your system
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Running the Game
1. **Clone or download** the game files to your computer
2. **Open terminal/command prompt** and navigate to the game directory:
   ```bash
   cd "path/to/snake game"
   ```
3. **Start the local web server**:
   ```bash
   python -m http.server 8001
   ```
4. **Open your browser** and go to: `http://localhost:8001`
5. **Click "🎮 Start Game"** to begin playing!

## 🎯 How to Play

### Objective
Control your ravenous snake to devour as many fruits and vegetables as possible while avoiding walls and your own body. Each food item satisfies your snake's hunger, making it grow longer and increasing your score. The more your snake eats, the more ravenous it becomes!

### Controls
**Dual Control System** - Choose your preferred method:

#### 🖱️ Mouse Controls
- **Move your mouse** around the game canvas
- The snake will automatically move toward your mouse cursor
- Smooth, intuitive movement perfect for beginners

#### ⌨️ Keyboard Controls  
- **Arrow Keys**: Control snake direction
  - `↑` Up Arrow: Move up
  - `↓` Down Arrow: Move down
  - `←` Left Arrow: Move left  
  - `→` Right Arrow: Move right
- **Space/Enter**: Start game from welcome screen
- **C**: Play again after game over

### Game States
1. **Start Screen**: Welcome screen with instructions and start button
2. **Playing**: Active gameplay with snake movement and food collection
3. **Game Over**: End screen showing final score with restart options

## 🍎 Food System

### Food Types (6 Varieties)
Each food type has unique visual characteristics and the same point value:

1. **🍎 Apple** - Classic red apple with stem and leaf
2. **🥕 Carrot** - Orange triangular carrot with green top
3. **🍇 Grapes** - Purple cluster of grapes
4. **🍌 Banana** - Yellow curved banana with texture lines
5. **🍒 Cherry** - Pair of red cherries with stems
6. **🍊 Orange** - Textured orange with dimpled surface

### Food Mechanics
- **Random Generation**: Food appears at random grid positions
- **Collision Detection**: Food is consumed when snake head touches it
- **Growth**: Snake grows by one segment per food item
- **Score**: +10 points per food item consumed
- **Spawn Protection**: Food never spawns on the snake's body

## 🐍 Snake Mechanics

### Snake Components

#### Head Features
- **Realistic Shape**: Elliptical head with 3D gradient shading
- **Animated Eyes**: Eyes with pupils that face the current movement direction
- **Nostrils**: Small dots positioned based on movement direction
- **Color**: Forest green (#228b22) with highlighting

#### Body Features
- **Segmented Design**: Each segment is individually rendered
- **Scale Patterns**: Detailed scale textures with alternating colors
- **Belly Stripe**: Lighter ventral scales (belly area)
- **3D Shading**: Cylindrical gradient effects for depth
- **Segment Separation**: Subtle lines between segments for realism

### Movement System
- **Grid-Based**: Snake moves on a 20x20 pixel grid system
- **Direction Logic**: Smart direction calculation prevents instant reversal
- **Speed**: 10 FPS (moves every 100ms) for classic Snake feel
- **Anti-Glitch**: Built-in protection against rapid direction changes

## 🎨 Visual Design

### Background
- **Gradient Design**: Smooth purple-to-pink gradient (`#4b0082` to `#ffb6c1`)
- **Professional Styling**: Glassmorphism effects with transparent overlays

### UI Elements
- **Modern Typography**: Clean Arial font with text shadows
- **Responsive Design**: Adapts to different screen sizes
- **Smooth Animations**: CSS transitions for hover effects
- **Color Scheme**: Purple/pink theme with white accents

### Canvas Rendering
- **600x400 Resolution**: Optimal size for gameplay
- **Real-time Rendering**: 60 FPS drawing with 10 FPS game logic
- **Anti-aliasing**: Smooth curves and shapes
- **Layered Drawing**: Background → Snake → Food → UI overlays

## 🔧 Technical Architecture

### File Structure
```
snake game/
├── index.html          # Main HTML page with game UI
├── snake-game.js       # Complete game logic and rendering
├── snake_game.py       # Original Python/Pygame version
└── README.md           # This documentation file
```

### Core Classes and Functions

#### `SnakeGame` Class
Main game class handling all game logic:

```javascript
class SnakeGame {
    constructor()           // Initialize game components
    resetGame()            // Reset to initial state
    startGame()            // Begin gameplay
    showStartScreen()      // Display welcome screen
    setupEventListeners()  // Configure input handlers
    updateSnake()          // Move snake and check collisions
    generateFood()         // Create new food at random position
    endGame()             // Handle game over state
    gameLoop()            // Main game loop (10 FPS)
    draw()                // Render all visual elements
}
```

#### Key Methods

**Movement and Input**:
- `updateDirectionFromMouse(e)`: Convert mouse position to snake direction
- `updateDirectionFromKeyboard(e)`: Handle arrow key input
- `updateSnake()`: Move snake head, check collisions, handle growth

**Rendering**:
- `drawGradientBackground()`: Create purple-pink gradient
- `drawSnake()`: Render realistic snake with all details
- `drawFood()`: Render specific food type with unique graphics
- `drawMouseIndicator()`: Show mouse cursor position

**Game Logic**:
- `generateFood()`: Random food placement with collision avoidance
- `endGame()`: Score tracking and game over handling
- `resetGame()`: Clean state reset for new games

### Game Constants
```javascript
CANVAS_WIDTH = 600      // Game canvas width
CANVAS_HEIGHT = 400     // Game canvas height  
GRID_SIZE = 20          // Size of each grid cell
GRID_WIDTH = 30         // Number of horizontal grid cells
GRID_HEIGHT = 20        // Number of vertical grid cells
```

### Color Definitions
```javascript
SNAKE_HEAD = '#228b22'     // Forest green for head
SNAKE_BODY = '#32cd32'     // Lime green for body
SNAKE_BELLY = '#90ee90'    // Light green for belly
SNAKE_PATTERN = '#006400'  // Dark green for scales
PURPLE_DARK = '#4b0082'    // Background gradient start
PINK_LIGHT = '#ffb6c1'     // Background gradient end
```

## 🛡️ Collision Detection

### Wall Collision
```javascript
if (head.x < 0 || head.x >= GRID_WIDTH || 
    head.y < 0 || head.y >= GRID_HEIGHT) {
    this.endGame();
}
```

### Self Collision
```javascript
if (this.snake.some(segment => 
    segment.x === head.x && segment.y === head.y)) {
    this.endGame();
}
```

### Food Collision
```javascript
if (head.x === this.foodPos.x && head.y === this.foodPos.y) {
    this.score += 10;
    this.generateFood();
} else {
    this.snake.pop(); // Remove tail if no food eaten
}
```

## 🎯 Scoring System

- **Base Points**: 10 points per food item
- **No Penalties**: No point deductions for any actions
- **High Score**: Displayed during gameplay and at game over
- **Persistent Display**: Score updates in real-time

## 🔄 Game States

### State Management
```javascript
gameState: 'start' | 'playing' | 'gameOver'
```

### State Transitions
1. **start** → **playing**: Click Start button or press Space/Enter
2. **playing** → **gameOver**: Collision with wall or self
3. **gameOver** → **playing**: Click Play Again or press C
4. **gameOver** → **start**: Click Main Menu button

## 🌐 Browser Compatibility

### Supported Browsers
- ✅ Chrome 60+
- ✅ Firefox 55+  
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Required Features
- HTML5 Canvas support
- ES6 JavaScript features
- CSS3 gradients and transforms
- Mouse and keyboard event handling

## 📱 Responsive Design

### Screen Adaptations
- **Desktop**: Full 600x400 canvas with optimal controls
- **Tablet**: Scaled canvas maintaining aspect ratio
- **Mobile**: Adapted canvas size (90vw x 60vw) with touch support

### CSS Media Queries
```css
@media (max-width: 768px) {
    canvas {
        width: 90vw;
        height: 60vw;
    }
}
```

## 🚀 Performance Optimization

### Rendering Efficiency
- **Minimal Redraws**: Only redraws when game state changes
- **Efficient Canvas Operations**: Batch operations and minimize context switches
- **Smart Animation**: Uses `requestAnimationFrame` for smooth rendering

### Memory Management
- **Object Pooling**: Reuses game objects where possible
- **Event Cleanup**: Proper removal of event listeners
- **State Management**: Clean state transitions prevent memory leaks

## 🐛 Debugging and Troubleshooting

### Common Issues

**Game Won't Start**:
- Check browser console for JavaScript errors
- Ensure local server is running on correct port
- Verify all files are in the same directory

**Controls Not Working**:
- Click on the game canvas to focus
- Check if browser is blocking JavaScript
- Try refreshing the page

**Performance Issues**:
- Close other browser tabs
- Update to latest browser version
- Check system resources

### Debug Mode
Add `console.log` statements to track game state:
```javascript
console.log('Snake position:', this.snake[0]);
console.log('Food position:', this.foodPos);
console.log('Current score:', this.score);
```

## 🔮 Future Enhancements

### Planned Features
- **Sound Effects**: Audio feedback for eating, movement, game over
- **Difficulty Levels**: Variable speed settings
- **Power-ups**: Special food items with temporary abilities
- **Leaderboard**: Local storage for high scores
- **Themes**: Multiple visual themes and color schemes
- **Multiplayer**: Local multiplayer support

### Technical Improvements
- **Touch Controls**: Better mobile gesture support
- **WebGL Rendering**: Hardware-accelerated graphics
- **Progressive Web App**: Offline capability and app-like experience
- **Analytics**: Player behavior tracking (privacy-respecting)

## 📝 Version History

### v1.0.0 (Current)
- ✅ Complete Snake game implementation
- ✅ Dual control system (mouse + keyboard)
- ✅ Six realistic food types
- ✅ Professional UI design
- ✅ Cross-platform compatibility
- ✅ Comprehensive documentation

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Make your changes
3. Test across different browsers
4. Submit a pull request

### Code Style Guidelines
- Use ES6+ JavaScript features
- Follow consistent indentation (4 spaces)
- Comment complex logic
- Maintain performance standards

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Credits

**Game Design**: Classic Snake game concept
**Implementation**: Modern web technologies (HTML5, CSS3, JavaScript)
**Graphics**: Custom-drawn food items and snake graphics
**Inspiration**: Retro gaming nostalgia with modern polish

---

**Enjoy playing Ravenous Snake! 🐍🎮**

For support or questions, please check the troubleshooting section or open an issue in the project repository.