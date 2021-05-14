import { Vector2d } from "../../../common/vector2d"
import { useEffect, MouseEvent } from "react"
import styles from './Board.module.scss'

// export class Piece {
//   loc: Vector2d;
//   constructor(loc: Vector2d) {
//     this.loc = loc;
//   }
// }
export class Piece {
  startPos: Vector2d;
  currentPos: Vector2d;
  index: number;
  constructor(startPos: Vector2d, index: number) {
    this.startPos = startPos
    this.currentPos = startPos
    this.index = index
  }
}

interface IClickFunc {
  (event: MouseEvent<HTMLDivElement>): void
}
interface IBoardProps {
  // dimensions: Vector2d;
  pieces: Piece[];
  imgDataUrl?: string;
  numPiecesX?: number;
  numPiecesY?: number;
  isPlaying?: boolean;
  onClick?: IClickFunc;
  children?: React.ReactNode;
  hintId?: number;
  // [x: string]: any;
}
export const Board = (props: IBoardProps) => {
  const {
    // dimensions: dim,
    pieces,
    imgDataUrl,
    numPiecesX = 3,
    numPiecesY = 3,
    isPlaying = false,
    children,
    onClick,
    hintId
    /*, ...rest*/
  } = props;
  useEffect(() => {

  }, [imgDataUrl])

  const pieceDim = new Vector2d(100 / numPiecesX, 100 / numPiecesY)
  const pieceCount = numPiecesX * numPiecesY
  const piecesR = pieces//range(0, pieceCount)
    .map((piece, i) => (
      <div
        key={i}
        className={styles.piece}
        style={{
          width: `${pieceDim.x}%`,
          height: `${pieceDim.y}%`,
          left: `${piece.currentPos.x * pieceDim.x}%`,
          top: `${piece.currentPos.y * pieceDim.y}%`,
          opacity: `${isPlaying && i === pieceCount - 1 ? 0 : 1}`,
          backgroundImage: `url(${imgDataUrl})`,
          backgroundSize: `${100 * numPiecesX}%`,
          backgroundPosition: `${(i % numPiecesX) * 100 / (numPiecesX - 1)}% ${Math.floor(i / numPiecesY) * 100 / (numPiecesY - 1)}%`,
          outline: i === hintId ? `1px solid green` : ''
        }}
        data-piece-index={i}
      ></div>
    ))
  return (
    <div
      className={`${styles.board} ${isPlaying ? styles.playing : ''}`}
      // style={{
      //   width: `${dim.x}px`,
      //   height: `${dim.y}px`,
      //   outline: '1px solid silver',
      //   outlineOffset: '0px'
      // }}
      onClick={onClick}
    // {...rest}
    >
      {piecesR}
      {children}
    </div>
    // <canvas
    //   width={dims.x}
    //   height={dims.y}
    //   {...rest} />
  )
}
