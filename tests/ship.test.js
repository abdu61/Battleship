import Ship from '../src/ship';

test('creates ship with correct length', () => {
  const ship = Ship(3);
  expect(ship.getHits()).toBe(0);
});

test('initially not sunk', () => {
  const ship = Ship(3);
  expect(ship.isSunk()).toBe(false);
});

test('hit method increases hits count', () => {
  const ship = Ship(3);
  ship.hit();
  expect(ship.getHits()).toBe(1);
});

test('multiple hits are counted correctly', () => {
  const ship = Ship(3);
  ship.hit();
  ship.hit();
  expect(ship.getHits()).toBe(2);
});

test('isSunk returns true when hits equals length', () => {
  const ship = Ship(2);
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

test('isSunk returns false when hits less than length', () => {
  const ship = Ship(3);
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(false);
});