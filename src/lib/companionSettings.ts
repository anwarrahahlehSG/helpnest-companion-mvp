export type CompanionPersonality = 'professional' | 'friendly' | 'playful'

export type CompanionSettings = {
  enabled: boolean
  showDuringLoading: boolean
  allowInteraction: boolean
  enableMiniGames: boolean
  showOnErrors: boolean
  allowSound: boolean
  personality: CompanionPersonality
  miniGameDelayMs: number
  minimumWaitMs: number
}

export const defaultCompanionSettings: CompanionSettings = {
  enabled: true,
  showDuringLoading: true,
  allowInteraction: true,
  enableMiniGames: true,
  showOnErrors: true,
  allowSound: false,
  personality: 'friendly',
  miniGameDelayMs: 5000,
  minimumWaitMs: 800,
}
