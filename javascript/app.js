import Grid from "./grid.js";
import Tile from "./tile.js";


const gameBoard = document.getElementById('game-board');
const grid = new Grid(gameBoard);

grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

setupInput();

function setupInput() {
  window.addEventListener('keydown', handleInput, { once: true });
}

async function handleInput(e) {
  switch (e.key) {
    case 'ArrowUp':
      await moveUp();
      break;
    case 'ArrowDown':
      await moveDown();
      break;
    case 'ArrowLeft':
      await moveLeft();
      break;
    case 'ArrowRight':
      await moveRight();
      break;
    default:
      setupInput();
      return;
  }

  grid.cells.forEach(cell => cell.mergeTiles());
  grid.randomEmptyCell().tile = new Tile(gameBoard);

  setupInput();
}

function moveUp() {
  return slideTiles(grid.cellsbyColumn());
};

function moveDown() {
  return slideTiles(grid.cellsbyColumn().map(column => [...column].reverse()));
};

function moveLeft() {
  return slideTiles(grid.cellsbyRow());
};

function moveRight() {
  return slideTiles(grid.cellsbyRow().map(row => [...row].reverse()));
};

function slideTiles(cells) {
  return Promise.all(
  cells.flatMap(group => {
    const promises = [];
    for(let i=1; i < group.length; i++) {
      const cell = group[i];
      if (cell.tile == null) continue;
      let lastValidCell;
      for( let j = i-1; j >=0; j--) {
        const moveToCell = group[j];
        if(!moveToCell.canAccept(cell.tile)) break;
        lastValidCell = moveToCell;
      }

      if (lastValidCell != null) {
        promises.push(cell.tile.waitForTransition());
        if (lastValidCell.tile != null) {
          lastValidCell.mergeTile = cell.tile;
        } else {
          lastValidCell.tile = cell.tile;
        }
        cell.tile = null;
      }

      return promises;
    }
  })); 
}
