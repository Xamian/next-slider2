export class Vector2d {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  eq = (other: Vector2d): boolean => other && other.x == this.x && other.y == this.y;
  simpleDif = (other: Vector2d) => Math.abs(this.x - other.x) + Math.abs(this.y - other.y)
}
