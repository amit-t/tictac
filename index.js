/**
 * This program is a boilerplate code for the standard tic tac toe game
 * Here the “box” represents one placeholder for either a “X” or a “0”
 * We have a 2D array to represent the arrangement of X or O is a grid
 * 0 -> empty box
 * 1 -> box with X
 * 2 -> box with O
 *
 * Below are the tasks which needs to be completed:
 * Imagine you are playing with the computer so every alternate move should be done by the computer
 * X -> player
 * O -> Computer
 *
 * Winner needs to be decided and has to be flashed
 *
 * Extra points will be given for approaching the problem more creatively
 *
 */

const grid = [];
const GRID_LENGTH = 3;
// No. of plays played till now
let plays = 0;
// Player win is 1 for human player and 2 for computer
let playerWin = 0;
// Player play value set to 1 ('X')
const playerValue = 1;
// Computer play value set to 2 ('O')
const computerValue = 2;

function initializeGrid() {
  for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
    const tempArray = [];
    for (let rowIdx = 0; rowIdx < GRID_LENGTH; rowIdx++) {
      tempArray.push(0);
    }
    grid.push(tempArray);
  }
  console.log(grid);
}

function getRowBoxes(colIdx) {
  let rowDivs = '';

  for (let rowIdx = 0; rowIdx < GRID_LENGTH; rowIdx++) {
    let additionalClass = 'darkBackground';
    let content = '';
    const sum = colIdx + rowIdx;
    if (sum % 2 === 0) {
      additionalClass = 'lightBackground'
    }
    const gridValue = grid[colIdx][rowIdx];
    if (gridValue === 1) {
      content = '<span class="cross">X</span>';
    }
    else if (gridValue === 2) {
      content = '<span class="cross">O</span>';
    }
    rowDivs = rowDivs + '<div colIdx="' + colIdx + '" rowIdx="' + rowIdx + '" class="box ' +
      additionalClass + '">' + content + '</div>';
  }
  return rowDivs;
}

function getColumns() {
  let columnDivs = '';
  for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
    let colDiv = getRowBoxes(colIdx);
    colDiv = '<div class="rowStyle">' + colDiv + '</div>';
    columnDivs = columnDivs + colDiv;
  }
  return columnDivs;
}

function renderMainGrid() {
  const parent = document.getElementById("grid");
  const columnDivs = getColumns();
  parent.innerHTML = '<div class="columnsStyle">' + columnDivs + '</div>';
}

function onBoxClick() {
  let rowIdx = this.getAttribute("rowIdx");
  let colIdx = this.getAttribute("colIdx");
  if (grid[colIdx][rowIdx] === 0) {
    grid[colIdx][rowIdx] = playerValue;
    // Increment no. of plays
    plays++;
    renderMainGrid();
    addClickHandlers();
    // Check if there is a winner
    checkWinner();
    // Init Computer play
    computerPlay();
  }
}

function computerPlay() {
  let colIdx = Math.floor(Math.random() * GRID_LENGTH);
  let rowIdx = Math.floor(Math.random() * GRID_LENGTH);
  // Search for an empty grid
  if (grid[colIdx][rowIdx] === 0) {
    grid[colIdx][rowIdx] = computerValue;
    // Increment no. of plays
    plays++;
    checkWinner();
    renderMainGrid();
    addClickHandlers();
    return;
  }
  if (plays < 9) {
    computerPlay();
  }
}

function checkWinner() {
  // If no. of plays are less that 5 meaning no player has completed three moves yet,
  // a winner check is not needed in such case
  if (plays < 5 || playerWin > 0) {
    return;
  }
  let colIdx, rowIdx = 0;

  for (colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
    for (rowIdx = 0; rowIdx < GRID_LENGTH; rowIdx++) {
      if (grid[colIdx][0] === grid[colIdx][1] && grid[colIdx][1] === grid[colIdx][2]) {
        playerWin = grid[colIdx][0];
      }
      if (grid[0][rowIdx] === grid[1][rowIdx] && grid[1][rowIdx] === grid[2][rowIdx]) {
        playerWin = grid[rowIdx][0];
      }
      // Checking for Top Diagonal
      if (colIdx === rowIdx) {
        if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
          playerWin = grid[rowIdx][0];
        }
      }
      if ((colIdx + rowIdx) === 2) {
        if (grid[2][0] === grid[1][1] && grid[1][1] === grid[0][2]) {
          playerWin = grid[rowIdx][0];
        }
      }
      if (playerWin > 0) {
        // Declare Winner
        const result_message = playerWin === 1 ? `You have won! Good Job!` : `Computer has won! You lost!`
        const result = document.getElementById("result-message");
        result.innerHTML = result_message;
        result.style.display = 'flex';
        // Stop further runs of loop as winner has been identified
        return;
      }
    }
  }
  if (plays === 9 && playerWin === 0) {
    // Declare Draw
    const result_message = `Aww! It's a tie!`;
    const result = document.getElementById("result-message");
    result.innerHTML = result_message;
    result.style.display = 'flex';
  }
}

function addClickHandlers() {
  let boxes = document.getElementsByClassName("box");
  for (let idx = 0; idx < boxes.length; idx++) {
    boxes[idx].addEventListener('click', onBoxClick, false);
  }
}

function initPlay() {
  initializeGrid();
  renderMainGrid();
  addClickHandlers();
  const result = document.getElementById("result-message");
  result.style.display = 'none';
}

function restart() {
  location.reload();
}

initPlay();

