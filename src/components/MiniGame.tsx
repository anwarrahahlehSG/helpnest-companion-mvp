import { useEffect, useRef, useState } from 'react'

export function MiniGame({ onExit }: { onExit: () => void }) {
  const [x, setX] = useState(45)
  const [score, setScore] = useState(0)
  const [target, setTarget] = useState({ x: 65, y: 20 })
  const timer = useRef<number | null>(null)

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setX(v => Math.max(4, v - 6))
      if (e.key === 'ArrowRight') setX(v => Math.min(88, v + 6))
      if (e.key === ' ' && Math.abs(x - target.x) < 16) {
        setScore(s => s + 10)
        setTarget({ x: Math.floor(10 + Math.random() * 75), y: Math.floor(10 + Math.random() * 25) })
      }
    }
    window.addEventListener('keydown', key)
    timer.current = window.setInterval(() => setTarget({ x: Math.floor(10 + Math.random() * 75), y: Math.floor(10 + Math.random() * 25) }), 2200)
    return () => { window.removeEventListener('keydown', key); if (timer.current) clearInterval(timer.current) }
  }, [x, target.x])

  return <div className="game">
    <div className="gameHeader"><strong>HelpNest Quest</strong><span>Score: {score}</span><button onClick={onExit}>×</button></div>
    <div className="gameWorld"><div className="target" style={{ left: `${target.x}%`, top: `${target.y}%` }}>📨</div><div className="runner" style={{ left: `${x}%` }}>🤖</div><div className="ground" /></div>
    <div className="gameHelp">← → move &nbsp; • &nbsp; SPACE catches the request</div>
  </div>
}
