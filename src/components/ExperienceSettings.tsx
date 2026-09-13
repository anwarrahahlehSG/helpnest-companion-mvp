import './ExperienceSettings.css'
import type { CompanionSettings, CompanionPersonality } from '../lib/companionSettings'

type Props = {
  settings: CompanionSettings
  onChange: (next: CompanionSettings) => void
  onClose: () => void
}

type BooleanSettingKey = 'enabled' | 'showDuringLoading' | 'allowInteraction' | 'enableMiniGames' | 'showOnErrors' | 'allowSound'

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
  <button
    type="button"
    className={`toggleSwitch${checked ? ' on' : ''}`}
    aria-pressed={checked}
    onClick={() => onChange(!checked)}
  >
    <span />
  </button>
)

export function ExperienceSettings({ settings, onChange, onClose }: Props) {
  const set = <K extends keyof CompanionSettings>(key: K, value: CompanionSettings[K]) => {
    onChange({ ...settings, [key]: value })
  }

  const toggles: Array<[string, BooleanSettingKey]> = [
    ['Enable HelpNest Companion', 'enabled'],
    ['Show during loading', 'showDuringLoading'],
    ['Allow interaction', 'allowInteraction'],
    ['Enable mini games', 'enableMiniGames'],
    ['Show on errors', 'showOnErrors'],
    ['Allow sound', 'allowSound'],
  ]

  const personalities: CompanionPersonality[] = ['professional', 'friendly', 'playful']

  return (
    <div className="settingsOverlay" onMouseDown={onClose}>
      <section className="experienceSettings" onMouseDown={(e) => e.stopPropagation()}>
        <header className="settingsHeader">
          <div>
            <span className="settingsBrand">⬢ HelpNest</span>
            <h2>Experience Settings</h2>
            <p>Configure how the HelpNest Companion behaves for this experience.</p>
          </div>
          <button className="settingsClose" onClick={onClose} aria-label="Close settings">×</button>
        </header>

        <div className="settingsSection">
          {toggles.map(([label, key]) => (
            <div className="settingRow" key={key}>
              <span>{label}</span>
              <Toggle checked={settings[key]} onChange={(value) => set(key, value)} />
            </div>
          ))}
        </div>

        <div className="settingsSection">
          <h3>Personality</h3>
          <div className="personalityOptions">
            {personalities.map((personality) => (
              <label key={personality}>
                <input
                  type="radio"
                  name="personality"
                  checked={settings.personality === personality}
                  onChange={() => set('personality', personality)}
                />
                <span>{personality[0].toUpperCase() + personality.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="settingsSection settingsTiming">
          <label>
            <span>Mini game appears after</span>
            <select value={settings.miniGameDelayMs} onChange={(e) => set('miniGameDelayMs', Number(e.target.value))}>
              <option value={3000}>3 seconds</option>
              <option value={5000}>5 seconds</option>
              <option value={8000}>8 seconds</option>
              <option value={12000}>12 seconds</option>
            </select>
          </label>

          <label>
            <span>Minimum wait before showing</span>
            <select value={settings.minimumWaitMs} onChange={(e) => set('minimumWaitMs', Number(e.target.value))}>
              <option value={400}>400 ms</option>
              <option value={800}>800 ms</option>
              <option value={1200}>1.2 seconds</option>
              <option value={2000}>2 seconds</option>
            </select>
          </label>
        </div>

        <footer className="settingsFooter">
          <span>Changes apply immediately and are saved in this browser.</span>
          <button className="primary" onClick={onClose}>Done</button>
        </footer>
      </section>
    </div>
  )
}
