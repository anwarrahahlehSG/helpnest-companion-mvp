import { interactionLabels, type CompanionInteraction } from '../lib/interactions'

const actions: CompanionInteraction[] = [
  'wave',
  'dance',
  'high-five',
  'thinking',
  'typing',
  'sleeping',
  'excited',
  'sad',
  'celebration',
]

export function InteractionLab({
  active,
  onTrigger,
}: {
  active: CompanionInteraction
  onTrigger: (interaction: CompanionInteraction) => void
}) {
  return (
    <div className="labCard interactionLab">
      <div className="interactionLabHeader">
        <div>
          <h3>Companion interactions</h3>
          <p>Actions stay active so you can clearly inspect each animation.</p>
        </div>
        <span className="interactionStatus">Active: {interactionLabels[active]}</span>
      </div>
      <div className="interactionButtons">
        {actions.map((action) => (
          <button
            key={action}
            className={active === action ? 'activeInteraction' : ''}
            onClick={() => onTrigger(action)}
          >
            {interactionLabels[action]}
          </button>
        ))}
        <button
          className={active === 'none' ? 'activeInteraction' : ''}
          onClick={() => onTrigger('none')}
        >
          Stop / Idle
        </button>
      </div>
    </div>
  )
}
