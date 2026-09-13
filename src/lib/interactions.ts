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

export const interactionDurations: Record<CompanionInteraction, number> = {
  none: 0,
  wave: 2200,
  dance: 4200,
  'high-five': 2600,
  thinking: 4200,
  typing: 5000,
  sleeping: 6000,
  excited: 3200,
  sad: 4200,
  celebration: 4200,
}
