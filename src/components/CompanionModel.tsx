import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Group, MathUtils, Object3D } from 'three'
import type { CompanionInteraction } from '../lib/interactions'
import type { CompanionState, Outfit } from '../lib/types'

const MODEL_URL = '/models/helpnest-companion.gltf'

type Props = {
  state: CompanionState
  outfit: Outfit
  interaction?: CompanionInteraction
  onPoke?: () => void
}

export function CompanionModel({ state, interaction = 'none', onPoke }: Props) {
  const { scene } = useGLTF(MODEL_URL)
  const model = useMemo(() => scene.clone(true), [scene])
  const rootRef = useRef<Group>(null)

  const head = useMemo(() => model.getObjectByName('HeadRig'), [model])
  const leftArm = useMemo(() => model.getObjectByName('ArmRig_L'), [model])
  const rightArm = useMemo(() => model.getObjectByName('ArmRig_R'), [model])

  useFrame(({ clock, pointer }) => {
    const root = rootRef.current
    if (!root) return

    const t = clock.getElapsedTime()
    const active = interaction !== 'none'

    root.rotation.x = MathUtils.lerp(root.rotation.x, 0, .14)
    root.rotation.y = MathUtils.lerp(root.rotation.y, 0, .16)
    root.rotation.z = MathUtils.lerp(root.rotation.z, 0, .14)
    root.position.x = MathUtils.lerp(root.position.x, 0, .14)

    if (state === 'idle' && !active) {
      root.position.y = Math.sin(t * 1.35) * .018
      if (head) {
        head.rotation.y = MathUtils.lerp(head.rotation.y, pointer.x * .08, .06)
        head.rotation.x = MathUtils.lerp(head.rotation.x, -pointer.y * .04, .06)
      }
      if (leftArm) leftArm.rotation.z = MathUtils.lerp(leftArm.rotation.z, -.08, .16)
      if (rightArm) rightArm.rotation.z = MathUtils.lerp(rightArm.rotation.z, .08, .16)
    }

    if (state === 'loading' && !active) {
      root.position.y = Math.sin(t * 2.5) * .025
      if (head) head.rotation.y = Math.sin(t * 1.7) * .05
    }

    if (interaction === 'wave' && rightArm) {
      rightArm.rotation.z = 1.08 + Math.sin(t * 10) * .14
      rightArm.rotation.x = -.18
    }

    if (interaction === 'high-five' && rightArm) {
      rightArm.rotation.z = 1.16
      rightArm.rotation.x = -.72
    }

    if (interaction === 'dance') {
      root.position.x = Math.sin(t * 4) * .04
      root.position.y = .03 + Math.abs(Math.sin(t * 4.2)) * .04
      root.rotation.z = Math.sin(t * 6) * .05
      if (leftArm) leftArm.rotation.z = -.55 - Math.sin(t * 7) * .20
      if (rightArm) rightArm.rotation.z = .55 + Math.sin(t * 7) * .20
    }

    if (interaction === 'thinking') {
      if (head) {
        head.rotation.z = -.05
        head.rotation.y = .06
      }
      if (rightArm) {
        rightArm.rotation.z = .62
        rightArm.rotation.x = -.44
      }
    }

    if (interaction === 'typing') {
      if (leftArm) {
        leftArm.rotation.z = -.28
        leftArm.rotation.x = -.62
      }
      if (rightArm) {
        rightArm.rotation.z = .28
        rightArm.rotation.x = -.62
      }
      if (head) head.rotation.x = .06
    }

    if (interaction === 'sleeping') {
      root.rotation.z = -.10
      root.position.y = -.05
      if (head) {
        head.rotation.z = -.08
        head.rotation.x = .08
      }
    }

    if (interaction === 'excited' || interaction === 'celebration') {
      root.position.y = Math.abs(Math.sin(t * 4.8)) * .08
      if (leftArm) leftArm.rotation.z = -.78
      if (rightArm) rightArm.rotation.z = .78
    }

    if (interaction === 'sad') {
      root.position.y = -.04
      if (head) head.rotation.x = .10
      if (leftArm) leftArm.rotation.z = -.18
      if (rightArm) rightArm.rotation.z = .18
    }
  })

  const poke = (event: { stopPropagation: () => void }) => {
    event.stopPropagation()
    onPoke?.()
  }

  return (
    <group ref={rootRef} onClick={poke}>
      <primitive object={model as Object3D} />
    </group>
  )
}

useGLTF.preload(MODEL_URL)
