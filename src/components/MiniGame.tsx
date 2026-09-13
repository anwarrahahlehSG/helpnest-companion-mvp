import { useEffect, useRef, useState } from 'react'
import { AvatarScene } from './AvatarScene'
import type { Outfit } from '../lib/types'

export function MiniGame({ onExit, outfit }: { onExit: () => void; outfit: Outfit }) {
  const [x, setX] = useState(45)
  const [score, setScore] = useState(0)
  const [target, setTarget] = useState({ x: 65, y: 20 })
  const [jumping, setJumping] = useState(false)
  const timer = useRef<number | null>(null)
  const jumpTimer = useRef<number | null>(null)

  const moveTarget = () => {
    setTarget({
      x: Math.floor(10 + Math.random() * 75),
      y: Math.floor(8 + Math.random() * 24),
    })
  }

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setX(v => Math.max(4, v - 6))
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setX(v => Math.min(86, v + 6))
      }

      if (e.code === 'Space') {
        e.preventDefault()
        setJumping(true)

        if (jumpTimer.current) window.clearTimeout(jumpTimer.current)
        jumpTimer.current = window.setTimeout(() => setJumping(false), 380)

        if (Math.abs(x - target.x) < 16) {
          setScore(s => s + 10)
          moveTarget()
        }
      }
    }

    window.addEventListener('keydown', key)
    timer.current = window.setInterval(moveTarget, 2200)

    return () => {
      window.removeEventListener('keydown', key)
      if (timer.current) window.clearInterval(timer.current)
      if (jumpTimer.current) window.clearTimeout(jumpTimer.current)
    }
  }, [x, target.x])

  return (
    <div className="game">
      <div className="gameHeader">
        <strong>HelpNest Quest</strong>
        <span>Score: {score}</span>
        <button onClick={onExit} aria-label="Close game">×</button>
      </div>

      <div className="gameWorld">
        <div
          className="target"
          style={{ left: `${target.x}%`, top: `${target.y}%` }}
          aria-label="Request to catch"
        >
          📨
        </div>

        <div
          className={`gameRobot${jumping ? ' jumping' : ''}`}
          style={{ left: `${x}%` }}
        >
          <AvatarScene state="game" outfit={outfit} />
        </div>

        <div className="ground" />
      </div>

      <div className="gameHelp">
        ← → move &nbsp; • &nbsp; SPACE jumps and catches the request
      </div>
    </div>
  )
}
