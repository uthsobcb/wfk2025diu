
import pygame
import os
import random

# --- Constants ---
FPS = 60

# Player properties
PLAYER_WIDTH = 100
PLAYER_HEIGHT = 150
PLAYER_SPEED = 5
HEALTH = 100
ATTACK_DAMAGE = 10
ATTACK_COOLDOWN = 500  # milliseconds

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
YELLOW = (255, 255, 0)

# --- Asset Loading ---
def load_image(file_name, size=None):
    path = os.path.join("assets", file_name)
    try:
        image = pygame.image.load(path)
        if size:
            image = pygame.transform.scale(image, size)
        return image
    except pygame.error as e:
        print(f"Unable to load image: {path}")
        print(e)
        fallback = pygame.Surface(size if size else (50, 50))
        fallback.fill(RED)
        return fallback

def load_sound(file_name):
    path = os.path.join("assets", file_name)
    try:
        return pygame.mixer.Sound(path)
    except pygame.error as e:
        print(f"Unable to load sound: {path}")
        print(e)
        class DummySound:
            def play(self): pass
        return DummySound()

# --- Player Class ---
class Player(pygame.sprite.Sprite):
    def __init__(self, x, y, image, name, controls):
        super().__init__()
        self.name = name
        self.original_image = image
        self.image = self.original_image
        self.rect = self.image.get_rect(topleft=(x, y))
        self.health = HEALTH
        self.speed = PLAYER_SPEED
        self.controls = controls
        self.attack_cooldown = ATTACK_COOLDOWN
        self.last_attack_time = 0
        self.facing_left = False

    def move(self, keys, screen_width, screen_height):
        if keys[self.controls['left']] and self.rect.left > 0:
            self.rect.x -= self.speed
            self.facing_left = True
        if keys[self.controls['right']] and self.rect.right < screen_width:
            self.rect.x += self.speed
            self.facing_left = False
        if keys[self.controls['up']] and self.rect.top > 0:
            self.rect.y -= self.speed
        if keys[self.controls['down']] and self.rect.bottom < screen_height:
            self.rect.y += self.speed

    def attack(self, opponent, effects, hand_image):
        current_time = pygame.time.get_ticks()
        if current_time - self.last_attack_time > self.attack_cooldown:
            self.last_attack_time = current_time
            if self.rect.colliderect(opponent.rect):
                opponent.health -= ATTACK_DAMAGE
                slap_sound.play()
                effects.add(ImpactEffect(opponent.rect.center, hand_image))

    def draw(self, surface):
        self.image = pygame.transform.flip(self.original_image, self.facing_left, False)
        surface.blit(self.image, self.rect)

# --- AI Opponent Class ---
class ShekhuAunty(pygame.sprite.Sprite):
    def __init__(self, x, y, image, screen_width, screen_height):
        super().__init__()
        self.name = "Shekhu Aunty"
        self.original_image = image
        self.image = self.original_image
        self.rect = self.image.get_rect(topleft=(x, y))
        self.health = HEALTH
        self.screen_width = screen_width
        self.screen_height = screen_height
        self.target_x = random.randint(0, screen_width - self.rect.width)
        self.target_y = random.randint(0, screen_height - self.rect.height)
        self.speed = 2

    def update(self):
        dx = self.target_x - self.rect.x
        dy = self.target_y - self.rect.y
        dist = (dx**2 + dy**2)**0.5

        if dist > self.speed:
            self.rect.x += (dx / dist) * self.speed
            self.rect.y += (dy / dist) * self.speed
        else:
            self.target_x = random.randint(0, self.screen_width - self.rect.width)
            self.target_y = random.randint(0, self.screen_height - self.rect.height)

    def draw(self, surface):
        surface.blit(self.image, self.rect)

# --- Impact Effect Class ---
class ImpactEffect(pygame.sprite.Sprite):
    def __init__(self, pos, hand_image):
        super().__init__()
        self.hand_image = hand_image
        self.starburst_image = pygame.Surface((30, 30), pygame.SRCALPHA)
        pygame.draw.polygon(self.starburst_image, YELLOW, [(15, 0), (20, 10), (30, 15), (20, 20), (15, 30), (10, 20), (0, 15), (10, 10)])
        self.image = self.starburst_image
        self.rect = self.image.get_rect(center=pos)
        self.lifetime = 200
        self.spawn_time = pygame.time.get_ticks()
        self.show_hand = True

    def update(self):
        current_time = pygame.time.get_ticks()
        if current_time - self.spawn_time > self.lifetime:
            self.kill()
        elif current_time - self.spawn_time > 100:
            self.show_hand = False

    def draw(self, surface):
        surface.blit(self.image, self.rect)
        if self.show_hand:
            hand_rect = self.hand_image.get_rect(center=self.rect.center)
            surface.blit(self.hand_image, hand_rect)

