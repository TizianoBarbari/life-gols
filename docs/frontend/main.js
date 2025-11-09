// main.js: ties UI to Game of Life engine
import { GameOfLife } from "./engines/js-engine.js";

// ---------------- DOM elements ----------------
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const engineSelect = document.getElementById("engine");
const playBtn = document.getElementById("play");
const stepBtn = document.getElementById("step");
const randomBtn = document.getElementById("random");
const randomDensity = document.getElementById("randomDensity");
const randomDensityDisplay = document.getElementById("randomDensityDisplay");
const speedInput = document.getElementById("speed");
const generationElem = document.getElementById("generation");
const aliveElem = document.getElementById("alive");
const ruleInput = document.getElementById("rule");
const clearBtn = document.getElementById("clear");
const gridSizeDisplay = document.getElementById("gridSizeDisplay");

// ---------------- Settings ----------------
const cellSize = 10;
const rows = Math.floor(canvas.height / cellSize);
const cols = Math.floor(canvas.width / cellSize);

// ---------------- Engine ----------------
let engine = new GameOfLife(rows, cols);
let running = false;
let raf = null;
let speed = parseInt(speedInput.value, 10);
let rule = parseRule(ruleInput.value);

// ---------------- Rendering ----------------
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#111";

  let aliveCount = 0;
  for (let r = 0; r < engine.rows; r++) {
    for (let c = 0; c < engine.cols; c++) {
      if (engine.grid[r][c]) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        aliveCount++;
      }
    }
  }

  generationElem.textContent = engine.generation;
  aliveElem.textContent = aliveCount;

  // Display "coming soon" for grid size (non interactive)
  if (gridSizeDisplay) {
    gridSizeDisplay.textContent = `${cols} x ${rows} (coming soon)`;
  }
}

// ---------------- Main loop ----------------
let lastTick = 0;
function loop(ts) {
  if (!lastTick) lastTick = ts;
  const interval = 1000 / Math.max(1, speed);
  if (ts - lastTick >= interval) {
    engine.step(rule);
    drawGrid();
    lastTick = ts;
  }
  if (running) raf = requestAnimationFrame(loop);
}

// ---------------- Controls ----------------
playBtn.addEventListener("click", () => {
  running = !running;
  playBtn.textContent = running ? "Pause" : "Play";
  if (running) {
    lastTick = 0;
    raf = requestAnimationFrame(loop);
  } else {
    cancelAnimationFrame(raf);
  }
});

stepBtn.addEventListener("click", () => {
  engine.step(rule);
  drawGrid();
});

// random button uses the density slider value
randomBtn.addEventListener("click", () => {
  const d = parseFloat(randomDensity.value || "0.25");
  engine.randomize(d); // engine.randomize resets generation
  drawGrid();
});

// show density numeric next to slider
if (randomDensity && randomDensityDisplay) {
  randomDensityDisplay.textContent = parseFloat(randomDensity.value).toFixed(2);
  randomDensity.addEventListener("input", () => {
    randomDensityDisplay.textContent = parseFloat(randomDensity.value).toFixed(2);
  });
}

speedInput.addEventListener("input", () => {
  speed = parseInt(speedInput.value, 10);
});

ruleInput.addEventListener("change", () => {
  rule = parseRule(ruleInput.value);
});

