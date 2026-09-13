import { useEffect, useRef, useState } from 'react'
import { AvatarScene } from './AvatarScene'
import type { Outfit } from '../lib/types'

type MiniGameProps = {
  onExit: () => void
  outfit: Outfit
  requestComplete: boolean
  onContinue: () => void
}

type Target = {
  x: number
  y: number
  kind: 'request' | 'approval' | 'knowledge'
}

const targetIcon: Record<Target['kind'], string> = {
  request: '📨',
  approval: '✅',
  knowledge: '💡',
}

export function MiniGame({ onExit, outfit, requestComplete, onContinue }: MiniGameProps) {
  const [x, setX] = useState(45)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [target, setTarget] = useState<Target>({ x: 65, y: 20, kind: 'request' })
  const [jumping, setJumping] = useState(false)
  const [caught, setCaught] = useState(false)
  const timer = useRef<number | null>(null)
  const jumpTimer = useRef<number | null>(null)
  const caughtTimer = useRef<number | null>(null)

  const moveTarget = () => {
    const kinds: Target['kind'][] = ['request', 'approval', 'knowledge']
    setTarget({
      x: Math.floor(10 + Math.random() * 75),
      y: Math.floor(8 + Math.random() * 24),
      kind: kinds[Math.floor(Math.random() * kinds.length)],
    })
  }

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (requestComplete && (e.code === 'Enter' || e.code === 'Space')) {
        e.preventDefault()
        onContinue()
        return
      }

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
          setScore(s => s + 10 + Math.min(streak * 2, 20))
          setStreak(s => s + 1)
          setCaught(true)
          if (caughtTimer.current) window.clearTimeout(caughtTimer.current)
          caughtTimer.current = window.setTimeout(() => setCaught(false), 420)
          moveTarget()
        } else {
          setStreak(0)
        }
      }
    }

    window.addEventListener('keydown', key)
    timer.current = window.setInterval(moveTarget, 2200)

    return () => {
      window.removeEventListener('keydown', key)
      if (timer.current) window.clearInterval(timer.current)
      if (jumpTimer.current) window.clearTimeout(jumpTimer.current)
      if (caughtTimer.current) window.clearTimeout(caughtTimer.current)
    }
  }, [x, target.x, streak, requestComplete, onContinue])

  return (
    <div className="game">
      <div className="gameHeader">
        <div><strong>HelpNest Quest</strong><small>Keep HelpNest moving while your request is processed</small></div>
        <div className="gameStats"><span>Score <b>{score}</b></span><span>Streak <b>×{streak}</b></span></div>
        <button onClick={onExit} aria-label="Close game">×</button>
      </div>

      <div className="gameWorld">
        <div className="cloud cloudOne">☁️</div>
        <div className="cloud cloudTwo">☁️</div>
        <div className="gameHint">Catch service requests, approvals and knowledge</div>

        <div className={`target${caught ? ' caught' : ''}`} style={{ left: `${target.x}%`, top: `${target.y}%` }} aria-label="HelpNest item to catch">
          {targetIcon[target.kind]}
        </div>

        <div className={`gameRobot${jumping ? ' jumping' : ''}${caught ? ' celebrating' : ''}`} style={{ left: `${x}%` }}>
          <AvatarScene state={caught ? 'success' : 'game'} outfit={outfit} />
        </div>

        <div className="ground"><span>HELPDESK LANE</span></div>

        {requestComplete && (
          <div className="requestReady">
            <div className="readyCheck">✓</div>
            <div><strong>Your HelpNest request is ready</strong><span>The real work finished while you were playing.</span></div>
            <button className="primary" onClick={onContinue}>Continue</button>
          </div>
        )}
      </div>

      <div className="gameHelp">← → move &nbsp; • &nbsp; SPACE jumps/catches &nbsp; • &nbsp; Keep playing until HelpNest is ready</div>
    </div>
  )
}
