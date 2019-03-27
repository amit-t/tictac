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

/**
 * Evaluation State weights
 *
 * -1 => Draw
 * 0  => No Cells marked
 *
 * 1  => 1 cell marked, win
 * 2  => >=2 cell marked, win
 * 3  => winning
 * 4  => 1 cell marked, lose
 * 5  => >=2 cell marked, lose
 * 6  => losing
 *
 */

const GRID_LENGTH = 5;
const grid = [];
const box_indices = [];

// Game state array to maintain the states of each winning combo
const states = [];
// Array to store winning scenarios for grid of any length
const win_scenarios = [];
// No. of plays played till now
let plays = 0;
// Player win is 1 for human player and 2 for computer
let playerWin = 0;
// Player play value set to 1 ('X')
const playerValue = 1;
// Computer play value set to 2 ('O')
const computerValue = 2;

function initializeGrid() {
  let counter = 0;
  for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
    const tempArray = [];
    for (let rowIdx = 0; rowIdx < GRID_LENGTH; rowIdx++) {
      tempArray.push(0);
      box_indices[counter] = [colIdx, rowIdx];
      counter++;
    }
    grid.push(tempArray);
  }
  console.log("Main Grid", grid);
  console.log("Box Indices", box_indices);
  computeWinScenarios();
}

function computeWinScenarios() {
  let colIdx, rowIdx = 0;
  let scenario = [];
  // For Horizontal win Scenarios
  for (colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
    for (rowIdx = 0; rowIdx < GRID_LENGTH; rowIdx++) {
      // let win_index = (colIdx * (GRID_LENGTH)) + rowIdx;
      let win_index = getIndex(colIdx, rowIdx);
      scenario.push(win_index);
      if (scenario.length === GRID_LENGTH) {
        win_scenarios.push(scenario);
        scenario = [];
      }
    }
  }
  // For Vertical win Scenarios
  rowIdx = 0;
  scenario = [];
  while (rowIdx < GRID_LENGTH) {
    for (colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
      // let win_index = (colIdx * (GRID_LENGTH)) + rowIdx;
      let win_index = getIndex(colIdx, rowIdx);
      scenario.push(win_index);
      if (scenario.length === GRID_LENGTH) {
        win_scenarios.push(scenario);
        scenario = [];
      }
    }
    rowIdx++;
  }
  // For Top Diagonal win Scenarios
  rowIdx = 0;
  scenario = [];
  let win_index = 0;
  for (rowIdx; rowIdx < GRID_LENGTH; rowIdx++) {
    if (rowIdx === 0) {
      win_index = (rowIdx * (GRID_LENGTH + 1));
    } else {
      win_index = win_index + (GRID_LENGTH + 1);
    }
    scenario.push(win_index);
    if (scenario.length === GRID_LENGTH) {
      win_scenarios.push(scenario);
      scenario = [];
    }
  }
  // For Bottom Diagonal win Scenarios
  rowIdx = 0;
  scenario = [];
  win_index = 0;
  for (rowIdx; rowIdx < GRID_LENGTH; rowIdx++) {
    if (rowIdx === 0) {
      win_index = (rowIdx + (GRID_LENGTH - 1)) + rowIdx;
    } else {
      win_index = win_index + (GRID_LENGTH - 1);
    }
    scenario.push(win_index);
    if (scenario.length === GRID_LENGTH) {
      win_scenarios.push(scenario);
      scenario = [];
    }
  }
  console.log("Win Scenarios", win_scenarios);
  generateStates();
}

function generateStates() {
  for (let i = 0; i < win_scenarios.length; i++) {
    states.push(0);
  }
  console.log("States", states);
}

function onPlayerPlay() {
  let rowIdx = parseInt(this.getAttribute("rowIdx"));
  let colIdx = parseInt(this.getAttribute("colIdx"));
  if (grid[colIdx][rowIdx] === 0) {
    grid[colIdx][rowIdx] = playerValue;
    // Increment no. of plays
    plays++;
    // Evaluate States
    evaluateStates(colIdx, rowIdx, playerValue);
    if (playerWin === 0) {
      // Init Computer play
      onComputerPlay();
    }
  }
}

