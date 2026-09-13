export type CompanionInteraction =
  | 'none'
  | 'wave'
  | 'dance'
  | 'high-five'
  | 'thinking'
  | 'typing'
  | 'sleeping'
  | 'excited'
  | 'sad'
  | 'celebration'

export const interactionLabels: Record<CompanionInteraction, string> = {
  none: 'Idle',
  wave: 'Wave',
  dance: 'Dance',
  'high-five': 'High-five',
  thinking: 'Thinking',
  typing: 'Typing',
  sleeping: 'Sleeping',
  excited: 'Excited',
  sad: 'Sad',
  celebration: 'Celebration',
}

export const interactionMessages: Record<CompanionInteraction, string> = {
  none: 'Need anything?',
  wave: 'Hello! 👋',
  dance: 'A little celebration? 🎵',
  'high-five': 'High-five! ✋',
  thinking: 'Let me think…',
  typing: 'Working on it… ⌨️',
  sleeping: 'Just resting my circuits… 💤',
  excited: 'Great news! ✨',
  sad: 'Hmm… that did not go as planned.',
  celebration: 'We did it! 🎉',
}

// MVP interaction lab: actions remain active until another action is selected
// or Idle/Stop is pressed. Later, real HelpNest events can supply their own
// completion/timeout policy.
export const interactionDurations: Record<CompanionInteraction, number> = {
  none: 0,
  wave: 0,
  dance: 0,
  'high-five': 0,
  thinking: 0,
  typing: 0,
  sleeping: 0,
  excited: 0,
  sad: 0,
  celebration: 0,
}
