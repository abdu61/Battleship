export default function Ship(length) {
  let hits = 0;

  const hit = () => {
    hits += 1;
  };

  const isSunk = () => hits >= length;
  const getHits = () => hits;

  return {
    hit,
    isSunk,
    getHits,
  };
}