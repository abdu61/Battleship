import domController from './domController.js';
import Player from './player.js';
import './styles.css';

let player;
let computer;
let isPlayerTurn = true;

function placeComputerShips() {
  const ships = [2, 3, 3, 4, 5];
  ships.forEach(length => {
    let placed = false;
    while (!placed) {
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      
      try {
        computer.board.placeShip([row, col], length, orientation);
        placed = true;
      } catch (e) {
        // Try again if placement failed
      }
    }
  });
}

function computerTurn() {
  if (!isPlayerTurn) {
    const [row, col] = computer.generateMove();
    const validMove = player.board.receiveAttack([row, col]);
    if (!validMove) {
      computerTurn(); // Try again if invalid move
      return;
    }
    
    if (player.board.allShipsSunk()) {
      domController.showMatchSummary('Computer');
      return;
    }
    
    isPlayerTurn = true;
    domController.renderBoards(player, computer);
  }
}

function handleAttack(row, col) {
  if (!isPlayerTurn) return;
  
  const validMove = computer.board.receiveAttack([row, col]);
  if (!validMove) return; // Ignore if invalid move
  
  domController.renderBoards(player, computer);
  
  if (computer.board.allShipsSunk()) {
    domController.showMatchSummary('You');
    return;
  }
  
  isPlayerTurn = false;
  setTimeout(computerTurn, 500);
}

function initGame() {
  // Reset game state
  if (player) player.board.reset();
  if (computer) computer.board.reset();
  
  // Create new players
  player = Player('real');
  computer = Player('computer');
  isPlayerTurn = true;
  
  // Setup new game
  placeComputerShips();
  domController.resetPlacement();
  domController.renderBoards(player, computer);
  domController.bindPlacementEvent(player);
  domController.bindAttackEvent(handleAttack);
  
  // Reset UI
  document.getElementById('match-summary').textContent = '';
  document.getElementById('status-message').textContent = 'Place your ships on your board';
}

document.getElementById('new-game').addEventListener('click', () => {
  initGame();
});

document.getElementById('start-game').addEventListener('click', () => {
  domController.enableAttackMode();
});

initGame();
