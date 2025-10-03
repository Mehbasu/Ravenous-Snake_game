import pygame
import random
import sys

# Initialize pygame
pygame.init()

# Game constants
WINDOW_WIDTH = 600
WINDOW_HEIGHT = 400
GRID_SIZE = 20
GRID_WIDTH = WINDOW_WIDTH // GRID_SIZE
GRID_HEIGHT = WINDOW_HEIGHT // GRID_SIZE

# Colors (RGB)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)
DARK_GREEN = (0, 155, 0)

# Realistic Snake Colors
SNAKE_HEAD = (34, 139, 34)      # Forest Green
SNAKE_BODY = (50, 205, 50)      # Lime Green
SNAKE_BELLY = (144, 238, 144)   # Light Green
SNAKE_PATTERN = (0, 100, 0)     # Dark Green patterns

# Purple-Pink Background Colors
PURPLE_DARK = (75, 0, 130)      # Indigo
PURPLE_LIGHT = (138, 43, 226)   # Blue Violet
PINK_LIGHT = (255, 182, 193)    # Light Pink
PINK_DARK = (199, 21, 133)      # Medium Violet Red

# Food Colors and Types
FOOD_TYPES = {
    'apple': {'color': (255, 69, 0), 'highlight': (255, 140, 100), 'stem': (139, 69, 19), 'leaf': (34, 139, 34)},
    'carrot': {'color': (255, 140, 0), 'highlight': (255, 200, 100), 'stem': (34, 139, 34), 'leaf': (50, 205, 50)},
    'grapes': {'color': (128, 0, 128), 'highlight': (200, 100, 200), 'stem': (139, 69, 19), 'leaf': (34, 139, 34)},
    'banana': {'color': (255, 255, 0), 'highlight': (255, 255, 150), 'stem': (139, 69, 19), 'leaf': (34, 139, 34)},
    'cherry': {'color': (220, 20, 60), 'highlight': (255, 100, 150), 'stem': (139, 69, 19), 'leaf': (34, 139, 34)},
    'orange': {'color': (255, 165, 0), 'highlight': (255, 200, 100), 'stem': (139, 69, 19), 'leaf': (34, 139, 34)}
}

# Directions
UP = (0, -1)
DOWN = (0, 1)
LEFT = (-1, 0)
RIGHT = (1, 0)

