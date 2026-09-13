export type GuidanceType = 'approval' | 'information-required' | 'ticket-update' | 'service' | 'custom'

export type GuidancePriority = 'normal' | 'important' | 'urgent'

export type GuidanceRequest = {
  id: string
  type: GuidanceType
  title: string
  message: string
  targetId: string
  actionLabel?: string
  priority?: GuidancePriority
  autoDismissMs?: number
}

export const createGuidance = (request: GuidanceRequest): GuidanceRequest => ({
  priority: 'important',
  actionLabel: 'Open',
  autoDismissMs: 6500,
  ...request,
})