# --- Health Bar ---
def draw_health_bar(surface, x, y, width, height, health, max_health):
    if health < 0:
        health = 0
    fill_width = (health / max_health) * width
    border_rect = pygame.Rect(x, y, width, height)
    fill_rect = pygame.Rect(x, y, fill_width, height)
    pygame.draw.rect(surface, RED, border_rect)
    pygame.draw.rect(surface, GREEN, fill_rect)
    pygame.draw.rect(surface, BLACK, border_rect, 2)

# --- Level Cleared Text ---
def display_level_cleared(surface, screen_width, screen_height, level):
    crowd_cheer_sound.play()
    font = pygame.font.Font(None, 74)
    text = font.render(f"Level {level} Cleared!", True, BLACK)
    text_rect = text.get_rect(center=(screen_width / 2, screen_height / 2))
    surface.blit(text, text_rect)
    pygame.display.flip()
    pygame.time.wait(3000)

# --- Final Wedding Scene ---
def play_final_scene(screen, screen_width, screen_height):
    crowd_cheer_sound.play()
    image_path = os.path.join("assets", "hasina_tea_uncle_wedding.png")
    try:
        image = pygame.image.load(image_path)
        image = pygame.transform.scale(image, (screen_width, screen_height))
        screen.blit(image, (0, 0))
    except:
        screen.fill(BLACK)
        print("Wedding image not found!")

    font = pygame.font.Font(None, 48)
    text = font.render("Hasina married Tea Uncle to save democracy.", True, WHITE)
    text_rect = text.get_rect(center=(screen_width // 2, screen_height - 60))
    screen.blit(text, text_rect)

    pygame.display.flip()
    pygame.time.wait(7000)

# --- Main Game ---
def main():
    pygame.init()
    pygame.mixer.init()

    screen = pygame.display.set_mode((0, 0), pygame.FULLSCREEN)
    SCREEN_WIDTH, SCREEN_HEIGHT = screen.get_size()
    pygame.display.set_caption("Rajnoitik Rumble")

    global slap_sound, crowd_cheer_sound
    bd_people_img = load_image("bd_people.png", (PLAYER_WIDTH, PLAYER_HEIGHT))
    shekhu_aunty_img = load_image("shekhu_aunty.png", (PLAYER_WIDTH, PLAYER_HEIGHT))
    hand_img = load_image("hand.png", (40, 40))
    level1_bg = load_image("bg_chay_dokan.png", (SCREEN_WIDTH, SCREEN_HEIGHT))
    level2_bg = load_image("jatiya_sangsad.png", (SCREEN_WIDTH, SCREEN_HEIGHT))
    level3_bg = load_image("level3_bg.png", (SCREEN_WIDTH, SCREEN_HEIGHT))
    slap_sound = load_sound("slap.wav")
    crowd_cheer_sound = load_sound("crowd_cheer.wav")

    backgrounds = [level1_bg, level2_bg, level3_bg]
    current_level = 1
    running = True
    clock = pygame.time.Clock()

    player = Player(
        x=100, y=SCREEN_HEIGHT - PLAYER_HEIGHT - 50,
        image=bd_people_img,
        name="BD People",
        controls={'left': pygame.K_a, 'right': pygame.K_d, 'up': pygame.K_w, 'down': pygame.K_s, 'attack': pygame.K_SPACE}
    )

    opponent = ShekhuAunty(
        x=SCREEN_WIDTH / 2, y=SCREEN_HEIGHT / 2,
        image=shekhu_aunty_img,
        screen_width=SCREEN_WIDTH, screen_height=SCREEN_HEIGHT
    )

    effects = pygame.sprite.Group()

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT or (event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE):
                running = False
            if event.type == pygame.KEYDOWN and event.key == player.controls['attack']:
                player.attack(opponent, effects, hand_img)

        keys = pygame.key.get_pressed()
        player.move(keys, SCREEN_WIDTH, SCREEN_HEIGHT)
        opponent.update()
        effects.update()

        if opponent.health <= 0:
            if current_level < 3:
                display_level_cleared(screen, SCREEN_WIDTH, SCREEN_HEIGHT, current_level)
                current_level += 1
                player.health = HEALTH
                opponent.health = HEALTH
            else:
                play_final_scene(screen, SCREEN_WIDTH, SCREEN_HEIGHT)
                running = False

        screen.blit(backgrounds[current_level - 1], (0, 0))

        player.draw(screen)
        opponent.draw(screen)
        for effect in effects:
            effect.draw(screen)

        draw_health_bar(screen, 20, 20, 300, 30, player.health, HEALTH)
        draw_health_bar(screen, SCREEN_WIDTH - 320, 20, 300, 30, opponent.health, HEALTH)

        pygame.display.flip()
        clock.tick(FPS)

    pygame.quit()

if __name__ == "__main__":
    main()
