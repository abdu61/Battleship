import Gameboard from './gameboard.js';

export default function Player(type) {
  const board = Gameboard();

  const generateMove = () => {
    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10);
    return [row, col];
  };

  return {
    type,
    board,
    generateMove,
  };
}