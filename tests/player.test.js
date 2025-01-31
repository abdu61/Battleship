import Player from '../src/player';

test('creates player with correct type', () => {
  const player = Player('real');
  expect(player.type).toBe('real');
});

test('creates player with gameboard', () => {
  const player = Player('real');
  expect(player.board).toBeDefined();
});

test('computer player can generate valid moves', () => {
  const computer = Player('computer');
  const move = computer.generateMove();
  expect(move).toHaveLength(2);
  expect(move[0]).toBeGreaterThanOrEqual(0);
  expect(move[0]).toBeLessThan(10);
  expect(move[1]).toBeGreaterThanOrEqual(0);
  expect(move[1]).toBeLessThan(10);
});

test('board can be reset', () => {
  const player = Player('real');
  player.board.placeShip([0, 0], 2, 'horizontal');
  player.board.reset();
  expect(player.board.getShips().length).toBe(0);
});