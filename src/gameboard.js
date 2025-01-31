import Ship from './ship.js';

export default function Gameboard() {
  let ships = [];
  let missedAttacks = [];
  let successfulHits = [];
  let allAttacks = [];

  const reset = () => {
    ships = [];
    missedAttacks = [];
    successfulHits = [];
    allAttacks = [];
  };

  const isValidPlacement = (coords) => {
    // Check if ship would go off board
    if (coords.some(([row, col]) => row < 0 || row > 9 || col < 0 || col > 9)) {
      return false;
    }
    
    // Check if ship would overlap with existing ships
    return !coords.some(([row, col]) => 
      ships.some(({coords: shipCoords}) => 
        shipCoords.some(([r, c]) => r === row && c === col)
      )
    );
  };

  const placeShip = (startCoord, length, orientation) => {
    const coords = [];
    for (let i = 0; i < length; i++) {
      if (orientation === 'horizontal') {
        coords.push([startCoord[0], startCoord[1] + i]);
      } else {
        coords.push([startCoord[0] + i, startCoord[1]]);
      }
    }
    
    if (!isValidPlacement(coords)) {
      throw new Error('Invalid ship placement');
    }

    ships.push({
      ship: Ship(length),
      coords,
      orientation,
    });
  };

  const receiveAttack = (coord) => {
    const attackKey = `${coord[0]},${coord[1]}`;
    if (allAttacks.includes(attackKey)) {
      return false;
    }
    allAttacks.push(attackKey);

    let hitSomething = false;
    ships.forEach(({ ship, coords }) => {
      coords.forEach(c => {
        if (c[0] === coord[0] && c[1] === coord[1]) {
          ship.hit();
          hitSomething = true;
          successfulHits.push(coord);
        }
      });
    });
    
    if (!hitSomething) {
      missedAttacks.push(coord);
    }
    return true;
  };

  const allShipsSunk = () => {
    // Get total number of ship cells
    const totalShipCells = ships.reduce((sum, { coords }) => sum + coords.length, 0);
    // Compare with number of successful hits
    return successfulHits.length === totalShipCells;
  };

  const getShips = () => ships;
  const getMissedAttacks = () => missedAttacks;
  const getSuccessfulHits = () => successfulHits;

  return {
    placeShip,
    receiveAttack,
    allShipsSunk,
    getShips,
    getMissedAttacks,
    getSuccessfulHits,
    reset,
  };
}