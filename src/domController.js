let defaultShips = [2, 3, 3, 4, 5];
let shipLengthsToPlace = [...defaultShips];
let placingMode = true;

const domController = (() => {
  let playerBoardListener = null;
  let computerBoardListener = null;

  const cleanup = () => {
    const playerBoard = document.getElementById('player-board');
    const computerBoard = document.getElementById('computer-board');
    
    if (playerBoardListener) {
      playerBoard.removeEventListener('click', playerBoardListener);
    }
    if (computerBoardListener) {
      computerBoard.removeEventListener('click', computerBoardListener);
    }
    
    playerBoard.innerHTML = '';
    computerBoard.innerHTML = '';
  };

  const resetPlacement = () => {
    cleanup();
    shipLengthsToPlace = [...defaultShips];
    placingMode = true;
    updateStatusMessage();
  };

  const updateStatusMessage = () => {
    const statusElem = document.getElementById('status-message');
    statusElem.textContent = placingMode ? 
      'Place your ships on your board' : 
      'Game Started - Attack the enemy board!';
  };

  const showMatchSummary = (winner) => {
    const statusElem = document.getElementById('status-message');
    statusElem.textContent = `${winner} win! Game over.`;
  };

  const renderBoard = (boardElem, board, showShips = false) => {
    boardElem.innerHTML = '';
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = document.createElement('div');
        cell.setAttribute('data-row', row);
        cell.setAttribute('data-col', col);
        
        // Add ships if allowed
        if (showShips) {
          const hasShip = board.getShips().some(({coords}) => 
            coords.some(c => c[0] === row && c[1] === col)
          );
          if (hasShip) cell.classList.add('ship-cell');
        }
        
        // Show hits and misses
        const isHit = board.getSuccessfulHits().some(hit => 
          hit[0] === row && hit[1] === col
        );
        const isMiss = board.getMissedAttacks().some(miss => 
          miss[0] === row && miss[1] === col
        );
        
        if (isHit) cell.classList.add('ship-hit');
        if (isMiss) cell.classList.add('miss');
        
        boardElem.appendChild(cell);
      }
    }
  };

  const renderBoards = (player1, player2) => {
    const playerBoard = document.getElementById('player-board');
    const computerBoard = document.getElementById('computer-board');
    
    renderBoard(playerBoard, player1.board, true);  // Always show player ships
    if (player2) {
      renderBoard(computerBoard, player2.board, false);  // Never show computer ships
    }
  };

  const enableAttackMode = () => {
    placingMode = false;
    updateStatusMessage();
  };

  const bindPlacementEvent = (player) => {
    const playerBoard = document.getElementById('player-board');
    playerBoardListener = (e) => {
      if (!placingMode || shipLengthsToPlace.length === 0) return;
      const index = [...playerBoard.children].indexOf(e.target);
      if (index > -1) {
        const row = Math.floor(index / 10);
        const col = index % 10;
        const shipLength = shipLengthsToPlace[0];
        try {
          const orientationSelect = document.getElementById('ship-orientation');
          player.board.placeShip([row, col], shipLength, orientationSelect.value);
          shipLengthsToPlace.shift();
          renderBoards(player, null);
        } catch (e) {
          // Invalid placement, do nothing
        }
      }
    };
    playerBoard.addEventListener('click', playerBoardListener);
  };

  const bindAttackEvent = (callback) => {
    const computerBoard = document.getElementById('computer-board');
    computerBoardListener = (e) => {
      if (placingMode) return;
      const index = [...computerBoard.children].indexOf(e.target);
      if (index > -1) {
        const row = Math.floor(index / 10);
        const col = index % 10;
        callback(row, col);
      }
    };
    computerBoard.addEventListener('click', computerBoardListener);
  };

  return {
    renderBoards,
    bindPlacementEvent,
    bindAttackEvent,
    enableAttackMode,
    resetPlacement,
    showMatchSummary,
  };
})();

export default domController;