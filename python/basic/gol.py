"""
Conway's Game of Life, minimal renderer
Run: python python/basic/gol.py
"""

import time
import os

def create_grid(rows, cols):
    return [[0 for _ in range(cols)] for _ in range(rows)]

def neighbors(grid, r, c):
    rows, cols = len(grid), len(grid[0])
    dirs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    count = 0
    for dr,dc in dirs:
        rr, cc = r+dr, c+dc
        if 0 <= rr < rows and 0 <= cc < cols:
            count += grid[rr][cc]
    return count

def step(grid):
    rows, cols = len(grid), len(grid[0])
    new = create_grid(rows, cols)
    for r in range(rows):
        for c in range(cols):
            n = neighbors(grid, r, c)
            if grid[r][c] == 1:
                new[r][c] = 1 if n in (2,3) else 0
            else:
                new[r][c] = 1 if n == 3 else 0
    return new

def render(grid):
    return "\n".join("".join("█" if cell else " " for cell in row) for row in grid)

def place_pattern(grid, pattern, r, c):
    for i, row in enumerate(pattern):
        for j, val in enumerate(row):
            if 0 <= r+i < len(grid) and 0 <= c+j < len(grid[0]):
                grid[r+i][c+j] = val

def main():
    rows, cols = 20, 50
    grid = create_grid(rows, cols)

    # Glider pattern
    glider = [
        [0,1,0],
        [0,0,1],
        [1,1,1],
    ]
    
    # Some gliders
    place_pattern(grid, glider, 1, 1)
    place_pattern(grid, glider, 10, 10)

    try:
        while True:
            os.system('cls' if os.name == 'nt' else 'clear')
            print(render(grid))
            grid = step(grid)
            time.sleep(0.15)

    except KeyboardInterrupt:
        print("\nStopped.")

if __name__ == "__main__":
    main()