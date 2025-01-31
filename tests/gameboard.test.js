import Gameboard from '../src/gameboard';

test('can place ship horizontally', () => {
  const board = Gameboard();
  board.placeShip([0, 0], 3, 'horizontal');
  const ships = board.getShips();
  expect(ships.length).toBe(1);
  expect(ships[0].coords.length).toBe(3);
  expect(ships[0].coords).toEqual([[0,0], [0,1], [0,2]]);
});

test('can place ship vertically', () => {
  const board = Gameboard();
  board.placeShip([0, 0], 3, 'vertical');
  const ships = board.getShips();
  expect(ships[0].coords).toEqual([[0,0], [1,0], [2,0]]);
});

test('prevents invalid horizontal placement off board', () => {
  const board = Gameboard();
  expect(() => {
    board.placeShip([0, 8], 3, 'horizontal');
  }).toThrow();
});

test('prevents invalid vertical placement off board', () => {
  const board = Gameboard();
  expect(() => {
    board.placeShip([8, 0], 3, 'vertical');
  }).toThrow();
});

test('prevents overlapping ships', () => {
  const board = Gameboard();
  board.placeShip([0, 0], 3, 'horizontal');
  expect(() => {
    board.placeShip([0, 1], 3, 'vertical');
  }).toThrow();
});

test('registers successful hit', () => {
  const board = Gameboard();
  board.placeShip([0, 0], 2, 'horizontal');
  const result = board.receiveAttack([0, 0]);
  expect(result).toBe(true);
  expect(board.getSuccessfulHits().length).toBe(1);
  expect(board.getMissedAttacks().length).toBe(0);
});

test('registers missed attack', () => {
  const board = Gameboard();
  board.placeShip([0, 0], 2, 'horizontal');
  const result = board.receiveAttack([1, 1]);
  expect(result).toBe(true);
  expect(board.getMissedAttacks().length).toBe(1);
  expect(board.getSuccessfulHits().length).toBe(0);
});

test('prevents duplicate attacks', () => {
  const board = Gameboard();
  board.placeShip([0, 0], 2, 'horizontal');
  board.receiveAttack([0, 0]);
  const result = board.receiveAttack([0, 0]);
  expect(result).toBe(false);
});

test('reports when all ships are sunk', () => {
  const board = Gameboard();
  board.placeShip([0, 0], 2, 'horizontal');
  board.receiveAttack([0, 0]);
  board.receiveAttack([0, 1]);
  expect(board.allShipsSunk()).toBe(true);
});

test('reset clears all board state', () => {
  const board = Gameboard();
  board.placeShip([0, 0], 2, 'horizontal');
  board.receiveAttack([0, 0]);
  board.reset();
  expect(board.getShips().length).toBe(0);
  expect(board.getMissedAttacks().length).toBe(0);
  expect(board.getSuccessfulHits().length).toBe(0);
});