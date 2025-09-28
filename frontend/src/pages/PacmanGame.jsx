import { useEffect, useRef } from 'react';

export default function PacmanGame({ data, onQuestionTrigger }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasContext = canvas.getContext('2d');

    // Load sprite images
    const pacmanFrames = new Image();
    pacmanFrames.src = '/PacmanImages/animations.gif';
    const ghostFrames = new Image();
    ghostFrames.src = '/PacmanImages/ghost.png';

    let animationTimerId = null;
    let gameInterval = null;
    const ghostDirectionTimers = [];

    // Game constants/state
    const blockSize = 20;
    const fps = 30;
    const wallSpaceWidth = blockSize / 1.5;
    const wallOffset = (blockSize - wallSpaceWidth) / 2;
    const foodOffset = blockSize / 4;
    const wallColor = 'red';
    const innerWallColor = 'black';
    const foodColor = 'orange';
    let score = 0;
    let ghostCount = 4;
    let ghosts = [];
    let lives = 3;
    let foodCount = 0;

    const RIGHT = 4;
    const LEFT = 2;
    const UP = 3;
    const DOWN = 1;

    const ghostLocation = [
      { x: 0, y: 0 },
      { x: 176, y: 0 },
      { x: 0, y: 121 },
      { x: 176, y: 121 },
    ];

    const map = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1,2,2,2,1],
      [1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1],
      [1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,2,1,2,1,1,1,2,1,2,1,1,1,2,1,2,1],
      [1,2,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,1,2,2,2,1],
      [1,1,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,2,1,1,1,1,1],
      [0,0,0,0,1,2,1,2,2,2,2,2,2,2,1,2,1,0,0,0,0,0,0,0,1,2,1,2,2,2,2,2,2,2,1],
      [1,1,1,1,1,2,1,2,1,1,2,1,1,2,1,2,1,1,1,1,1,1,1,1,1,2,1,2,1,1,2,1,1,2,1],
      [1,2,2,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,1,2,1],
      [1,1,1,1,1,2,1,2,1,2,2,2,1,2,1,2,1,1,1,1,1,1,1,1,1,2,1,2,1,2,2,2,1,2,1],
      [0,0,0,0,1,2,1,2,1,1,1,1,1,2,1,2,1,0,0,0,0,0,0,0,1,2,1,2,1,1,1,1,1,2,1],
      [0,0,0,0,1,2,1,2,2,2,2,2,2,2,1,2,1,0,0,0,0,0,0,0,1,2,1,2,2,2,2,2,2,2,1],
      [1,1,1,1,1,2,2,2,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,2,1],
      [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1,2,2,2,1],
      [1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1],
      [1,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,2,1,2,2,2,1],
      [1,1,2,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,2,1,1,1,1,2,1,2,1,2,1,1,1,1,1,2,1],
      [1,2,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,1,2,2,2,1],
      [1,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,2,1,2,1,1,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];

    // Prepare pellets generated from data (one per question) and topic colors
    // We'll keep walls as 1, empty as 0; pellets are tracked separately
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] === 2) {
          map[i][j] = 0;
        }
      }
    }

    const topicPalette = [
      '#f1c40f', '#3498db', '#e67e22', '#9b59b6', '#2ecc71', '#e74c3c', '#1abc9c', '#e84393'
    ];
    const pellets = [];

    const flattenQuestions = () => {
      const list = [];
      if (data?.topics && Array.isArray(data.topics)) {
        data.topics.forEach((topic, tIdx) => {
          const qs = topic?.questions || [];
          qs.forEach((q, qIdx) => {
            list.push({ topicIndex: tIdx, questionIndex: qIdx, topicTitle: topic?.topic, question: q });
          });
        });
      }
      return list;
    };

    const getReachableTiles = () => {
      const rows = map.length;
      const cols = map[0].length;
      const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
      const tiles = [];
      const queue = [];
      const start = { x: 1, y: 1 };
      if (map[start.y]?.[start.x] === 1) return tiles;
      queue.push(start);
      visited[start.y][start.x] = true;
      const dirs = [ [1,0], [-1,0], [0,1], [0,-1] ];
      while (queue.length) {
        const { x, y } = queue.shift();
        tiles.push({ x, y });
        for (const [dx, dy] of dirs) {
          const nx = x + dx, ny = y + dy;
          if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && !visited[ny][nx] && map[ny][nx] !== 1) {
            visited[ny][nx] = true;
            queue.push({ x: nx, y: ny });
          }
        }
      }
      return tiles;
    };

    const distributePellets = () => {
      const questions = flattenQuestions();
      const emptyTiles = getReachableTiles();
      if (questions.length === 0 || emptyTiles.length === 0) return;
      const step = Math.max(1, Math.floor(emptyTiles.length / questions.length));
      for (let i = 0; i < questions.length; i++) {
        const baseIndex = i * step;
        const randJitter = Math.floor(Math.random() * Math.min(step, emptyTiles.length));
        const idx = Math.min(emptyTiles.length - 1, baseIndex + randJitter);
        const tile = emptyTiles[idx];
        const color = topicPalette[questions[i].topicIndex % topicPalette.length];
        pellets.push({
          x: tile.x,
          y: tile.y,
          color,
          topicIndex: questions[i].topicIndex,
          questionIndex: questions[i].questionIndex,
          topicTitle: questions[i].topicTitle,
        });
      }
      foodCount = pellets.length;
    };

    const randomTargetForghosts = [
      { x: 1 * blockSize, y: 1 * blockSize },
      { x: 1 * blockSize, y: (map.length - 2) * blockSize },
      { x: (map[0].length - 2) * blockSize, y: blockSize },
      { x: (map[0].length - 2) * blockSize, y: (map.length - 2) * blockSize },
    ];

    const createRect = (x, y, width, height, color) => {
      canvasContext.fillStyle = color;
      canvasContext.fillRect(x, y, width, height);
    };

    const drawStar = (cx, cy, spikes, outerRadius, innerRadius, color) => {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;
      canvasContext.beginPath();
      canvasContext.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        canvasContext.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        canvasContext.lineTo(x, y);
        rot += step;
      }
      canvasContext.lineTo(cx, cy - outerRadius);
      canvasContext.closePath();
      canvasContext.fillStyle = color;
      canvasContext.fill();
    };

    class Pacman {
      constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.currentDirection = RIGHT;
        this.nextDirection = this.currentDirection;
        this.frameCount = 7;
        this.currentFrame = 1;
      }

      moveProcess() {
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollision()) {
          this.moveBackwards();
          return;
        }
      }

      eat() {
        for (let i = 0; i < map.length; i++) {
          for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] === 2 && this.getMapX() === j && this.getMapY() === i) {
              map[i][j] = 3;
              score++;
            }
          }
        }
      }

      moveBackwards() {
        switch (this.currentDirection) {
          case RIGHT:
            this.x -= this.speed; break;
          case LEFT:
            this.x += this.speed; break;
          case UP:
            this.y += this.speed; break;
          case DOWN:
            this.y -= this.speed; break;
        }
      }

      moveForwards() {
        switch (this.currentDirection) {
          case RIGHT:
            this.x += this.speed; break;
          case LEFT:
            this.x -= this.speed; break;
          case UP:
            this.y -= this.speed; break;
          case DOWN:
            this.y += this.speed; break;
        }
      }

      checkCollision() {
        if (
          map[this.getMapY()][this.getMapX()] === 1 ||
          map[this.getMapYRightSide()][this.getMapX()] === 1 ||
          map[this.getMapY()][this.getMapXRightSide()] === 1 ||
          map[this.getMapYRightSide()][this.getMapXRightSide()] === 1
        ) {
          return true;
        }
        return false;
      }

      checkGhostCollision() {
        for (let i = 0; i < ghosts.length; i++) {
          const ghost = ghosts[i];
          if (ghost.getMapX() === this.getMapX() && ghost.getMapY() === this.getMapY()) {
            return true;
          }
        }
        return false;
      }

      changeDirectionIfPossible() {
        if (this.currentDirection === this.nextDirection) return;
        const tempDirection = this.currentDirection;
        this.currentDirection = this.nextDirection;
        this.moveForwards();
        if (this.checkCollision()) {
          this.moveBackwards();
          this.currentDirection = tempDirection;
        } else {
          this.moveBackwards();
        }
      }

      changeAnimation() {
        this.currentFrame = this.currentFrame === this.frameCount ? 1 : this.currentFrame + 1;
      }

      draw() {
        canvasContext.save();
        canvasContext.translate(this.x + blockSize / 2, this.y + blockSize / 2);
        canvasContext.rotate((this.currentDirection * 90 * Math.PI) / 180);
        canvasContext.translate(-this.x - blockSize / 2, -this.y - blockSize / 2);
        canvasContext.drawImage(
          pacmanFrames,
          (this.currentFrame - 1) * blockSize,
          0,
          blockSize,
          blockSize,
          this.x,
          this.y,
          this.width,
          this.height
        );
        canvasContext.restore();
      }

      getMapX() { return parseInt(this.x / blockSize); }
      getMapY() { return parseInt(this.y / blockSize); }
      getMapXRightSide() { return parseInt((this.x + 0.999999 * blockSize) / blockSize); }
      getMapYRightSide() { return parseInt((this.y + 0.999999 * blockSize) / blockSize); }
    }

    class Ghost {
      constructor(x, y, width, height, speed, imageX, imageY, imageWidth, imageHeigth, range) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.currentDirection = RIGHT;
        this.currentFrame = 1;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageWidth = imageWidth;
        this.imageHeigth = imageHeigth;
        this.range = range;
        this.randomTargetIndex = parseInt(Math.random() * randomTargetForghosts.length);
      }

      startDirectionTimer() {
        const id = setInterval(() => { this.changeRandomDirection(); }, 10000);
        ghostDirectionTimers.push(id);
      }

      changeRandomDirection() {
        this.randomTargetIndex += 1;
        this.randomTargetIndex = this.randomTargetIndex % 4;
      }

      moveProcess() {
        if (this.isInRangeOfPacman()) {
          this.target = pacman;
        } else {
          this.target = randomTargetForghosts[this.randomTargetIndex];
        }
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollision()) {
          this.moveBackwards();
          return;
        }
      }

      moveBackwards() {
        switch (this.currentDirection) {
          case RIGHT: this.x -= this.speed; break;
          case LEFT: this.x += this.speed; break;
          case UP: this.y += this.speed; break;
          case DOWN: this.y -= this.speed; break;
        }
      }

      moveForwards() {
        switch (this.currentDirection) {
          case RIGHT: this.x += this.speed; break;
          case LEFT: this.x -= this.speed; break;
          case UP: this.y -= this.speed; break;
          case DOWN: this.y += this.speed; break;
        }
      }

      checkCollision() {
        if (
          map[this.getMapY()][this.getMapX()] === 1 ||
          map[this.getMapYRightSide()][this.getMapX()] === 1 ||
          map[this.getMapY()][this.getMapXRightSide()] === 1 ||
          map[this.getMapYRightSide()][this.getMapXRightSide()] === 1
        ) {
          return true;
        }
        return false;
      }

      isInRangeOfPacman() {
        const xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        const yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        return Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range;
      }

      changeDirectionIfPossible() {
        const tempDirection = this.currentDirection;
        this.currentDirection = this.calculateNewDirection(
          map,
          parseInt(this.target.x / blockSize),
          parseInt(this.target.y / blockSize)
        );
        if (typeof this.currentDirection === 'undefined') {
          this.currentDirection = tempDirection; return;
        }
        this.moveForwards();
        if (this.checkCollision()) {
          this.moveBackwards();
          this.currentDirection = tempDirection;
        } else {
          this.moveBackwards();
        }
      }

      calculateNewDirection(mp, destX, destY) {
        const grid = mp.map(row => row.slice());
        const queue = [{ x: this.getMapX(), y: this.getMapY(), moves: [] }];
        while (queue.length > 0) {
          const popped = queue.shift();
          if (popped.x === destX && popped.y === destY) {
            return popped.moves[0];
          } else {
            grid[popped.y][popped.x] = 1;
            const neighborList = this.addNeighbors(popped, grid);
            for (let i = 0; i < neighborList.length; i++) {
              queue.push(neighborList[i]);
            }
          }
        }
        return UP;
      }

      addNeighbors(poped, grid) {
        const q = [];
        const numOfRows = grid.length;
        const numOfColumns = grid[0].length;

        if (poped.x - 1 >= 0 && poped.x - 1 < numOfColumns && grid[poped.y][poped.x - 1] !== 1) {
          const tempMoves = poped.moves.slice(); tempMoves.push(LEFT);
          q.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
        }
        if (poped.x + 1 >= 0 && poped.x + 1 < numOfColumns && grid[poped.y][poped.x + 1] !== 1) {
          const tempMoves = poped.moves.slice(); tempMoves.push(RIGHT);
          q.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
        }
        if (poped.y - 1 >= 0 && poped.y - 1 < numOfRows && grid[poped.y - 1][poped.x] !== 1) {
          const tempMoves = poped.moves.slice(); tempMoves.push(UP);
          q.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
        }
        if (poped.y + 1 >= 0 && poped.y + 1 < numOfRows && grid[poped.y + 1][poped.x] !== 1) {
          const tempMoves = poped.moves.slice(); tempMoves.push(DOWN);
          q.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
        }
        return q;
      }

      draw() {
        canvasContext.drawImage(
          ghostFrames,
          this.imageX,
          this.imageY,
          this.imageWidth,
          this.imageHeigth,
          this.x,
          this.y,
          this.width,
          this.height
        );
      }

      getMapX() { return parseInt(this.x / blockSize); }
      getMapY() { return parseInt(this.y / blockSize); }
      getMapXRightSide() { return parseInt((this.x + 0.999999 * blockSize) / blockSize); }
      getMapYRightSide() { return parseInt((this.y + 0.999999 * blockSize) / blockSize); }
    }

    let pacman;

    const drawWalls = () => {
      for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
          if (map[i][j] === 1) {
            createRect(j * blockSize, i * blockSize, blockSize, blockSize, wallColor);
          }
          if (j > 0 && map[i][j - 1] === 1) {
            createRect(j * blockSize, i * blockSize + wallOffset, wallSpaceWidth + wallOffset, wallSpaceWidth, innerWallColor);
          }
          if (j < map[0].length - 1 && map[i][j + 1] === 1) {
            createRect(j * blockSize + wallOffset, i * blockSize + wallOffset, wallSpaceWidth + wallOffset, wallSpaceWidth, innerWallColor);
          }
          if (i > 0 && map[i - 1][j] === 1) {
            createRect(j * blockSize + wallOffset, i * blockSize, wallSpaceWidth, wallSpaceWidth + wallOffset, innerWallColor);
          }
          if (i < map.length - 1 && map[i + 1][j] === 1) {
            createRect(j * blockSize + wallOffset, i * blockSize + wallOffset, wallSpaceWidth, wallSpaceWidth + wallOffset, innerWallColor);
          }
        }
      }
    };

    const drawFood = () => {
      const starOuter = blockSize * 0.42;
      const starInner = starOuter * 0.5;
      for (let i = 0; i < pellets.length; i++) {
        const p = pellets[i];
        const cx = p.x * blockSize + blockSize / 2;
        const cy = p.y * blockSize + blockSize / 2;
        drawStar(cx, cy, 5, starOuter, starInner, p.color || foodColor);
      }
    };

    const drawScore = () => {
      canvasContext.font = '20px ARIAl';
      canvasContext.fillStyle = 'white';
      const mapWidth = map[0].length * blockSize;
      const offsetX = (canvas.width - mapWidth) / 2;
      canvasContext.fillText('SCORE: ' + score, offsetX, blockSize * (map.length + 1));
    };

    const drawLives = () => {
      const mapWidth = map[0].length * blockSize;
      const offsetX = (canvas.width - mapWidth) / 2;
      const livesDrawingCoordinateX = offsetX + blockSize * 7;
      const livesDrawingCoordinateY = blockSize * (map.length + 1);
      canvasContext.font = '20px ARIAl';
      canvasContext.fillStyle = 'white';
      canvasContext.fillText('LIVES: ', livesDrawingCoordinateX, livesDrawingCoordinateY);
      for (let i = 0; i < lives; i++) {
        canvasContext.drawImage(
          pacmanFrames,
          2 * blockSize,
          0,
          blockSize,
          blockSize,
          livesDrawingCoordinateX + 70 + blockSize * 1.3 * i,
          livesDrawingCoordinateY - 17,
          blockSize,
          blockSize
        );
      }
    };

    const drawGhosts = () => {
      for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
      }
    };

    const drawGameOver = () => {
      canvasContext.font = '20px Emulogic';
      canvasContext.fillStyle = 'white';
      const mapWidth = map[0].length * blockSize;
      const offsetX = (canvas.width - mapWidth) / 2;
      const centerX = offsetX + mapWidth / 2;
      canvasContext.fillText('GAME OVER!', centerX - 60, 200);
    };

    const drawWin = () => {
      canvasContext.font = '20px Emulogic';
      canvasContext.fillStyle = 'white';
      const mapWidth = map[0].length * blockSize;
      const offsetX = (canvas.width - mapWidth) / 2;
      const centerX = offsetX + mapWidth / 2;
      canvasContext.fillText('YOU WIN!', centerX - 50, 200);
    };

    const draw = () => {
      createRect(0, 0, canvas.width, canvas.height, 'black');
      
      // Calculate offset to center the map (35 columns * 20px = 700px, canvas is 900px)
      const mapWidth = map[0].length * blockSize; // 35 * 20 = 700
      const mapHeight = map.length * blockSize;
      const offsetX = (canvas.width - mapWidth) / 2;
      const offsetY = Math.max(0, (canvas.height - mapHeight) / 2);
      
      // Save context and translate to center the map
      canvasContext.save();
      canvasContext.translate(offsetX, offsetY);
      
      drawWalls();
      drawFood();
      pacman.draw();
      drawGhosts();
      
      // Restore context for UI elements that should stay in original position
      canvasContext.restore();
      
      drawScore();
      drawLives();
    };

    const update = () => {
      pacman.moveProcess();
      // check pellet collisions (one question per pellet)
      for (let i = pellets.length - 1; i >= 0; i--) {
        const p = pellets[i];
        if (pacman.getMapX() === p.x && pacman.getMapY() === p.y) {
          const topic = data?.topics?.[p.topicIndex];
          const q = topic?.questions?.[p.questionIndex];
          if (q && typeof onQuestionTrigger === 'function') {
            onQuestionTrigger({
              topicTitle: p.topicTitle,
              topicIndex: p.topicIndex,
              questionIndex: p.questionIndex,
              question: q,
            });
          }
          pellets.splice(i, 1);
          score++;
          break;
        }
      }
      
      for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess();
      }
      if (pacman.checkGhostCollision()) {
        restartGame();
      }
      if (pellets.length === 0 && foodCount > 0) {
        drawWin();
        if (gameInterval) clearInterval(gameInterval);
      }
    };

    const gameLoop = () => {
      draw();
      update();
    };

    const createNewPacman = () => {
      pacman = new Pacman(blockSize, blockSize, blockSize, blockSize, blockSize / 5);
    };

    const createGhosts = () => {
      ghosts = [];
      for (let i = 0; i < ghostCount; i++) {
        const newGhost = new Ghost(
          9 * blockSize + (i % 2 === 0 ? 0 : 1) * blockSize,
          10 * blockSize + (i % 2 === 0 ? 0 : 1) * blockSize,
          blockSize,
          blockSize,
          pacman.speed / 2,
          ghostLocation[i % 4].x,
          ghostLocation[i % 4].y,
          124,
          116,
          6 + i
        );
        newGhost.startDirectionTimer();
        ghosts.push(newGhost);
      }
    };

    const restartGame = () => {
      createNewPacman();
      createGhosts();
      lives--;
      if (lives === 0) {
        gameOver();
      }
    };

    const gameOver = () => {
      drawGameOver();
      if (gameInterval) clearInterval(gameInterval);
    };

    const handleKeyDown = (event) => {
      const k = event.keyCode;
      if (k === 37 || k === 65) {
        pacman.nextDirection = LEFT;
      } else if (k === 38 || k === 87) {
        pacman.nextDirection = UP;
      } else if (k === 39 || k === 68) {
        pacman.nextDirection = RIGHT;
      } else if (k === 40 || k === 83) {
        pacman.nextDirection = DOWN;
      }
    };

    const startGameWhenImagesReady = () => {
      if (!pacmanFrames.complete || !ghostFrames.complete) return;
      distributePellets();
      createNewPacman();
      createGhosts();
      if (animationTimerId) clearInterval(animationTimerId);
      animationTimerId = setInterval(() => pacman.changeAnimation(), 100);
      if (gameInterval) clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, 1000 / fps);
      window.addEventListener('keydown', handleKeyDown);
    };

    if (pacmanFrames.complete && ghostFrames.complete) {
      startGameWhenImagesReady();
    } else {
      pacmanFrames.onload = startGameWhenImagesReady;
      ghostFrames.onload = startGameWhenImagesReady;
    }

    return () => {
      if (animationTimerId) clearInterval(animationTimerId);
      if (gameInterval) clearInterval(gameInterval);
      window.removeEventListener('keydown', handleKeyDown);
      while (ghostDirectionTimers.length) {
        const id = ghostDirectionTimers.pop();
        clearInterval(id);
      }
    };
  }, []);

  return (
    <canvas ref={canvasRef} id="canvas" width="900" height="420"></canvas>
  );
}


