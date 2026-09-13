import type { CompanionInteraction } from './interactions'
import type { CompanionState } from './types'

export type CompanionEvent =
  | { type: 'operation-started'; expectedMs?: number }
  | { type: 'operation-progress'; phase?: 'thinking' | 'typing' }
  | { type: 'operation-succeeded'; message?: string }
  | { type: 'operation-failed'; offline?: boolean; message?: string }
  | { type: 'attention-required'; kind: 'approval' | 'information'; title: string }
  | { type: 'attention-completed'; title?: string }
  | { type: 'new-update'; title?: string }

export type CompanionDirective = {
  state: CompanionState
  interaction: CompanionInteraction
  message: string
  showOverlay?: boolean
}

export function resolveCompanionEvent(event: CompanionEvent): CompanionDirective {
  switch (event.type) {
    case 'operation-started':
      return {
        state: 'loading',
        interaction: 'thinking',
        message: 'Let me check that for you…',
        showOverlay: true,
      }
    case 'operation-progress':
      return {
        state: 'loading',
        interaction: event.phase === 'typing' ? 'typing' : 'thinking',
        message: event.phase === 'typing' ? 'Putting everything together…' : 'Still checking…',
        showOverlay: true,
      }
    case 'operation-succeeded':
      return {
        state: 'success',
        interaction: 'celebration',
        message: event.message ?? 'All done! 🎉',
        showOverlay: true,
      }
    case 'operation-failed':
      return {
        state: event.offline ? 'offline' : 'error',
        interaction: 'sad',
        message: event.message ?? (event.offline ? 'I cannot reach the service right now.' : 'Something went wrong.'),
        showOverlay: true,
      }
    case 'attention-required':
      return {
        state: 'idle',
        interaction: 'excited',
        message: event.kind === 'approval' ? `${event.title} needs your approval.` : `${event.title} needs information from you.`,
      }
    case 'attention-completed':
      return {
        state: 'idle',
        interaction: 'celebration',
        message: event.title ? `${event.title} is complete! 🎉` : 'Nice — that is complete! 🎉',
      }
    case 'new-update':
      return {
        state: 'idle',
        interaction: 'excited',
        message: event.title ? `There is a new update on ${event.title}.` : 'You have a new update!',
      }
  }
}
