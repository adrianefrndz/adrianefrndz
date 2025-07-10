// 2048 Game logic for portfolio
const size = 4;
let board, score;
const canvas = document.getElementById('canvas-2048');
const ctx = canvas ? canvas.getContext('2d') : null;
const tileColors = {
  0: '#333', 2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563', 32: '#f67c5f', 64: '#f65e3b',
  128: '#edcf72', 256: '#edcc61', 512: '#edc850', 1024: '#edc53f', 2048: '#edc22e'
};
function drawBoard() {
  if (!ctx) return;
  ctx.clearRect(0,0,300,300);
  for (let r=0;r<size;r++) for (let c=0;c<size;c++) {
    ctx.fillStyle = tileColors[board[r][c]] || '#3c3a32';
    ctx.fillRect(c*75+5, r*75+5, 65, 65);
    ctx.font = 'bold 24px Roboto,Arial';
    ctx.fillStyle = board[r][c] ? '#222' : '#aaa';
    if (board[r][c]) ctx.fillText(board[r][c], c*75+32, r*75+45);
  }
}
function addTile() {
  let empty = [];
  for (let r=0;r<size;r++) for (let c=0;c<size;c++) if (!board[r][c]) empty.push([r,c]);
  if (empty.length) {
    let [r,c] = empty[Math.floor(Math.random()*empty.length)];
    board[r][c] = Math.random()<0.9?2:4;
  }
}
function reset2048() {
  board = Array.from({length:size},()=>Array(size).fill(0));
  score = 0;
  addTile(); addTile();
  drawBoard();
}
function move(dir) {
  let moved = false;
  function processLine(line) {
    let arr = line.filter(x => x !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        score += arr[i];
        arr[i + 1] = 0;
        i++;
      }
    }
    arr = arr.filter(x => x !== 0);
    while (arr.length < size) arr.push(0);
    return arr;
  }
  let oldBoard = JSON.parse(JSON.stringify(board));
  if (dir === 'left') {
    for (let r = 0; r < size; r++) {
      let newRow = processLine(board[r]);
      board[r] = newRow;
    }
  } else if (dir === 'right') {
    for (let r = 0; r < size; r++) {
      let newRow = processLine(board[r].slice().reverse()).reverse();
      board[r] = newRow;
    }
  } else if (dir === 'up') {
    for (let c = 0; c < size; c++) {
      let col = [];
      for (let r = 0; r < size; r++) col.push(board[r][c]);
      let newCol = processLine(col);
      for (let r = 0; r < size; r++) board[r][c] = newCol[r];
    }
  } else if (dir === 'down') {
    for (let c = 0; c < size; c++) {
      let col = [];
      for (let r = 0; r < size; r++) col.push(board[r][c]);
      let newCol = processLine(col.reverse()).reverse();
      for (let r = 0; r < size; r++) board[r][c] = newCol[r];
    }
  }
  // Check if board changed
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] !== oldBoard[r][c]) moved = true;
    }
  }
  if (moved) { addTile(); drawBoard(); }
}
document.addEventListener('keydown',function(e){
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){
    e.preventDefault();
    move(e.key.replace('Arrow','').toLowerCase());
  }
});

// Expose functions for mobile button controls
window.move = move;
window.reset2048 = reset2048;

if (canvas) reset2048();

// Touch controls for mobile (swipe) are now replaced by on-screen arrows for phones.
