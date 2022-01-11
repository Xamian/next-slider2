import { Vector2d } from "./vector2d";
import { Piece } from "../components/game/board/Piece";

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const getPieceAtPos = (pieces:Piece[], pos: Vector2d) => {
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    const cPos = piece.currentPos
    if (cPos.x == pos.x && cPos.y == pos.y)
      return piece
  }
}
