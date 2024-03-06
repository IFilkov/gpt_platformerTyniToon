const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: 50,
  y: 300,
  width: 30,
  height: 30,
  color: 'blue',
  speed: 5,
  jumpHeight: 6,
  lives: 3,
  score: 0,
  canJump: true,
};

const platforms = [];
const enemies = [];
const coins = [];
const totalCoins = 10;

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generatePlatform() {
  const platformWidth = player.width * 4;
  const platformHeight = player.height;
  const platformX = getRandomNumber(0, canvas.width - platformWidth);
  const platformY = getRandomNumber(50, canvas.height - 20);

  platforms.push({
    x: platformX,
    y: platformY,
    width: platformWidth,
    height: platformHeight,
  });

  // Generate ladder in the middle of the platform
  const ladderWidth = 10;
  const ladderHeight = platformHeight;
  const ladderX = platformX + (platformWidth - ladderWidth) / 2;
  const ladderY = platformY;

  platforms.push({
    x: ladderX,
    y: ladderY,
    width: ladderWidth,
    height: ladderHeight,
    isLadder: true,
  });
}

function generateEnemy() {
  const enemyWidth = 30;
  const enemyHeight = 30;
  const enemyX = getRandomNumber(0, canvas.width - enemyWidth);
  const enemyY = getRandomNumber(50, canvas.height - 30);

  enemies.push({
    x: enemyX,
    y: enemyY,
    width: enemyWidth,
    height: enemyHeight,
    speed: 2,
    platformIndex: Math.floor(Math.random() * platforms.length), // Start on a random platform
  });
}

function generateCoin() {
  const coinWidth = 20;
  const coinHeight = 20;
  const coinX = getRandomNumber(0, canvas.width - coinWidth);
  const coinY = getRandomNumber(50, canvas.height - 20);

  coins.push({
    x: coinX,
    y: coinY,
    width: coinWidth,
    height: coinHeight,
  });
}

function initializeGame() {
  for (let i = 0; i < 10; i++) {
    generatePlatform();
    generateEnemy();
    generateCoin();
    
  }
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
  ctx.fillStyle = '#444';
  platforms.forEach(platform => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
}

function drawEnemies() {
  ctx.fillStyle = 'green';
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

function drawCoins() {
  ctx.fillStyle = 'orange';
  coins.forEach(coin => {
    ctx.fillRect(coin.x, coin.y, coin.width, coin.height);
  });
}

function isCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  // Добавим переменную для хранения состояния клавиш
const keys = {};

function handleKeyPress() {
  if (keys['ArrowLeft'] && player.x > 0) {
    player.x -= player.speed;
  }

  if (keys['ArrowRight'] && player.x + player.width < canvas.width) {
    player.x += player.speed;
    player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
  }
}

  function update() {
    
    handleKeyPress();
    document.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
      } else if (event.key === 'ArrowRight' && player.x + player.width < canvas.width) {
        player.x += player.speed;
      }
    });
  
    if (player.y < canvas.height - player.height) {
      player.y += 2;
    } else {
      player.canJump = true;
    }
    enemies.forEach(enemy => {
      const platform = platforms[enemy.platformIndex];
      if (enemy.x + enemy.width >= platform.x + platform.width || enemy.x <= platform.x) {
        enemy.speed *= -1;
      }
      enemy.x += enemy.speed;
    });
  
    enemies.forEach(enemy => {
      if (isCollision(player, enemy)) {
        player.lives--;
        resetPlayerPosition();
      }
    });
  
    coins.forEach((coin, index) => {
      if (isCollision(player, coin)) {
        player.score += 10;
        coins.splice(index, 1);
        coins.push(generateCoin());
      }
    });
  
    platforms.forEach(platform => {
      if (isCollision(player, platform)) {
        if (player.y + player.height < platform.y + 2) {
          player.y = platform.y - player.height;
          player.canJump = true;
        } else if (player.y > platform.y + platform.height - 2) {
          player.y = platform.y + platform.height;
        } else if (player.x + player.width > platform.x && player.x < platform.x + platform.width) {
          // Ограничим передвижение героя только в пределах платформы
          player.x = Math.min(platform.x + platform.width - player.width, Math.max(player.x, platform.x));
        }
      }
    });
  
    if (player.y > canvas.height) {
      player.lives--;
      resetPlayerPosition();
    }
  
    if (player.lives === 0) {
      alert('Game Over! Your score: ' + player.score);
      resetGame();
    }
  
    if (player.score >= 80) {
      resetGame();
    }
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatforms();
    drawEnemies();
    drawCoins();
    drawPlayer();
  
    requestAnimationFrame(update);
  }
  
  

function resetPlayerPosition() {
  const randomPlatformIndex = getRandomNumber(0, platforms.length - 1);
  const platform = platforms[randomPlatformIndex];
  player.x = getRandomNumber(platform.x, platform.x + platform.width - player.width);
  player.y = platform.y - player.height;
}

function resetGame() {
  player.lives = 3;
  player.score = 0;
  resetPlayerPosition();

  platforms.length = 0;
  enemies.length = 0;
  coins.length = 0;

  for (let i = 0; i < 10; i++) {
    generatePlatform();
    generateEnemy();
    generateCoin();
  }

  handleKeyPress(); // Обработка клавиш после сброса игры
}

initializeGame();
update();
