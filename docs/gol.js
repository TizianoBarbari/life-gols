const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const cols = 80;
const rows = 50;
const minDelay = 20;    // fastest
const maxDelay = 500;   // slowest
const cellSize = Math.floor(Math.min(canvas.width / cols, canvas.height / rows));

let grid = createGrid(rows, cols);
let running = false;
let timer = null;
let generation = 0; // internal generation counter

// Create empty grid
function createGrid(r, c) {
  let g = new Array(r);
  for (let i = 0; i < r; i++) g[i] = new Array(c).fill(0);
  return g;
}

// Randomize grid
function randomize() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = Math.random() > 0.8 ? 1 : 0;
    }
  }
  generation = 0;
  updateGenerationDisplay();
  draw();
}

// Draw grid
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#333'; // cell color
  ctx.strokeStyle = '#ccc'; // border color

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j]) {
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
        ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }
  }
}

// Count neighbors
function neighbors(r, c) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) count += grid[rr][cc];
    }
  }
  return count;
}

// Compute next generation
function step() {
  const newGrid = createGrid(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const n = neighbors(i, j);
      newGrid[i][j] = grid[i][j] ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
    }
  }
  grid = newGrid;
  generation++;
  updateGenerationDisplay();
  draw();
}

// Update generation counter display
function updateGenerationDisplay() {
  const genElem = document.getElementById('generation');
  if (genElem) genElem.textContent = generation;
}

// Play / Pause button
document.getElementById('play').onclick = () => {
  running = !running;
  document.getElementById('play').textContent = running ? 'Pause' : 'Play';
  if (running) {
    const speedInput = parseInt(document.getElementById('speed').value);
    const delay = Math.max(minDelay, maxDelay - speedInput);
    timer = setInterval(step, delay);
  } else {
    clearInterval(timer);
  }
};

// Step button
document.getElementById('step').onclick = step;

// Random button
document.getElementById('random').onclick = randomize;

// Speed slider
document.getElementById('speed').oninput = function () {
  if (running) {
    clearInterval(timer);
    const speedInput = parseInt(this.value);
    const delay = Math.max(minDelay, maxDelay - speedInput);
    timer = setInterval(step, delay);
  }
};

// Click on canvas to toggle cells
canvas.addEventListener('click', function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    grid[y][x] = grid[y][x] ? 0 : 1;
    draw();
  }
});

// Initialize
randomize();