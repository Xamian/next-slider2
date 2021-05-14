import { Piece } from "../components/game/board/board"
import { Vector2d } from "./vector2d"

let W: number
let H: number

function getSimplifiedBoard(pieces: Piece[]): number[] {
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

function getLegalMoves(board: number[]): number[] {
  let legalMoves = []
  const emptyPos = board.indexOf(8)
  if (emptyPos % W > 0)
    legalMoves.push(emptyPos - 1)
  if (emptyPos % W < (W - 1))
    legalMoves.push(emptyPos + 1)
  if (Math.floor(emptyPos / W) > 0)
    legalMoves.push(emptyPos - W)
  if (Math.floor(emptyPos / W) < (H - 1))
    legalMoves.push(emptyPos + W)
  return legalMoves
}
class SearchState {
  board: number[]
  legalMoves: number[]
  constructor(board: number[]) {
    this.board = board
    this.legalMoves = getLegalMoves(board)
  }
  private calculateDistance(pos: number, index: number): number {
    const wanted = new Vector2d(pos % W, Math.floor(pos / W))
    const current = new Vector2d(index % W, Math.floor(index / W))
    return wanted.simpleDif(current)
  }

  score() {
    return this.board.reduce((acc, curr, i) => {
      if (curr < W * H - 1) /// Ignore hidden piece
        acc += this.calculateDistance(curr, i)
      return acc
    }, 0)
  }

}

export function findBestMove(pieces: Piece[], w: number, h: number) {
  W = w
  H = h
  const simplifiedBoard: number[] = getSimplifiedBoard(pieces)
  let rootState = new SearchState(simplifiedBoard)
  console.log(rootState.board)
  console.log(rootState.legalMoves)
  console.log(rootState.score())

  const maxDepth = 3
  for (let i = 0; i < maxDepth; i++) {
  }
  return [null, null]
}