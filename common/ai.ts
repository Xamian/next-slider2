import { Piece } from "../components/game/board/Piece";
import { Board } from "../components/game/board";

const W = 3;
const H = 3;
const positionCount = W * H;
const emptyPieceIndex = positionCount - 1; // 8
const winningBoard = [...Array(positionCount)].map((_, k) => k); // 0,1,2...,8

function calcHash(board: number[]): number {
  const m1 = board.map((p, k) => {
    return p * Math.pow(10, positionCount - 1 - k)
  });
  const r1 = m1.reduce((acc, cur) => {
    acc += cur;
    return acc;
  });
  return r1;
}

class Node {
  hash: number; // 12345678 - 876543210
  children: Node[];
  constructor(public board: number[], public parent: Node = null) {
    this.hash = calcHash(board)
  }
  // getEmptyPos(): number {
  //   return this.board.indexOf(emptyPieceIndex);
  // }
}

function findLegalMovesFromPos(emptyPos: number): number[] {
  let legalMoves = []
  const x = emptyPos % W
  if (emptyPos > W)
    legalMoves.push(emptyPos - W)
  if (x > 0)
    legalMoves.push(emptyPos - 1)
  if (x < (W - 1))
    legalMoves.push(emptyPos + 1)
  if (emptyPos < 9 - W)
    legalMoves.push(emptyPos + W)
  return legalMoves
}
function findLegalMoves(board: number[]): number[] {
  const emptyPos = board.indexOf(emptyPieceIndex)
  return findLegalMovesFromPos(emptyPos)
}

function move(board: number[], aMove: number) {
  const newBoard = [...board]
  const emptyPos = newBoard.indexOf(emptyPieceIndex)
  newBoard[emptyPos] = board[aMove]
  newBoard[aMove] = emptyPieceIndex
  return newBoard
}

const doneHashes = new Map<number, Node>();
const rootNode = new Node(winningBoard);

function prepare() {
  const work: Node[] = [];

  // work.push(rootNode.board);
  work.push(rootNode);

  while (work.length > 0) {
    // const board = work.shift();
    const node: Node = work.shift();
    // const hash = Node.calcHash(board);
    const hash = node.hash;
    if (!doneHashes.has(hash)) {
      const legalMoves = findLegalMoves(node.board);
      const positions = legalMoves.map(aMove => move(node.board, aMove));
      node.children = positions.map(position => new Node(position, node));
      work.push(...node.children);
      doneHashes.set(hash, node);
    }
  }

  console.info({ rootNode });
}

// export function findBestMove(pieces: Piece[], W: number, H: number) {
export function findBestMove(board: number[]): number {
  console.time()
  prepare();
  console.timeEnd()
  const hash = calcHash(board);
  const node = doneHashes.get(hash);
  return node.parent ? node.parent.board.indexOf(emptyPieceIndex) : -1;
}

export function getSimplifiedBoard(pieces: Piece[]): number[] {
  function sortByPosition(a: Piece, b: Piece): number {
    const aPos = a.currentPos
    const bPos = b.currentPos
    if (aPos.y < bPos.y)
      return -1
    if (aPos.y === bPos.y) {
      if (aPos.x < bPos.x)
        return -1
      if (aPos.x === bPos.x)
        return 0
    }
    return 1
  }
  return pieces
    /// Note: Array.prototype.sort is destructive,
    /// so copy original array before sorting  
    .slice().sort(sortByPosition)
    .map((piece) => piece.index)
}
