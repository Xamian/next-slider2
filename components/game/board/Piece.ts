import { Vector2d } from "../../../common/vector2d";

export class Piece {
  startPos: Vector2d;
  currentPos: Vector2d;
  index: number;
  constructor(startPos: Vector2d, index: number) {
    this.startPos = startPos;
    this.currentPos = startPos;
    this.index = index;
  }
}
