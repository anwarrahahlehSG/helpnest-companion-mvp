import { useEffect, useState } from 'react'
import { AvatarScene } from './components/AvatarScene'
import { MiniGame } from './components/MiniGame'
import type { CompanionState, Outfit } from './lib/types'

const stateText: Record<CompanionState, { title: string; body: string }> = {
  idle: { title: "I'm here to help", body: 'Click me or test one of the scenarios.' },
  loading: { title: 'Getting your requests ready…', body: 'Your HelpNest assistant is checking the latest information.' },
  success: { title: 'All done!', body: 'Your requests are ready.' },
  error: { title: 'Something went wrong', body: 'The request failed. You can retry or keep playing.' },
  offline: { title: "I couldn't reach assyst", body: "I'm checking the connection and will keep trying." },
  game: { title: 'HelpNest Quest', body: 'Catch requests while you wait.' }
}

export default function App() {
  const [state, setState] = useState<CompanionState>('idle')
  const [outfit, setOutfit] = useState<Outfit>('default')
  const [message, setMessage] = useState('')
  const [longWait, setLongWait] = useState(false)

  const simulate = (ms: number, outcome: CompanionState = 'success') => {
    setState('loading'); setLongWait(false)
    window.setTimeout(() => setLongWait(true), 3500)
    window.setTimeout(() => { setState(outcome); setLongWait(false) }, ms)
  }

  useEffect(() => {
    if (!message) return
    const id = window.setTimeout(() => setMessage(''), 1800)
    return () => clearTimeout(id)
  }, [message])

  return <div className="appShell">
    <aside className="sidebar">
      <div className="brand">⬢ <span>HelpNest</span></div>
      <div className="navList">{['Home','Services','My Requests','Approvals','Knowledge','Reports','Settings'].map((x,i)=><div className={'nav '+(i===0?'active':'')} key={x}>{x}</div>)}</div>
      <div className="sidebarCompanion">
        <div className="sidebarBubble">{message || 'Need anything?'}<span className="sidebarBubbleTail" /></div>
        <div className="sidebarAvatar"><AvatarScene state={state} outfit={outfit} onPoke={()=>setMessage('Hey! 👋')} /></div>
      </div>
    </aside>

    <main>
      <header><input placeholder="Search for a service, request or answer…"/><div>🔔 &nbsp; Anwar ▾</div></header>
      <section className="hero">
        <div><h1>Good morning, Anwar</h1><p>How can we help you today?</p></div>
        <div className="cards"><div>🖥️<b>Report an Issue</b><span>Get help with a problem</span></div><div>🛒<b>Request Something</b><span>Browse the service catalog</span></div><div>📋<b>My Requests</b><span>Track your submissions</span></div></div>
        <div className="attention"><b>Things needing your attention</b><div>Laptop Replacement <span>Awaiting your approval</span><button>Review</button></div><div>VPN Access <span>Information required</span><button>View</button></div></div>
      </section>
      <section className="lab">
        <div className="labCard"><h3>MVP controls</h3><button onClick={()=>simulate(800)}>Fast load</button><button onClick={()=>simulate(7000)}>Slow load</button><button onClick={()=>simulate(2500,'error')}>Error</button><button onClick={()=>simulate(2500,'offline')}>Offline</button><button onClick={()=>setState('idle')}>Reset</button></div>
        <div className="labCard"><h3>Avatar outfit</h3><select value={outfit} onChange={e=>setOutfit(e.target.value as Outfit)}><option value="default">Default HelpNest</option><option value="saudi-red">Saudi — red shemagh</option><option value="saudi-white">Saudi — white ghutra</option></select><p>Click the bot to test interaction.</p></div>
      </section>
    </main>

    {state !== 'idle' && <div className="overlay">{state === 'game' ? <MiniGame outfit={outfit} onExit={()=>setState('loading')} /> : <div className="modal">
      <div className="modalAvatar"><AvatarScene state={state} outfit={outfit} onPoke={()=>setMessage('That tickles 😄')} /></div>
      <h2>{stateText[state].title}</h2><p>{stateText[state].body}</p>
      {state==='loading' && <div className="progress"><div /></div>}
      {state==='loading' && longWait && <button className="primary" onClick={()=>setState('game')}>🎮 Play while waiting</button>}
      {(state==='error'||state==='offline') && <div className="actions"><button className="primary" onClick={()=>simulate(3000)}>Retry</button><button onClick={()=>setState('game')}>Keep playing</button></div>}
      {state==='success' && <button className="primary" onClick={()=>setState('idle')}>Continue</button>}
    </div>}</div>}
  </div>
}