function onComputerPlay() {
  console.log("Computer Play State", states);
  if (states.every((value) => {
    return (value === -1);
  })) {
    declareDraw();
  }
  // Get the most appropriate state for the computer to play at
  let state_index = null;
  // Check if it's the first move
  if (plays === 1) {
    // Check if middle most box is played or not as that is the most powerful play
    let middle_box_index = Math.floor((box_indices.length - 1) / 2);
    let [colIdx, rowIdx] = box_indices[middle_box_index];
    if (grid[colIdx][rowIdx] === 0) {
      grid[colIdx][rowIdx] = computerValue;
      // Increment no. of plays
      plays++;
      // Evaluate States
      evaluateStates(colIdx, rowIdx, computerValue);
      return;
    }
  }
  // First search for a winning state [3  => winning] and make winning move
  if (states.indexOf(3) > -1) {
    state_index = states.indexOf(3);
    let scenarios = win_scenarios[state_index];
    for (let i = 0; i < scenarios.length; i++) {
      let box_index = scenarios[i];
      let [colIdx, rowIdx] = box_indices[box_index];
      if (grid[colIdx][rowIdx] === 0) {
        grid[colIdx][rowIdx] = computerValue;
        // Increment no. of plays
        plays++;
        // Evaluate States NOT NEEDED. This is a clear win if the move was possible
        // Declare Winner
        playerWin = 2;
        declareWinner(playerWin);
        break;
      }
    }
    return;
  }
  // Second search for a losing state [6  => losing] and sabotage
  if (states.indexOf(6) > -1) {
    state_index = states.indexOf(6);
    let scenarios = win_scenarios[state_index];
    for (let i = 0; i < scenarios.length; i++) {
      let box_index = scenarios[i];
      let [colIdx, rowIdx] = box_indices[box_index];
      if (grid[colIdx][rowIdx] === 0) {
        grid[colIdx][rowIdx] = computerValue;
        // Increment no. of plays
        plays++;
        // Evaluate States
        evaluateStates(colIdx, rowIdx, computerValue);
        break;
      }
    }
    return;
  }
  // Third search for state [2  => >=2 cell marked, win]. This will never occur in a GRID_LENGTH < 5
  if (states.indexOf(2) > -1) {
    state_index = states.indexOf(2);
    let scenarios = win_scenarios[state_index];
    for (let i = 0; i < scenarios.length; i++) {
      let box_index = scenarios[i];
      let [colIdx, rowIdx] = box_indices[box_index];
      if (grid[colIdx][rowIdx] === 0) {
        grid[colIdx][rowIdx] = computerValue;
        // Increment no. of plays
        plays++;
        // Evaluate States
        evaluateStates(colIdx, rowIdx, computerValue);
        break;
      }
    }
    return;
  }
  // Fourth search for state [1  => 1 cell marked, win].
  if (states.indexOf(1) > -1) {
    state_index = states.indexOf(1);
    let scenarios = win_scenarios[state_index];
    for (let i = 0; i < scenarios.length; i++) {
      let box_index = scenarios[i];
      let [colIdx, rowIdx] = box_indices[box_index];
      if (grid[colIdx][rowIdx] === 0) {
        grid[colIdx][rowIdx] = computerValue;
        // Increment no. of plays
        plays++;
        // Evaluate States
        evaluateStates(colIdx, rowIdx, computerValue);
        break;
      }
    }
    return;
  }
  // Seventh search for state [0  => No Cells marked].
  if (states.indexOf(0) > -1) {
    state_index = states.indexOf(0);
    let scenarios = win_scenarios[state_index];
    for (let i = 0; i < scenarios.length; i++) {
      let box_index = scenarios[i];
      let [colIdx, rowIdx] = box_indices[box_index];
      if (grid[colIdx][rowIdx] === 0) {
        grid[colIdx][rowIdx] = computerValue;
        // Increment no. of plays
        plays++;
        // Evaluate States
        evaluateStates(colIdx, rowIdx, computerValue);
        break;
      }
    }
    return;
  }
  // Fifth search for state [4  => 1 cell marked, lose]. Make a draw move
  if (states.indexOf(4) > -1) {
    state_index = states.indexOf(4);
    let scenarios = win_scenarios[state_index];
    for (let i = 0; i < scenarios.length; i++) {
      let box_index = scenarios[i];
      let [colIdx, rowIdx] = box_indices[box_index];
      if (grid[colIdx][rowIdx] === 0) {
        grid[colIdx][rowIdx] = computerValue;
        // Increment no. of plays
        plays++;
        // Evaluate States
        evaluateStates(colIdx, rowIdx, computerValue);
        break;
      }
    }
    return;
  }
  // Sixth search for state [5  => >=2 cell marked, lose]. This will never occur in a GRID_LENGTH < 5
  if (states.indexOf(5) > -1) {
    state_index = states.indexOf(5);
    let scenarios = win_scenarios[state_index];
    for (let i = 0; i < scenarios.length; i++) {
      let box_index = scenarios[i];
      let [colIdx, rowIdx] = box_indices[box_index];
      if (grid[colIdx][rowIdx] === 0) {
        grid[colIdx][rowIdx] = computerValue;
        // Increment no. of plays
        plays++;
        // Evaluate States
        evaluateStates(colIdx, rowIdx, computerValue);
        break;
      }
    }
    return;
  }
  // Eighth search for state [-1 => Draw].
  if (states.indexOf(-1) > -1) {
    state_index = states.indexOf(-1);
    let scenarios = win_scenarios[state_index];
    for (let i = 0; i < scenarios.length; i++) {
      let box_index = scenarios[i];
      let [colIdx, rowIdx] = box_indices[box_index];
      if (grid[colIdx][rowIdx] === 0) {
        grid[colIdx][rowIdx] = computerValue;
        // Increment no. of plays
        plays++;
        // Evaluate States
        evaluateStates(colIdx, rowIdx, computerValue);
        break;
      }
    }
    // No return needed at this point
  }
}

