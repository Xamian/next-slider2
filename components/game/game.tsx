import { Vector2d } from "../../common/vector2d"
import { Board } from "./board"
import { useState, useRef, SyntheticEvent, useEffect, MouseEvent } from "react"
import { dataUrlFromImgUrl } from "../../common/imageUtil"
import { Piece } from "./board/board"
import { range } from "../../common/range"
import styles from './Game.module.scss'


export const Game = () => {
  // const canvasRef = useRef(null)
  // const imgEl = useRef(null)
  const [numPiecesX, setNumPiecesX] = useState(3)
  const [numPiecesY, setNumPiecesY] = useState(3)
  const [imgDataUrl, setImgDataUrl] = useState('')
  const [counter, setCounter] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [pieces, setPieces] = useState<Piece[]>(null)
  const [score, setScore] = useState(0)
  const [message, setMessageText] = useState('Press start to begin')
  const [messageOpacity, setMessageOpacity] = useState(1)
  const [messageHidden, setMessageHidden] = useState(false)
  useEffect(() => {
    setPieces(range(0, numPiecesX * numPiecesY).map(i => (
      new Piece(new Vector2d(i % numPiecesX, Math.floor(i / numPiecesY)), i)
    )))
  }, [numPiecesX, numPiecesY])
  const showMessage = (text: string) => {
    setMessageText(text)
    setMessageOpacity(1)
    setMessageHidden(false)
  }
  const hideMessage = () => {
    setMessageOpacity(0)
    setTimeout(() => setMessageHidden(true), 1000)
  }

  // const imgUrl = 'https://thispersondoesnotexist.com/image'
  const imgUrl = `/api/proxy/thispersondoesnotexist/image?counter=${counter}`

  useEffect(() => {
    dataUrlFromImgUrl(imgUrl).then(dataUrl => setImgDataUrl(dataUrl))
  }, [imgUrl])

  const onStartClick = () => {
    startGame()
    // showMessage('Good luck!')
    // setTimeout(() => hideMessage(), 1000)
    // setIsPlaying(true)
  }
  const startGame = async () => {
    setScore(0)
    showMessage('Good luck!')
    setTimeout(() => hideMessage(), 1000)

    // /// hide the bottom right piece
    // const hiddenPiece = pieces[pieces.length - 1]
    // hiddenPiece.hidden = true

    /// shuffle pieces
    //shufflePieces(25)
    await betterShuffle(numPiecesX, numPiecesY)

    /// make sure the ui is updated
    setPieces([...pieces])
    setIsPlaying(true)
  }

  const betterShuffle = async (numPiecesX: number, numPiecesY: number, iterations: number = 5, mustTouchAll: boolean = true, minDif: number = 20) => {
    const hiddenPiece = pieces[pieces.length - 1]
    let prevHidden: Vector2d
    const W = numPiecesX
    const H = numPiecesY
    for (let n = 0; n < iterations; n++) {
      let touched = {}
      do {
        const neighborPositions = []
        const pos = hiddenPiece.currentPos
        if (pos.x > 0) {
          let t = new Vector2d(pos.x - 1, pos.y)
          if (!t.eq(prevHidden))
            neighborPositions.push(t)
        }
        if (pos.y > 0) {
          let t = new Vector2d(pos.x, pos.y - 1)
          if (!t.eq(prevHidden))
            neighborPositions.push(t)
        }
        if (pos.x < W - 1) {
          let t = new Vector2d(pos.x + 1, pos.y)
          if (!t.eq(prevHidden))
            neighborPositions.push(t)

        }
        if (pos.y < H - 1) {
          let t = new Vector2d(pos.x, pos.y + 1)
          if (!t.eq(prevHidden))
            neighborPositions.push(t)

        }
        const selectedMove = neighborPositions[Math.floor(Math.random() * neighborPositions.length)]
        const piece = getPieceAtPos(selectedMove)
        prevHidden = hiddenPiece.currentPos
        swap(piece, hiddenPiece)
        touched[piece.index] = 1
      } while (calcDif() < minDif || (mustTouchAll && Object.keys(touched).length + 1 < pieces.length))
      // setDif(calcDif())
      /// make sure the ui is updated
      setPieces([...pieces])
      await delay(200)
    }
  }
  const calcDif = () => pieces.reduce((acc: number, piece: Piece) => {
    acc += piece.currentPos.simpleDif(piece.startPos)
    return acc
  }, 0)
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  const getPieceAtPos = (pos: Vector2d) => {
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      const cPos = piece.currentPos
      if (cPos.x == pos.x && cPos.y == pos.y)
        return piece
    }
  }


  const onBoardClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement
    const pieceIndex = +target.dataset['pieceIndex']
    if (!isPlaying || isNaN(pieceIndex))
      return
    pieceClicked(pieces[pieceIndex])
    // if (canSwap(pieces[pieceIndex], pieces[pieces.length - 1])) {
    //   swap(pieces[pieceIndex], pieces[pieces.length - 1])
    //   setPieces([...pieces])
    //   setScore(score + 1)
    //   checkWin()
    // }
  }
  const pieceClicked = (piece: Piece) => {
    if (isPlaying) {
      const hiddenPiece = pieces[pieces.length - 1]
      if (canSwap(piece, hiddenPiece)) {
        swap(piece, hiddenPiece)
        setPieces([...pieces])
        setScore(score + 1)
        checkWin()
      }
    }
  }
  const checkWin = () => {
    if (isWin()) {
      const hiddenPiece = pieces[pieces.length - 1]
      // setTimeout(() => hiddenPiece.hidden = false, 1500)
      showMessage(`Player wins in ${score + 1} moves!`)
      setTimeout(() => setIsPlaying(false), 500)
    }
  }
  const isWin = () => {
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      const cPos = piece.currentPos
      const sPos = piece.startPos
      if (cPos.x != sPos.x || cPos.y != sPos.y) {
        return false
      }
    }
    return true
  }

  const canSwap = (piece: Piece, hiddenPiece: Piece): boolean => {
    const pos1 = piece.currentPos
    const pos2 = hiddenPiece.currentPos
    return (pos1.x == pos2.x && Math.abs(pos1.y - pos2.y) == 1) || pos1.y == pos2.y && Math.abs(pos1.x - pos2.x) == 1
  }
  const swap = (piece: Piece, piece2: Piece) => {
    const temp = piece.currentPos
    piece.currentPos = piece2.currentPos
    piece2.currentPos = temp
    // setDif(calcDif())
  }

  if (pieces === null)
    return <div></div>

  return (
    <div className={styles.game}>
      <div className={styles.score}>{score}</div>
      <div className={styles['board-wrapper']}>
        <Board
          // dimensions={new Vector2d(300, 300)}
          pieces={pieces}
          imgDataUrl={imgDataUrl}
          numPiecesX={numPiecesX}
          numPiecesY={numPiecesY}
          isPlaying={isPlaying}
          onClick={onBoardClick}
        >
          <div className={styles.message} style={{ opacity: messageOpacity, display: messageHidden ? 'none' : 'block' }}>{message}</div>
        </Board>
      </div>
      {/* <img src={imgUrl} width="100" />
      <img src={imgDataUrl} width="200" /> */}
      <button className={styles.button} onClick={onStartClick}>Start</button>
      <button className={styles.button} onClick={() => setCounter(counter + 1)}>New Image</button>
    </div >
  )
}
