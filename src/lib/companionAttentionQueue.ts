import type { CompanionEvent } from './companionOrchestrator'

export type AttentionPriority = 'normal' | 'important' | 'urgent'

export type AttentionQueueItem = {
  id: string
  event: Extract<CompanionEvent, { type: 'attention-required' | 'new-update' }>
  priority: AttentionPriority
  createdAt: number
  targetId?: string
  actionLabel?: string
  autoDismissMs?: number
}

type Listener = (items: AttentionQueueItem[]) => void

const listeners = new Set<Listener>()
let items: AttentionQueueItem[] = []

const score: Record<AttentionPriority, number> = {
  normal: 1,
  important: 2,
  urgent: 3,
}

function snapshot() {
  return [...items]
}

function notify() {
  const current = snapshot()
  listeners.forEach(listener => listener(current))
}

function sortQueue() {
  items.sort((a, b) => {
    const priorityDiff = score[b.priority] - score[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    return a.createdAt - b.createdAt
  })
}

export const companionAttentionQueue = {
  enqueue(item: Omit<AttentionQueueItem, 'createdAt'>) {
    // Replace the same logical item instead of repeatedly interrupting the user.
    const existingIndex = items.findIndex(existing => existing.id === item.id)
    const queued: AttentionQueueItem = { ...item, createdAt: Date.now() }

    if (existingIndex >= 0) items[existingIndex] = queued
    else items.push(queued)

    sortQueue()
    notify()
  },

  peek() {
    return items[0] ?? null
  },

  remove(id: string) {
    items = items.filter(item => item.id !== id)
    notify()
  },

  clear() {
    items = []
    notify()
  },

  getSnapshot() {
    return snapshot()
  },

  subscribe(listener: Listener) {
    listeners.add(listener)
    listener(snapshot())
    return () => {
      listeners.delete(listener)
    }
  },
}
