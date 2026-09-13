import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Group, MathUtils, Object3D } from 'three'
import type { CompanionInteraction } from '../lib/interactions'
import type { CompanionState, Outfit } from '../lib/types'

const MODEL_URL = '/models/helpnest-companion.glb'

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
  const leftEye = useMemo(() => model.getObjectByName('Eye_L'), [model])
  const rightEye = useMemo(() => model.getObjectByName('Eye_R'), [model])

  useFrame(({ clock, pointer }) => {
    const root = rootRef.current
    if (!root) return

    const t = clock.getElapsedTime()
    const active = interaction !== 'none'
    const wideGesture = interaction === 'wave' || interaction === 'high-five' || interaction === 'dance' || interaction === 'excited' || interaction === 'celebration'
    const targetScale = wideGesture ? .82 : .92

    root.scale.setScalar(MathUtils.lerp(root.scale.x, targetScale, .12))
    root.rotation.x = MathUtils.lerp(root.rotation.x, 0, .14)
    root.rotation.y = MathUtils.lerp(root.rotation.y, 0, .16)
    root.rotation.z = MathUtils.lerp(root.rotation.z, 0, .14)
    root.position.x = MathUtils.lerp(root.position.x, 0, .14)

    if (head && !active) {
      head.rotation.z = MathUtils.lerp(head.rotation.z, 0, .12)
      head.rotation.y = MathUtils.lerp(head.rotation.y, state === 'idle' ? pointer.x * .08 : 0, .07)
      head.rotation.x = MathUtils.lerp(head.rotation.x, state === 'idle' ? -pointer.y * .04 : 0, .07)
    }

    if (leftArm && !active) {
      leftArm.rotation.x = MathUtils.lerp(leftArm.rotation.x, 0, .12)
      leftArm.rotation.z = MathUtils.lerp(leftArm.rotation.z, -.08, .12)
    }
    if (rightArm && !active) {
      rightArm.rotation.x = MathUtils.lerp(rightArm.rotation.x, 0, .12)
      rightArm.rotation.z = MathUtils.lerp(rightArm.rotation.z, .08, .12)
    }

    // Keep the original friendly face. Only add subtle life: blinking and gentle eye tracking.
    const blinkPhase = t % 4.6
    const blinkScale = interaction === 'sleeping' ? .10 : blinkPhase > 4.40 ? .10 : 1
    const gazeX = !active && state === 'idle' ? pointer.x * .025 : 0
    const gazeY = !active && state === 'idle' ? -pointer.y * .012 : 0

    if (leftEye) {
      leftEye.scale.x = MathUtils.lerp(leftEye.scale.x, 1.08, .25)
      leftEye.scale.y = MathUtils.lerp(leftEye.scale.y, .92 * blinkScale, .34)
      leftEye.position.x = MathUtils.lerp(leftEye.position.x, -.28 + gazeX, .18)
      leftEye.position.y = MathUtils.lerp(leftEye.position.y, .07 + gazeY, .18)
    }
    if (rightEye) {
      rightEye.scale.x = MathUtils.lerp(rightEye.scale.x, 1.08, .25)
      rightEye.scale.y = MathUtils.lerp(rightEye.scale.y, .92 * blinkScale, .34)
      rightEye.position.x = MathUtils.lerp(rightEye.position.x, .28 + gazeX, .18)
      rightEye.position.y = MathUtils.lerp(rightEye.position.y, .07 + gazeY, .18)
    }

    if (state === 'idle' && !active) root.position.y = Math.sin(t * 1.35) * .018

    if (state === 'loading' && !active) {
      root.position.y = Math.sin(t * 2.5) * .025
      if (head) head.rotation.y = Math.sin(t * 1.7) * .05
    }

    if (state === 'success' && !active) {
      root.position.y = Math.abs(Math.sin(t * 4.4)) * .065
      if (leftArm) leftArm.rotation.z = -.66
      if (rightArm) rightArm.rotation.z = .66
    }

    if (interaction === 'wave' && rightArm) {
      rightArm.rotation.z = .88 + Math.sin(t * 10) * .12
      rightArm.rotation.x = -.18
    }

    if (interaction === 'high-five' && rightArm) {
      rightArm.rotation.z = .98
      rightArm.rotation.x = -.68
    }

    if (interaction === 'dance') {
      root.position.x = Math.sin(t * 4) * .035
      root.position.y = .03 + Math.abs(Math.sin(t * 4.2)) * .04
      root.rotation.z = Math.sin(t * 6) * .05
      if (head) head.rotation.y = Math.sin(t * 4) * .05
      if (leftArm) leftArm.rotation.z = -.46 - Math.sin(t * 7) * .16
      if (rightArm) rightArm.rotation.z = .46 + Math.sin(t * 7) * .16
    }

    if (interaction === 'thinking') {
      if (head) {
        head.rotation.z = -.05
        head.rotation.y = .06 + Math.sin(t * 1.8) * .02
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
      if (head) head.rotation.x = .06 + Math.sin(t * 3) * .012
    }

    if (interaction === 'sleeping') {
      root.rotation.z = -.10
      root.position.y = -.05
      if (head) {
        head.rotation.z = -.08
        head.rotation.x = .08 + Math.sin(t * .8) * .01
      }
    }

    if (interaction === 'excited' || interaction === 'celebration') {
      root.position.y = Math.abs(Math.sin(t * 4.8)) * .08
      if (head) head.rotation.z = Math.sin(t * 5) * .02
      if (leftArm) leftArm.rotation.z = -.66
      if (rightArm) rightArm.rotation.z = .66
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

  return <group ref={rootRef} onClick={poke} scale={.92}><primitive object={model as Object3D} /></group>
}

useGLTF.preload(MODEL_URL)