// ---------------- Patterns / presets ----------------
// Basic pattern collection (add more here)
const patterns = {
  glider: [
    [0,1,0],
    [0,0,1],
    [1,1,1]
  ],
  "small-exploder": [
    [0,1,0],
    [1,1,1],
    [1,0,1],
    [0,1,0]
  ],
  pulsar: [
    [0,0,1,1,1,0,0,0,0,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [0,0,1,1,1,0,0,0,0,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,0,0,0,0,1,1,1,0,0,0],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,0,0,0,0,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ]
};

// Track state of each pattern: 0 = idle, 1 = awaiting canvas click (manual placement)
const patternState = {};
Object.keys(patterns).forEach(name => patternState[name] = 0);

// Currently selected pattern name for manual placement (or null)
let selectedPattern = null;

// ---------------- Unified Canvas click handler ----------------
// Single handler that either places a selected pattern (centered on click)
// or toggles a single cell if no pattern is selected.
canvas.addEventListener("click", (ev) => {
  const rect = canvas.getBoundingClientRect();
  const col = Math.floor((ev.clientX - rect.left) / cellSize);
  const row = Math.floor((ev.clientY - rect.top) / cellSize);

  // If a pattern is selected for manual placement, place it (centered on click)
  if (selectedPattern) {
    const pat = patterns[selectedPattern];
    if (!pat) {
      // safety: reset state if pattern missing
      patternState[selectedPattern] = 0;
      selectedPattern = null;
      return;
    }

    // center pattern on clicked cell
    const centerR = Math.floor(pat.length / 2);
    const centerC = Math.floor(pat[0].length / 2);
    const r0 = clamp(row - centerR, 0, engine.rows - pat.length);
    const c0 = clamp(col - centerC, 0, engine.cols - pat[0].length);

    applyPatternAt(selectedPattern, r0, c0);
    drawGrid();

    // reset UI/state for this pattern
    patternState[selectedPattern] = 0;
    const btn = document.querySelector(`[data-pattern='${selectedPattern}']`);
    if (btn) btn.textContent = selectedPattern.charAt(0).toUpperCase() + selectedPattern.slice(1);
    selectedPattern = null;
    return; // consume click, do NOT toggle single cell
  }

  // Default behavior: toggle the clicked cell
  engine.toggleCell(row, col);
  drawGrid();
});

// ---------------- Pattern buttons logic ----------------
document.querySelectorAll('[data-pattern]').forEach(btn => {
  const name = btn.dataset.pattern;

  btn.addEventListener('click', () => {
    // Reset any other active pattern buttons (only one manual placement at a time)
    Object.keys(patternState).forEach(p => {
      if (p !== name && patternState[p] === 1) {
        patternState[p] = 0;
        const otherBtn = document.querySelector(`[data-pattern='${p}']`);
        if (otherBtn) otherBtn.textContent = p.charAt(0).toUpperCase() + p.slice(1);
      }
    });

    if (patternState[name] === 0) {
      // First click → enable manual placement: show temporary label and set state
      btn.textContent = `Click canvas to place a ${name.toUpperCase()}, or click again for random`;
      patternState[name] = 1;
      selectedPattern = name;
    } else {
      // Second click → place randomly immediately
      applyPatternAt(name);
      drawGrid();
      // Reset label and state
      btn.textContent = name.charAt(0).toUpperCase() + name.slice(1);
      patternState[name] = 0;
      selectedPattern = null;
    }
  });
});

// ---------------- Clear button ----------------
clearBtn.addEventListener('click', () => {
  // Stop simulation if running
  if (running) {
    running = false;
    cancelAnimationFrame(raf);
    playBtn.textContent = "Play";
  }
  // Reset engine to empty grid
  engine = new GameOfLife(rows, cols);
  drawGrid();
});

// ---------------- Apply pattern ----------------
function applyPatternAt(name, r0 = null, c0 = null) {
  const pat = patterns[name];
  if (!pat) return;

  // If coordinates are not provided, choose a random valid top-left that fits pattern
  if (r0 === null || c0 === null) {
    r0 = Math.floor(Math.random() * Math.max(1, (engine.rows - pat.length + 1)));
    c0 = Math.floor(Math.random() * Math.max(1, (engine.cols - pat[0].length + 1)));
  } else {
    // clamp just in case
    r0 = clamp(r0, 0, Math.max(0, engine.rows - pat.length));
    c0 = clamp(c0, 0, Math.max(0, engine.cols - pat[0].length));
  }

  for (let i = 0; i < pat.length; i++) {
    for (let j = 0; j < pat[0].length; j++) {
      engine.grid[r0 + i][c0 + j] = pat[i][j] ? 1 : 0;
    }
  }

  // Do not reset generation: user can add patterns while running
  // engine.generation = 0;
}

// ---------------- Helpers ----------------
function clamp(v, a, b) {
  if (v < a) return a;
  if (v > b) return b;
  return v;
}

// parse rule like "B3/S23"
function parseRule(str) {
  if (!str) return { birth: [3], survive: [2, 3] };
  const match = str.match(/B(\d+)\/S(\d+)/i);
  if (!match) return { birth: [3], survive: [2, 3] };
  const birth = match[1].split("").map(n => parseInt(n, 10));
  const survive = match[2].split("").map(n => parseInt(n, 10));
  return { birth, survive };
}

// ---------------- Init ----------------
function init() {
  // use initial density consistent with randomDensity default
  const initialDensity = parseFloat(randomDensity ? randomDensity.value : "0.15");
  engine.randomize(initialDensity);
  rule = parseRule(ruleInput.value);
  drawGrid();

  // Make "Rules" label clickable with an info link
  const rulesLabel = document.querySelector("label[for='rule']");
  if (rulesLabel) {
    rulesLabel.innerHTML = `Rules (<a href="https://en.wikipedia.org/wiki/Life-like_cellular_automaton#A_selection_of_Life-like_rules" target="_blank" rel="noopener">info</a>)`;
  }
}

init();