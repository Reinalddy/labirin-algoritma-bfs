const rows = 10;
const cols = 10;
const mazeElement = document.getElementById("maze");
const resultElement = document.getElementById("result");

let maze = Array.from({ length: rows }, () => Array(cols).fill(0));
let start = null;
let end = null;

// Render maze
function renderMaze() {
  mazeElement.innerHTML = "";
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (maze[i][j] === 1) cell.classList.add("wall");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", () => handleCellClick(i, j));
      mazeElement.appendChild(cell);
    }
  }
}

// Handle cell click
function handleCellClick(row, col) {
  const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
  if (!start) {
    start = [row, col];
    cell.classList.add("start");
  } else if (!end) {
    end = [row, col];
    cell.classList.add("end");
  } else {
    maze[row][col] = maze[row][col] === 0 ? 1 : 0; // Toggle wall
    cell.classList.toggle("wall");
  }
}

// Find shortest path using BFS
function findShortestPath() {
  if (!start || !end) {
    resultElement.textContent = "Silakan pilih titik Start dan End terlebih dahulu!";
    return;
  }

  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
  ];
  const queue = [[...start, []]];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  visited[start[0]][start[1]] = true;

  while (queue.length) {
    const [x, y, path] = queue.shift();
    const newPath = [...path, [x, y]];

    if (x === end[0] && y === end[1]) {
      markPath(newPath);
      resultElement.textContent = "Jalur ditemukan!";
      return;
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 && ny >= 0 &&
        nx < rows && ny < cols &&
        maze[nx][ny] === 0 &&
        !visited[nx][ny]
      ) {
        visited[nx][ny] = true;
        queue.push([nx, ny, newPath]);
      }
    }
  }

  resultElement.textContent = "Jalur tidak ditemukan!";
}

// Mark the shortest path on the maze
function markPath(path) {
  for (const [x, y] of path) {
    const cell = document.querySelector(`.cell[data-row='${x}'][data-col='${y}']`);
    if (cell && !cell.classList.contains("start") && !cell.classList.contains("end")) {
      cell.classList.add("path");
    }
  }
}

// Reset maze
function resetMaze() {
  start = null;
  end = null;
  maze = Array.from({ length: rows }, () => Array(cols).fill(0));
  resultElement.textContent = "";
  renderMaze();
}

// Event listeners
document.getElementById("findPath").addEventListener("click", findShortestPath);
document.getElementById("reset").addEventListener("click", resetMaze);

// Initial render
renderMaze();