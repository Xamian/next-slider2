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
  const x = emptyPos % W
  const y = Math.floor(emptyPos / W)
  if (y > 0)
    legalMoves.push(emptyPos - W)
  if (x > 0)
    legalMoves.push(emptyPos - 1)
  if (x < (W - 1))
    legalMoves.push(emptyPos + 1)
  if (y < (H - 1))
    legalMoves.push(emptyPos + W)
  return legalMoves
}
class SearchState {
  board: number[]
  legalMoves: number[]
  constructor(board: number[]) {
    /// clone the board
    this.board = [...board]
    this.legalMoves = getLegalMoves(board)
  }
  private calculateDistance(wantedIndex: number, currentIndex: number): number {
    const wanted = new Vector2d(wantedIndex % W, Math.floor(wantedIndex / W))
    const current = new Vector2d(currentIndex % W, Math.floor(currentIndex / W))
    return wanted.simpleDif(current)
  }

  score() {
    return this.board.reduce((acc, wantedIndex, currentIndex) => {
      if (wantedIndex < W * H - 1) /// Ignore hidden piece
        acc += this.calculateDistance(wantedIndex, currentIndex)
      return acc
    }, 0)
  }
  move(boardIndex: number) {
    console.log('move from index:', boardIndex)
    const temp = this.board[boardIndex]
    const emptyPos = this.board.indexOf(W * H - 1)

    this.board[emptyPos] = temp
    this.board[boardIndex] = W * H - 1
    this.legalMoves = getLegalMoves(this.board)
    return this
  }
  getLegalPositions() {
    return this.legalMoves.map(boardIndex => {
      return new SearchState(this.board).move(boardIndex)
    })
  }
}

export function findBestMove(pieces: Piece[], w: number, h: number) {
  W = w
  H = h
  const simplifiedBoard: number[] = getSimplifiedBoard(pieces)
  let rootState = new SearchState(simplifiedBoard)
  console.log('board:', rootState.board)
  console.log('legalMoves:', rootState.legalMoves)
  console.log('score:', rootState.score())
  let positions = rootState.getLegalPositions()
  console.log(positions)
  const maxDepth = 3
  for (let i = 0; i < maxDepth; i++) {
  }
  return [null, null]
}