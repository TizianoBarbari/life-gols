// JS Game of Life engine: exports GameOfLife class
// API:
// constructor(rows, cols)
// step() -> advances one generation and returns new grid
// randomize(prob)
// toggleCell(r,c)
// getGrid() -> deep copy of grid
// setGrid(newGrid)
// resize(rows, cols)

export class GameOfLife {
  constructor(rows = 50, cols = 80) {
    this.rows = rows;
    this.cols = cols;
    this.generation = 0;
    this.grid = this._createGrid(rows, cols);
  }

  _createGrid(r, c) {
    const g = new Array(r);
    for (let i = 0; i < r; i++) g[i] = new Uint8Array(c);
    return g;
  }

  randomize(prob = 0.2) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = Math.random() < prob ? 1 : 0;
      }
    }
    this.generation = 0;
  }

  _countNeighbors(r, c) {
    let n = 0;
    for (let dr = -1; dr <= 1; dr++) {
      const rr = r + dr;
      if (rr < 0 || rr >= this.rows) continue;
      for (let dc = -1; dc <= 1; dc++) {
        const cc = c + dc;
        if (dc === 0 && dr === 0) continue;
        if (cc < 0 || cc >= this.cols) continue;
        n += this.grid[rr][cc];
      }
    }
    return n;
  }

  step(rule = { birth: [3], survive: [2, 3] }) {
    const newGrid = this._createGrid(this.rows, this.cols);
    let alive = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const n = this._countNeighbors(r, c);
        if (this.grid[r][c]) {
          newGrid[r][c] = rule.survive.includes(n) ? 1 : 0;
        } else {
          newGrid[r][c] = rule.birth.includes(n) ? 1 : 0;
        }
        alive += newGrid[r][c];
      }
    }
    this.grid = newGrid;
    this.generation += 1;
    return { grid: this.grid, generation: this.generation, alive };
  }

  toggleCell(r, c) {
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return;
    this.grid[r][c] = this.grid[r][c] ? 0 : 1;
  }

  getGrid() {
    // return deep copy as array of arrays (consumers may expect)
    return Array.from(this.grid).map(row => Array.from(row));
  }

  setGrid(newGrid) {
    const r = newGrid.length;
    const c = newGrid[0]?.length || 0;
    this.rows = r; this.cols = c;
    this.grid = this._createGrid(r, c);
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        this.grid[i][j] = newGrid[i][j] ? 1 : 0;
      }
    }
  }

  resize(rows, cols) {
    const newG = this._createGrid(rows, cols);
    for (let i = 0; i < Math.min(rows, this.rows); i++) {
      for (let j = 0; j < Math.min(cols, this.cols); j++) {
        newG[i][j] = this.grid[i][j];
      }
    }
    this.rows = rows; this.cols = cols; this.grid = newG;
  }
}