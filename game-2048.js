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
  let merged = Array.from({length:size},()=>Array(size).fill(false));
  function slide(r1,c1,r2,c2) {
    if (board[r2][c2]===0 && board[r1][c1]!==0) {
      board[r2][c2]=board[r1][c1]; board[r1][c1]=0; moved=true;
    }
  }
  function merge(r1,c1,r2,c2) {
    if (board[r1][c1] && board[r1][c1]===board[r2][c2] && !merged[r2][c2] && !merged[r1][c1]) {
      board[r2][c2]*=2; board[r1][c1]=0; score+=board[r2][c2]; merged[r2][c2]=true; moved=true;
    }
  }
  for (let i=0;i<size;i++) {
    for (let j=0;j<size;j++) {
      let r=dir==='up'?j:dir==='down'?size-1-j:i;
      let c=dir==='left'?j:dir==='right'?size-1-j:i;
      if (dir==='up'||dir==='down') {
        for (let k=r;k>0&&dir==='up'||k<size-1&&dir==='down';dir==='up'?k--:k++) slide(k,c,k-(dir==='up'?1:-1),c);
        for (let k=r;k>0&&dir==='up'||k<size-1&&dir==='down';dir==='up'?k--:k++) merge(k,c,k-(dir==='up'?1:-1),c);
        for (let k=r;k>0&&dir==='up'||k<size-1&&dir==='down';dir==='up'?k--:k++) slide(k,c,k-(dir==='up'?1:-1),c);
      } else {
        for (let k=c;k>0&&dir==='left'||k<size-1&&dir==='right';dir==='left'?k--:k++) slide(r,k,r,k-(dir==='left'?1:-1));
        for (let k=c;k>0&&dir==='left'||k<size-1&&dir==='right';dir==='left'?k--:k++) merge(r,k,r,k-(dir==='left'?1:-1));
        for (let k=c;k>0&&dir==='left'||k<size-1&&dir==='right';dir==='left'?k--:k++) slide(r,k,r,k-(dir==='left'?1:-1));
      }
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
if (canvas) reset2048();

// Touch controls for mobile
if (canvas) {
  let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
  canvas.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  });
  canvas.addEventListener('touchmove', function(e) {
    if (e.touches.length === 1) {
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY;
    }
  });
  canvas.addEventListener('touchend', function(e) {
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) move('right');
        else move('left');
      } else {
        if (dy > 0) move('down');
        else move('up');
      }
    }
  });
}
