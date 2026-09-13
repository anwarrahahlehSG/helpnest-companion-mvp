import type { CompanionEvent } from './companionOrchestrator'

type CompanionListener = (event: CompanionEvent) => void

const listeners = new Set<CompanionListener>()

export const companionBus = {
  publish(event: CompanionEvent) {
    listeners.forEach(listener => listener(event))
  },
  subscribe(listener: CompanionListener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export const companion = {
  operationStarted(expectedMs?: number) {
    companionBus.publish({ type: 'operation-started', expectedMs })
  },
  operationThinking() {
    companionBus.publish({ type: 'operation-progress', phase: 'thinking' })
  },
  operationTyping() {
    companionBus.publish({ type: 'operation-progress', phase: 'typing' })
  },
  operationSucceeded(message?: string) {
    companionBus.publish({ type: 'operation-succeeded', message })
  },
  operationFailed(message?: string) {
    companionBus.publish({ type: 'operation-failed', message })
  },
  operationOffline(message?: string) {
    companionBus.publish({ type: 'operation-failed', offline: true, message })
  },
  approvalRequired(title: string) {
    companionBus.publish({ type: 'attention-required', kind: 'approval', title })
  },
  informationRequired(title: string) {
    companionBus.publish({ type: 'attention-required', kind: 'information', title })
  },
  attentionCompleted(title?: string) {
    companionBus.publish({ type: 'attention-completed', title })
  },
  newUpdate(title?: string) {
    companionBus.publish({ type: 'new-update', title })
  },
}
