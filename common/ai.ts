import { Piece } from "../components/game/board/Piece";
import Denque from "denque";

const W = 3;
const H = 3;
const positionCount = W * H;
const emptyPieceIndex = (positionCount - 1).toString(); // '8'
const winningBoard = [...Array(positionCount)].map((_, k) => k.toString()); // '0','1','2'...,'8'

class Node {
  children: Node[];
  hash: string;
  constructor(public board: string[], public parent: Node = null) {
    this.hash = board.join('');
  }
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
function findLegalMoves(board: string[]): number[] {
  const emptyPos = board.indexOf(emptyPieceIndex)
  return findLegalMovesFromPos(emptyPos)
}

function move(board: string[], aMove: number): string[] {
  const newBoard = board.slice();
  const emptyPos = newBoard.indexOf(emptyPieceIndex)
  newBoard[emptyPos] = board[aMove]
  newBoard[aMove] = emptyPieceIndex
  return newBoard
}

const nodeCache = new Map<string, Node>();

function prepare() {
  const work = new Denque<Node>();
  work.push(new Node(winningBoard));

  while (work.length > 0) {
    const node = work.shift();
    const hash = node.hash;
    if (!nodeCache.has(hash)) {
      const legalMoves = findLegalMoves(node.board);
      const positions = legalMoves.map(aMove => move(node.board, aMove));
      node.children = positions.map(position => new Node(position, node));
      node.children.forEach(child => {
        work.push(child);
      });
      nodeCache.set(hash, node);
    }
  }
}

export function findBestMove(board: string): number {
  // console.time()
  prepare();
  // console.timeEnd()
  const hash = board;
  const node = nodeCache.get(hash);
  return node.parent ? node.parent.board.indexOf(emptyPieceIndex) : -1;
}

export function getSimplifiedBoard(pieces: Piece[]): string {
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
  return [...pieces]
    /// Note: Array.prototype.sort is destructive,
    /// so copy original array before sorting  
    .sort(sortByPosition)
    .map((piece) => piece.index)
    .join('')
}
