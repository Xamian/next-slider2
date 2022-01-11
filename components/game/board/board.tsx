import { Vector2d } from "../../../common/vector2d"
import { useEffect, MouseEvent } from "react"
import styles from './Board.module.scss'
import { Piece } from "./Piece";

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
    .map((piece, i) => {
      const x = piece.currentPos.x;
      const y = piece.currentPos.y;
      return <div
        key={i}
        className={styles.piece +
          (x + y * 3 === hintId ? ` ${styles.hint}` : '')}
        style={{
          width: `${pieceDim.x}%`,
          height: `${pieceDim.y}%`,
          left: `${x * pieceDim.x}%`,
          top: `${y * pieceDim.y}%`,
          opacity: `${isPlaying && i === pieceCount - 1 ? 0 : 1}`,
          backgroundImage: `url(${imgDataUrl})`,
          backgroundSize: `${100 * numPiecesX}%`,
          backgroundPosition: `${(i % numPiecesX) * 100 / (numPiecesX - 1)}% ${Math.floor(i / numPiecesY) * 100 / (numPiecesY - 1)}%`
        }}
        data-piece-index={i}
      ></div>
    })
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