function evaluateStates(colIdx, rowIdx, play) {
  renderMainGrid();
  addClickHandlers();
  if (states.every((value) => {
    return (value === -1);
  })) {
    declareDraw();
  }
  const index = getIndex(colIdx, rowIdx);
  // Find the index in the winning scenarios
  for (let i = 0; i < win_scenarios.length; i++) {
    if (win_scenarios[i].indexOf(index) !== -1) {
      // Get the state based on winning scenarios and update the states
      let current_state = states[i];
      // Check if play was by player
      if (play === 1) {
        switch (current_state) {
          case 0:
            states[i] = 4;
            break;
          case 4:
            (GRID_LENGTH > 3) ? states[i] = 5 : states[i] = 6;
            break;
          case 5:
            states[i] = 6;
            break;
          case 6:
            // Declare Winner
            playerWin = 1;
            declareWinner(playerWin);
            return;
          default:
            states[i] = -1;
            break;
        }
      }
      // Check if play was by computer
      if (play === 2) {
        switch (current_state) {
          case 0:
            states[i] = 1;
            break;
          case 1:
            (GRID_LENGTH > 3) ? states[i] = 2 : states[i] = 3;
            break;
          case 2:
            states[i] = 3;
            break;
          case 3:
            // Declare Winner
            playerWin = 2;
            declareWinner(playerWin);
            return;
          default:
            states[i] = -1;
            break;
        }
      }
    }
  }
  console.log("Updated State", states);
}

function getIndex(colIdx, rowIdx) {
  return Math.floor((colIdx * GRID_LENGTH) + rowIdx);
}

function declareWinner(playerWin) {
  renderMainGrid();
  addClickHandlers();
  // Declare Winner
  const result_message = playerWin === 1 ? `You have won! Good Job!` : `Computer has won! You lost!`;
  const result = document.getElementById("result-message");
  result.innerHTML = result_message;
  result.style.display = 'flex';
}

function declareDraw() {
  renderMainGrid();
  addClickHandlers();
  // Declare Winner
  const result_message = `Aww! It's a draw!`;
  const result = document.getElementById("result-message");
  result.innerHTML = result_message;
  result.style.display = 'flex';
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

function addClickHandlers() {
  let boxes = document.getElementsByClassName("box");
  for (let idx = 0; idx < boxes.length; idx++) {
    boxes[idx].addEventListener('click', onPlayerPlay, false);
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