class SnakeGame:
    def __init__(self):
        """Initialize the game"""
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption("Snake Game")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 36)
        self.reset_game()
    
    def reset_game(self):
        """Reset the game to initial state"""
        # Snake starts in the center of the screen
        self.snake = [(GRID_WIDTH // 2, GRID_HEIGHT // 2)]
        self.direction = RIGHT
        self.score = 0
        self.game_over = False
        self.generate_food()
    
    def generate_food(self):
        """Generate food at a random position not occupied by the snake"""
        while True:
            food_x = random.randint(0, GRID_WIDTH - 1)
            food_y = random.randint(0, GRID_HEIGHT - 1)
            self.food_pos = (food_x, food_y)
            
            # Make sure food doesn't spawn on the snake
            if self.food_pos not in self.snake:
                break
        
        # Randomly select food type
        self.food_type = random.choice(list(FOOD_TYPES.keys()))
    
    def handle_input(self):
        """Handle mouse and keyboard input"""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            
            elif event.type == pygame.KEYDOWN:
                if self.game_over:
                    # Handle game over screen input
                    if event.key == pygame.K_q:
                        return False
                    elif event.key == pygame.K_c:
                        self.reset_game()
        
        # Get mouse position and update snake direction
        if not self.game_over:
            self.update_direction_to_mouse()
        
        return True
    
    def update_direction_to_mouse(self):
        """Update snake direction to follow mouse pointer"""
        mouse_x, mouse_y = pygame.mouse.get_pos()
        
        # Convert mouse position to grid coordinates
        mouse_grid_x = mouse_x // GRID_SIZE
        mouse_grid_y = mouse_y // GRID_SIZE
        
        # Get snake head position
        head_x, head_y = self.snake[0]
        
        # Calculate direction to mouse
        dx = mouse_grid_x - head_x
        dy = mouse_grid_y - head_y
        
        # Determine primary direction (prioritize larger movement)
        if abs(dx) > abs(dy):
            # Horizontal movement is larger
            if dx > 0 and self.direction != LEFT:
                self.direction = RIGHT
            elif dx < 0 and self.direction != RIGHT:
                self.direction = LEFT
        else:
            # Vertical movement is larger (or equal)
            if dy > 0 and self.direction != UP:
                self.direction = DOWN
            elif dy < 0 and self.direction != DOWN:
                self.direction = UP
    
    def update_snake(self):
        """Update snake position and check for collisions"""
        if self.game_over:
            return
        
        # Get the head of the snake
        head_x, head_y = self.snake[0]
        
        # Calculate new head position
        new_head_x = head_x + self.direction[0]
        new_head_y = head_y + self.direction[1]
        new_head = (new_head_x, new_head_y)
        
        # Check wall collision
        if (new_head_x < 0 or new_head_x >= GRID_WIDTH or 
            new_head_y < 0 or new_head_y >= GRID_HEIGHT):
            self.game_over = True
            return
        
        # Check self collision
        if new_head in self.snake:
            self.game_over = True
            return
        
        # Add new head to snake
        self.snake.insert(0, new_head)
        
        # Check if snake ate food
        if new_head == self.food_pos:
            self.score += 10
            self.generate_food()
        else:
            # Remove tail if no food was eaten
            self.snake.pop()
    
    def draw_snake(self):
        """Draw a highly realistic snake with detailed segmentation"""
        for i, segment in enumerate(self.snake):
            x = segment[0] * GRID_SIZE
            y = segment[1] * GRID_SIZE
            
            if i == 0:  # Snake head
                # Main head shape (more pointed)
                head_rect = pygame.Rect(x, y, GRID_SIZE, GRID_SIZE)
                pygame.draw.ellipse(self.screen, SNAKE_HEAD, head_rect)
                
                # Head gradient for 3D effect
                for offset in range(3):
                    inner_color = (
                        min(255, SNAKE_HEAD[0] + offset * 20),
                        min(255, SNAKE_HEAD[1] + offset * 20),
                        min(255, SNAKE_HEAD[2] + offset * 15)
                    )
                    pygame.draw.ellipse(self.screen, inner_color, 
                                      (x + offset, y + offset, GRID_SIZE - offset*2, GRID_SIZE - offset*2))
                
                # Eyes with pupils that follow direction
                eye_size = 4
                pupil_size = 2
                if self.direction == RIGHT:
                    eye1_pos = (x + 13, y + 6)
                    eye2_pos = (x + 13, y + 14)
                elif self.direction == LEFT:
                    eye1_pos = (x + 4, y + 6)
                    eye2_pos = (x + 4, y + 14)
                elif self.direction == UP:
                    eye1_pos = (x + 6, y + 4)
                    eye2_pos = (x + 14, y + 4)
                else:  # DOWN
                    eye1_pos = (x + 6, y + 13)
                    eye2_pos = (x + 14, y + 13)
                
                # Draw eyes
                pygame.draw.circle(self.screen, WHITE, eye1_pos, eye_size)
                pygame.draw.circle(self.screen, WHITE, eye2_pos, eye_size)
                pygame.draw.circle(self.screen, BLACK, eye1_pos, pupil_size)
                pygame.draw.circle(self.screen, BLACK, eye2_pos, pupil_size)
                
                # Nostrils
                nostril_offset = 2 if self.direction in [UP, DOWN] else 2
                if self.direction == RIGHT:
                    pygame.draw.circle(self.screen, BLACK, (x + 17, y + 8), 1)
                    pygame.draw.circle(self.screen, BLACK, (x + 17, y + 12), 1)
                elif self.direction == LEFT:
                    pygame.draw.circle(self.screen, BLACK, (x + 2, y + 8), 1)
                    pygame.draw.circle(self.screen, BLACK, (x + 2, y + 12), 1)
                elif self.direction == UP:
                    pygame.draw.circle(self.screen, BLACK, (x + 8, y + 2), 1)
                    pygame.draw.circle(self.screen, BLACK, (x + 12, y + 2), 1)
                else:  # DOWN
                    pygame.draw.circle(self.screen, BLACK, (x + 8, y + 17), 1)
                    pygame.draw.circle(self.screen, BLACK, (x + 12, y + 17), 1)
                
            else:  # Snake body segments
                # Main body segment with realistic shape
                body_rect = pygame.Rect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2)
                pygame.draw.ellipse(self.screen, SNAKE_BODY, body_rect)
                
                # Body gradient for 3D cylindrical effect
                for offset in range(2):
                    inner_color = (
                        min(255, SNAKE_BODY[0] + offset * 15),
                        min(255, SNAKE_BODY[1] + offset * 15),
                        min(255, SNAKE_BODY[2] + offset * 10)
                    )
                    pygame.draw.ellipse(self.screen, inner_color, 
                                      (x + 1 + offset, y + 1 + offset, 
                                       GRID_SIZE - 2 - offset*2, GRID_SIZE - 2 - offset*2))
                
                # Belly stripe (ventral scales)
                belly_width = GRID_SIZE // 3
                belly_height = GRID_SIZE - 4
                belly_rect = pygame.Rect(x + (GRID_SIZE - belly_width) // 2, y + 2, belly_width, belly_height)
                pygame.draw.ellipse(self.screen, SNAKE_BELLY, belly_rect)
                
                # Individual scale pattern
                scale_size = 3
                # Create realistic scale pattern
                for row in range(2):
                    for col in range(3):
                        scale_x = x + 3 + col * 5 + (row % 2) * 2
                        scale_y = y + 3 + row * 7
                        if scale_x < x + GRID_SIZE - 3 and scale_y < y + GRID_SIZE - 3:
                            # Alternate scale colors for realism
                            scale_color = SNAKE_PATTERN if (i + row + col) % 2 == 0 else (
                                max(0, SNAKE_BODY[0] - 30),
                                max(0, SNAKE_BODY[1] - 30), 
                                max(0, SNAKE_BODY[2] - 20)
                            )
                            pygame.draw.ellipse(self.screen, scale_color, 
                                              (scale_x, scale_y, scale_size, scale_size))
                
                # Segment separation lines for realism
                if i < len(self.snake) - 1:
                    next_segment = self.snake[i + 1]
                    # Draw subtle separation between segments
                    sep_color = (max(0, SNAKE_BODY[0] - 40), max(0, SNAKE_BODY[1] - 40), max(0, SNAKE_BODY[2] - 30))
                    if next_segment[0] == segment[0]:  # Vertical movement
                        pygame.draw.line(self.screen, sep_color, 
                                       (x + 2, y + GRID_SIZE - 1), (x + GRID_SIZE - 2, y + GRID_SIZE - 1), 1)
                    else:  # Horizontal movement
                        pygame.draw.line(self.screen, sep_color, 
                                       (x + GRID_SIZE - 1, y + 2), (x + GRID_SIZE - 1, y + GRID_SIZE - 2), 1)
            
            # Subtle outer border for definition
            border_color = (max(0, SNAKE_PATTERN[0] - 20), max(0, SNAKE_PATTERN[1] - 20), max(0, SNAKE_PATTERN[2] - 10))
            pygame.draw.ellipse(self.screen, border_color, (x, y, GRID_SIZE, GRID_SIZE), 1)
    
    def draw_food(self):
        """Draw various realistic fruits and vegetables"""
        x = self.food_pos[0] * GRID_SIZE
        y = self.food_pos[1] * GRID_SIZE
        food_colors = FOOD_TYPES[self.food_type]
        
        if self.food_type == 'apple':
            # Apple shape
            pygame.draw.circle(self.screen, food_colors['color'], (x + GRID_SIZE//2, y + GRID_SIZE//2 + 2), GRID_SIZE//2 - 1)
            pygame.draw.circle(self.screen, food_colors['highlight'], (x + GRID_SIZE//2 - 2, y + GRID_SIZE//2), GRID_SIZE//3)
            # Stem and leaf
            pygame.draw.rect(self.screen, food_colors['stem'], (x + GRID_SIZE//2 - 1, y + 1, 2, 5))
            pygame.draw.ellipse(self.screen, food_colors['leaf'], (x + GRID_SIZE//2 + 1, y + 2, 6, 4))
            
        elif self.food_type == 'carrot':
            # Carrot shape (triangular)
            points = [(x + GRID_SIZE//2, y + GRID_SIZE - 2), (x + 3, y + 6), (x + GRID_SIZE - 3, y + 6)]
            pygame.draw.polygon(self.screen, food_colors['color'], points)
            # Carrot lines
            for i in range(3):
                pygame.draw.line(self.screen, food_colors['stem'], (x + 5, y + 8 + i*3), (x + GRID_SIZE - 5, y + 8 + i*3), 1)
            # Green top
            pygame.draw.rect(self.screen, food_colors['leaf'], (x + GRID_SIZE//2 - 3, y + 1, 6, 8))
            
        elif self.food_type == 'grapes':
            # Cluster of grapes
            grape_size = 3
            for row in range(3):
                for col in range(2 + row % 2):
                    grape_x = x + 4 + col * 4 + (row % 2) * 2
                    grape_y = y + 4 + row * 4
                    pygame.draw.circle(self.screen, food_colors['color'], (grape_x, grape_y), grape_size)
                    pygame.draw.circle(self.screen, food_colors['highlight'], (grape_x - 1, grape_y - 1), grape_size - 1)
            # Stem
            pygame.draw.rect(self.screen, food_colors['stem'], (x + GRID_SIZE//2 - 1, y + 1, 2, 4))
            
        elif self.food_type == 'banana':
            # Banana curve
            pygame.draw.ellipse(self.screen, food_colors['color'], (x + 2, y + 4, GRID_SIZE - 4, GRID_SIZE - 8))
            pygame.draw.ellipse(self.screen, food_colors['highlight'], (x + 3, y + 5, GRID_SIZE - 8, GRID_SIZE - 12))
            # Banana lines
            for i in range(2):
                pygame.draw.line(self.screen, food_colors['stem'], (x + 4, y + 6 + i*3), (x + GRID_SIZE - 4, y + 6 + i*3), 1)
            # Tips
            pygame.draw.circle(self.screen, food_colors['stem'], (x + 3, y + GRID_SIZE//2), 2)
            pygame.draw.circle(self.screen, food_colors['stem'], (x + GRID_SIZE - 3, y + GRID_SIZE//2), 2)
            
        elif self.food_type == 'cherry':
            # Two cherries
            pygame.draw.circle(self.screen, food_colors['color'], (x + 6, y + 10), 4)
            pygame.draw.circle(self.screen, food_colors['color'], (x + 12, y + 12), 4)
            pygame.draw.circle(self.screen, food_colors['highlight'], (x + 5, y + 9), 2)
            pygame.draw.circle(self.screen, food_colors['highlight'], (x + 11, y + 11), 2)
            # Stems
            pygame.draw.line(self.screen, food_colors['stem'], (x + 6, y + 6), (x + 6, y + 3), 2)
            pygame.draw.line(self.screen, food_colors['stem'], (x + 12, y + 8), (x + 10, y + 3), 2)
            # Leaf
            pygame.draw.ellipse(self.screen, food_colors['leaf'], (x + 8, y + 2, 4, 3))
            
        elif self.food_type == 'orange':
            # Orange shape with texture
            pygame.draw.circle(self.screen, food_colors['color'], (x + GRID_SIZE//2, y + GRID_SIZE//2), GRID_SIZE//2 - 1)
            pygame.draw.circle(self.screen, food_colors['highlight'], (x + GRID_SIZE//2 - 2, y + GRID_SIZE//2 - 2), GRID_SIZE//3)
            # Orange texture (dimples)
            for i in range(8):
                angle = i * 45
                dot_x = int(x + GRID_SIZE//2 + 4 * pygame.math.Vector2(1, 0).rotate(angle).x)
                dot_y = int(y + GRID_SIZE//2 + 4 * pygame.math.Vector2(1, 0).rotate(angle).y)
                pygame.draw.circle(self.screen, (200, 120, 0), (dot_x, dot_y), 1)
            # Small stem
            pygame.draw.circle(self.screen, food_colors['stem'], (x + GRID_SIZE//2, y + 2), 2)
    
    def draw_score(self):
        """Draw the score at the top of the screen"""
        score_text = self.font.render(f"Score: {self.score}", True, WHITE)
        self.screen.blit(score_text, (10, 10))
        
        # Draw instructions
        instruction_text = pygame.font.Font(None, 24).render("Move mouse to control snake", True, WHITE)
        self.screen.blit(instruction_text, (10, 40))
    
    def draw_game_over(self):
        """Draw the game over screen"""
        # Semi-transparent overlay
        overlay = pygame.Surface((WINDOW_WIDTH, WINDOW_HEIGHT))
        overlay.set_alpha(128)
        overlay.fill(BLACK)
        self.screen.blit(overlay, (0, 0))
        
        # Game over text
        game_over_text = self.font.render("Game Over!", True, WHITE)
        final_score_text = self.font.render(f"Final Score: {self.score}", True, WHITE)
        instruction_text = self.font.render("Press Q to Quit or C to Play Again", True, WHITE)
        
        # Center the text
        game_over_rect = game_over_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2 - 40))
        score_rect = final_score_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2))
        instruction_rect = instruction_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2 + 40))
        
        self.screen.blit(game_over_text, game_over_rect)
        self.screen.blit(final_score_text, score_rect)
        self.screen.blit(instruction_text, instruction_rect)
    
    def draw_gradient_background(self):
        """Draw a beautiful purple-pink gradient background"""
        for y in range(WINDOW_HEIGHT):
            # Calculate gradient ratio (0 to 1)
            ratio = y / WINDOW_HEIGHT
            
            # Interpolate between purple and pink
            r = int(PURPLE_DARK[0] + (PINK_LIGHT[0] - PURPLE_DARK[0]) * ratio)
            g = int(PURPLE_DARK[1] + (PINK_LIGHT[1] - PURPLE_DARK[1]) * ratio)
            b = int(PURPLE_DARK[2] + (PINK_LIGHT[2] - PURPLE_DARK[2]) * ratio)
            
            color = (r, g, b)
            pygame.draw.line(self.screen, color, (0, y), (WINDOW_WIDTH, y))
    
    def draw_mouse_indicator(self):
        """Draw a visual indicator at mouse position"""
        mouse_x, mouse_y = pygame.mouse.get_pos()
        
        # Draw a small circle at mouse position
        pygame.draw.circle(self.screen, WHITE, (mouse_x, mouse_y), 5, 2)
        
        # Draw crosshair
        pygame.draw.line(self.screen, WHITE, (mouse_x - 10, mouse_y), (mouse_x + 10, mouse_y), 1)
        pygame.draw.line(self.screen, WHITE, (mouse_x, mouse_y - 10), (mouse_x, mouse_y + 10), 1)
    
    def draw(self):
        """Draw all game elements"""
        # Draw beautiful gradient background
        self.draw_gradient_background()
        
        # Draw game elements
        self.draw_snake()
        self.draw_food()
        self.draw_score()
        
        # Draw mouse indicator if game is active
        if not self.game_over:
            self.draw_mouse_indicator()
        
        # Draw game over screen if needed
        if self.game_over:
            self.draw_game_over()
        
        # Update display
        pygame.display.flip()
    
    def run(self):
        """Main game loop"""
        running = True
        
        while running:
            # Handle input
            running = self.handle_input()
            
            # Update game state
            self.update_snake()
            
            # Draw everything
            self.draw()
            
            # Control game speed (10 FPS)
            self.clock.tick(10)
        
        # Quit pygame
        pygame.quit()
        sys.exit()

# Run the game
if __name__ == "__main__":
    game = SnakeGame()
    game.run()