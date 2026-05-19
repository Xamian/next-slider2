import { Piece } from "../components/game/board/Piece";

const emptyPieceIndex = '8';

let worker = null;
let prepared = false;
// pendingRequests maps id -> { resolve: Function, timeout: number }
let pendingRequests = new Map<string, { resolve: (v: any) => void, timeout: number }>();
let nextRequestId = 1;
let preparedResolvers: Array<() => void> = [];

function ensureWorker() {
  if (typeof window === 'undefined') return null;
  if (!worker) {
    try {
      worker = new Worker('/ai-worker.js');
      worker.onmessage = (e) => {
        const {type, id, move, board} = e.data || {};
        if (type === 'prepared') {
          prepared = true;
          // resolve any waiters
          preparedResolvers.forEach(r => r());
          preparedResolvers = [];
          console.log('AI worker prepared');
        } else if (type === 'bestMove') {
          const entry = pendingRequests.get(id);
          if (entry) {
            try { window.clearTimeout(entry.timeout); } catch (e) {}
            entry.resolve(move);
            pendingRequests.delete(id);
          }
        }
      };
    } catch (err) {
      worker = null;
    }
  }
  return worker;
}

export function preloadAIWorker(): Promise<void> {
  const w = ensureWorker();
  if (!w) return Promise.resolve();
  if (prepared) return Promise.resolve();
  w.postMessage({type: 'prepare'});
  return new Promise<void>((resolve) => {
    preparedResolvers.push(resolve);
  });
}

export async function findBestMove(board: string): Promise<number> {
  const w = ensureWorker();
  if (w) {
    // if worker isn't prepared yet, wait (with timeout) so we don't get -1 spuriously
    if (!prepared) {
      await new Promise<void>((res) => {
        const to = window.setTimeout(() => {
          // timeout — resolve so we continue (may still fail)
          res();
        }, 6000);
        preparedResolvers.push(() => {
          try { window.clearTimeout(to); } catch (e) {}
          res();
        });
      });
    }
    const id = (nextRequestId++).toString();
    const move = await new Promise<number>((resolve) => {
      // safety timeout in case worker fails to respond
      const timeout = window.setTimeout(() => {
        if (pendingRequests.has(id)) {
          pendingRequests.delete(id);
          resolve(-1);
        }
      }, 30000);
      pendingRequests.set(id, { resolve, timeout });
      try {
        w.postMessage({type: 'findBestMove', id, board});
      } catch (err) {
        try { window.clearTimeout(timeout); } catch (e) {}
        pendingRequests.delete(id);
        resolve(-1);
      }
    });
    if (move !== -1) return move;
    // worker couldn't answer (yet) — do not run heavy sync compute on main thread;
    // return -1 so caller can show 'No hint available' instead of freezing UI.
    console.log('worker returned -1; not running sync compute on main thread for board', board);
    return -1;
  }
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
