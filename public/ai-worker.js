const W = 3;
const H = 3;
const positionCount = W * H;
const emptyPieceIndex = (positionCount - 1).toString(); // '8'
const winningBoard = Array.from({ length: positionCount }, (_, k) => k.toString());

function findLegalMovesFromPos(emptyPos) {
  const legalMoves = [];
  const x = emptyPos % W;
  if (emptyPos >= W) legalMoves.push(emptyPos - W);
  if (x > 0) legalMoves.push(emptyPos - 1);
  if (x < (W - 1)) legalMoves.push(emptyPos + 1);
  if (emptyPos < 9 - W) legalMoves.push(emptyPos + W);
  return legalMoves;
}

function findLegalMoves(board) {
  const emptyPos = board.indexOf(emptyPieceIndex);
  return findLegalMovesFromPos(emptyPos);
}

function move(board, aMove) {
  const newBoard = board.slice();
  const emptyPos = newBoard.indexOf(emptyPieceIndex);
  newBoard[emptyPos] = board[aMove];
  newBoard[aMove] = emptyPieceIndex;
  return newBoard;
}

class Node {
  constructor(board, parent = null) {
    this.board = board;
    this.parent = parent;
    this.hash = board.join('');
    this.children = null;
  }
}

const nodeCache = new Map();
const pendingRequestsByBoard = Object.create(null);
let preparing = false;

function respondToRequests(hash, parentHash) {
  const ids = pendingRequestsByBoard[hash];
  if (!ids || !ids.length) return;
  const moveIndex = parentHash ? parentHash.indexOf(emptyPieceIndex) : -1;
  ids.forEach((id) => {
    self.postMessage({ type: 'bestMove', id, board: hash, move: moveIndex });
  });
  delete pendingRequestsByBoard[hash];
}

function prepare() {
  if (preparing) return;
  preparing = true;

  const work = [new Node(winningBoard)];
  let index = 0;

  while (index < work.length) {
    const node = work[index++];
    const hash = node.hash;
    if (!nodeCache.has(hash)) {
      const parentHash = node.parent ? node.parent.hash : null;
      nodeCache.set(hash, parentHash);

      const legalMoves = findLegalMoves(node.board);
      const positions = legalMoves.map((aMove) => move(node.board, aMove));
      node.children = positions.map((position) => new Node(position, node));
      node.children.forEach((child) => work.push(child));
      respondToRequests(hash, parentHash);
    }
  }

  preparing = false;
  self.postMessage({ type: 'prepared' });
}

function findBestMove(boardHash) {
  if (!preparing && nodeCache.size === 0) prepare();
  const parentHash = nodeCache.get(boardHash);
  if (!parentHash) return -1;
  return parentHash.indexOf(emptyPieceIndex);
}

self.onmessage = function (e) {
  const { type, board, id } = e.data || {};
  if (type === 'prepare') {
    prepare();
    return;
  }

  if (type === 'findBestMove') {
    if (nodeCache.has(board)) {
      const parentHash = nodeCache.get(board);
      const moveIndex = parentHash ? parentHash.indexOf(emptyPieceIndex) : -1;
      self.postMessage({ type: 'bestMove', id, board, move: moveIndex });
      return;
    }
    if (!pendingRequestsByBoard[board]) pendingRequestsByBoard[board] = [];
    pendingRequestsByBoard[board].push(id);
    if (!preparing) prepare();
  }
};
