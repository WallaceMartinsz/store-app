const SIZE = 25;
const FINDERS = [[0, 0], [SIZE - 7, 0], [0, SIZE - 7]];

const findFinder = (x, y) => FINDERS.find(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);

// Os tres quadrados dos cantos: borda cheia, anel vazio e miolo cheio
const finderCell = ([fx, fy], x, y) => {
  const dx = x - fx;
  const dy = y - fy;
  return Math.min(dx, dy, 6 - dx, 6 - dy) !== 1;
};

// Gerador simples e deterministico: o mesmo valor sempre desenha o mesmo "QR"
const buildCells = (value) => {
  let seed = 0;
  for (const char of value) {
    seed = (seed * 31 + char.charCodeAt(0)) >>> 0;
  }

  const cells = [];
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      seed = (seed * 1103515245 + 12345) >>> 0;
      const finder = findFinder(x, y);
      const filled = finder ? finderCell(finder, x, y) : (seed >>> 16) % 2 === 0;
      if (filled) cells.push([x, y]);
    }
  }
  return cells;
};

// QR code ilustrativo para a demonstracao do Pix; nao pode ser lido por um app de banco
const FakeQrCode = ({ value }) => (
  <svg
    className="h-[200px] w-[200px] rounded-lg max-[760px]:justify-self-center"
    viewBox={`-2 -2 ${SIZE + 4} ${SIZE + 4}`}
    role="img"
    aria-label="QR code ilustrativo do Pix"
  >
    <rect x="-2" y="-2" width={SIZE + 4} height={SIZE + 4} fill="#ffffff" />
    {buildCells(value).map(([x, y]) => (
      <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#0f1117" />
    ))}
  </svg>
);

export default FakeQrCode;
