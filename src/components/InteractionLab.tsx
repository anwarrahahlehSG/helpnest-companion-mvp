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
          <p>Trigger named actions that HelpNest can call later from real events.</p>
        </div>
        <span className="interactionStatus">{interactionLabels[active]}</span>
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
      </div>
    </div>
  )
}
