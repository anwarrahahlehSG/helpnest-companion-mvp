import { useFrame } from '@react-three/fiber'
import { Group, MathUtils, Mesh } from 'three'
import { useRef } from 'react'
import type { CompanionInteraction } from '../lib/interactions'
import type { CompanionState, Outfit } from '../lib/types'

const SHELL = '#f9fbff'
const SHELL_SOFT = '#eaf1fb'
const BLUE = '#0b6cff'
const BLUE_DARK = '#0757c9'
const CYAN = '#82f4ff'
const VISOR = '#061426'

function ChestMark() {
  return (
    <group position={[0, .34, .505]} scale={[.72, .72, .72]}>
      <mesh position={[-.13, 0, 0]}><boxGeometry args={[.045, .20, .025]} /><meshStandardMaterial color={BLUE} /></mesh>
      <mesh position={[-.04, 0, 0]}><boxGeometry args={[.045, .20, .025]} /><meshStandardMaterial color={BLUE} /></mesh>
      <mesh position={[-.085, 0, 0]}><boxGeometry args={[.13, .04, .026]} /><meshStandardMaterial color={BLUE} /></mesh>
      <mesh position={[.055, 0, 0]}><boxGeometry args={[.045, .20, .025]} /><meshStandardMaterial color={BLUE} /></mesh>
      <mesh position={[.155, 0, 0]}><boxGeometry args={[.045, .20, .025]} /><meshStandardMaterial color={BLUE} /></mesh>
      <mesh position={[.105, 0, .002]} rotation={[0, 0, -.46]}><boxGeometry args={[.045, .225, .026]} /><meshStandardMaterial color={BLUE} /></mesh>
    </group>
  )
}

function Hand({ side }: { side: -1 | 1 }) {
  return (
    <group>
      <mesh scale={[1.0, .92, .85]}>
        <sphereGeometry args={[.17, 28, 28]} />
        <meshPhysicalMaterial color={SHELL} roughness={.22} clearcoat={.45} />
      </mesh>
      <mesh position={[side * .13, -.03, .04]} rotation={[0, 0, side * .5]}>
        <capsuleGeometry args={[.045, .11, 5, 12]} />
        <meshPhysicalMaterial color={SHELL} roughness={.24} clearcoat={.35} />
      </mesh>
      <mesh position={[side * .04, -.12, .06]} rotation={[0, 0, side * .18]}>
        <capsuleGeometry args={[.038, .10, 5, 12]} />
        <meshPhysicalMaterial color={SHELL} roughness={.24} clearcoat={.35} />
      </mesh>
    </group>
  )
}

function Arm({ side, armRef, robe }: { side: -1 | 1; armRef: React.RefObject<Group | null>; robe: boolean }) {
  return (
    <group ref={armRef} position={[side * .62, .47, 0]} rotation={[0, 0, side * -.18]}>
      <mesh position={[0, .05, 0]} castShadow>
        <sphereGeometry args={[.18, 30, 30]} />
        <meshPhysicalMaterial color={robe ? '#ffffff' : SHELL} roughness={.23} clearcoat={.42} />
      </mesh>
      <mesh position={[0, -.22, 0]}>
        <capsuleGeometry args={[.115, .28, 7, 18]} />
        <meshPhysicalMaterial color={robe ? '#ffffff' : SHELL} roughness={.26} clearcoat={.32} />
      </mesh>
      <mesh position={[0, -.39, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[.115, .035, 12, 28]} />
        <meshPhysicalMaterial color={BLUE} roughness={.22} clearcoat={.45} />
      </mesh>
      <mesh position={[0, -.56, 0]}>
        <capsuleGeometry args={[.105, .25, 7, 18]} />
        <meshPhysicalMaterial color={SHELL_SOFT} roughness={.28} clearcoat={.28} />
      </mesh>
      <mesh position={[0, -.73, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[.11, .03, 12, 28]} />
        <meshPhysicalMaterial color={BLUE} roughness={.2} clearcoat={.5} />
      </mesh>
      <group position={[0, -.87, .015]}><Hand side={side} /></group>
    </group>
  )
}

function Leg({ side }: { side: -1 | 1 }) {
  return (
    <group position={[side * .27, -.62, 0]}>
      <mesh position={[0, -.05, 0]}>
        <capsuleGeometry args={[.13, .30, 7, 18]} />
        <meshPhysicalMaterial color={SHELL} roughness={.24} clearcoat={.35} />
      </mesh>
      <mesh position={[0, -.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[.125, .035, 12, 28]} />
        <meshPhysicalMaterial color={BLUE} roughness={.2} clearcoat={.5} />
      </mesh>
      <mesh position={[0, -.40, .06]} scale={[1.25, .72, 1.55]} castShadow>
        <sphereGeometry args={[.17, 30, 30]} />
        <meshPhysicalMaterial color={SHELL} roughness={.22} clearcoat={.42} />
      </mesh>
      <mesh position={[0, -.475, .115]} scale={[1.08, .24, 1.35]}>
        <sphereGeometry args={[.17, 28, 28]} />
        <meshStandardMaterial color={BLUE_DARK} />
      </mesh>
    </group>
  )
}

type Props = {
  state: CompanionState
  outfit: Outfit
  interaction?: CompanionInteraction
  onPoke?: () => void
}

export function Robot({ state, outfit, interaction = 'none', onPoke }: Props) {
  const robotRef = useRef<Group>(null)
  const headRef = useRef<Group>(null)
  const leftArmRef = useRef<Group>(null)
  const rightArmRef = useRef<Group>(null)
  const leftEyeRef = useRef<Mesh>(null)
  const rightEyeRef = useRef<Mesh>(null)
  const waveUntil = useRef(0)

  useFrame(({ clock, pointer }) => {
    const robot = robotRef.current
    if (!robot) return

    const t = clock.getElapsedTime()
    const waving = performance.now() < waveUntil.current
    const autoGreeting = state === 'idle' && interaction === 'none' && (t % 13.5) > 11.7

    robot.rotation.x = MathUtils.lerp(robot.rotation.x, 0, .12)
    robot.rotation.z = MathUtils.lerp(robot.rotation.z, 0, .12)

    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = MathUtils.lerp(leftArmRef.current.rotation.x, 0, .14)
      leftArmRef.current.rotation.y = MathUtils.lerp(leftArmRef.current.rotation.y, 0, .14)
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = MathUtils.lerp(rightArmRef.current.rotation.x, 0, .14)
      rightArmRef.current.rotation.y = MathUtils.lerp(rightArmRef.current.rotation.y, 0, .14)
    }

    const blinkCycle = t % 4.7
    const blink = blinkCycle > 4.52 ? .08 : 1
    let eyeY = blink
    let eyeX = 1

    if (state === 'success' || interaction === 'celebration' || interaction === 'excited') {
      eyeY = Math.min(eyeY, .42)
      eyeX = 1.18
    } else if (state === 'loading' || interaction === 'typing') {
      eyeY *= .84 + Math.sin(t * 5) * .07
    } else if (state === 'error' || interaction === 'sad') {
      eyeY = Math.min(eyeY, .62)
    } else if (state === 'offline') {
      eyeX = .9
    } else if (interaction === 'sleeping') {
      eyeY = .08
      eyeX = .92
    } else if (interaction === 'thinking') {
      eyeX = .92 + Math.sin(t * 2) * .05
    }

    if (leftEyeRef.current) {
      leftEyeRef.current.scale.x = MathUtils.lerp(leftEyeRef.current.scale.x, eyeX, .2)
      leftEyeRef.current.scale.y = MathUtils.lerp(leftEyeRef.current.scale.y, eyeY, .35)
      leftEyeRef.current.rotation.z = (state === 'error' || interaction === 'sad') ? .32 : 0
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.x = MathUtils.lerp(rightEyeRef.current.scale.x, eyeX, .2)
      rightEyeRef.current.scale.y = MathUtils.lerp(rightEyeRef.current.scale.y, eyeY, .35)
      rightEyeRef.current.rotation.z = (state === 'error' || interaction === 'sad') ? -.32 : 0
    }

    if (state === 'idle') {
      robot.position.y = Math.sin(t * 1.45) * .028
      robot.rotation.y = Math.sin(t * .55) * .025
      if (headRef.current) {
        const targetY = pointer.x * .20 + Math.sin(t * .65) * .025
        const targetX = -pointer.y * .10 + Math.sin(t * .4) * .01
        headRef.current.rotation.y = MathUtils.lerp(headRef.current.rotation.y, targetY, .08)
        headRef.current.rotation.x = MathUtils.lerp(headRef.current.rotation.x, targetX, .08)
        headRef.current.rotation.z = MathUtils.lerp(headRef.current.rotation.z, Math.sin(t * .35) * .008, .1)
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .16 + Math.sin(t * 1.2) * .02
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.16 - Math.sin(t * 1.2) * .02
    }

    if (state === 'loading') {
      robot.position.y = Math.sin(t * 3) * .04
      robot.rotation.y = Math.sin(t * 1.8) * .10
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 2.4) * .14
        headRef.current.rotation.x = Math.sin(t * 1.7) * .045
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .26 + Math.sin(t * 5) * .17
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.26 - Math.sin(t * 5 + 1) * .17
    }

    if (state === 'success') {
      robot.position.y = Math.abs(Math.sin(t * 4)) * .105
      robot.rotation.y = Math.sin(t * 5) * .13
      robot.rotation.z = Math.sin(t * 8) * .035
      if (headRef.current) {
        headRef.current.rotation.x = -.04
        headRef.current.rotation.y = Math.sin(t * 5) * .06
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = 1.30 + Math.sin(t * 7) * .15
      if (rightArmRef.current) rightArmRef.current.rotation.z = -1.30 - Math.sin(t * 7) * .15
    }

    if (state === 'error') {
      robot.position.y = Math.sin(t * 1.1) * .015
      robot.rotation.z = Math.sin(t * 2.2) * .02
      if (headRef.current) {
        headRef.current.rotation.z = Math.sin(t * 1.4) * .08
        headRef.current.rotation.x = .07
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .46
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.46
    }

    if (state === 'offline') {
      robot.position.y = Math.sin(t * 1.4) * .02
      robot.rotation.y = Math.sin(t * .9) * .11
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 1.5) * .25
        headRef.current.rotation.x = Math.sin(t * .8) * .035
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .33 + Math.sin(t * 1.8) * .06
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.33 - Math.sin(t * 1.8) * .06
    }

    if (state === 'game') {
      robot.position.y = Math.abs(Math.sin(t * 5.2)) * .07
      robot.rotation.y = Math.sin(t * 2.4) * .06
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 3.2) * .07
        headRef.current.rotation.x = Math.sin(t * 4.3) * .02
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .32 + Math.sin(t * 7) * .14
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.32 - Math.sin(t * 7 + Math.PI) * .14
    }

    if (interaction === 'wave' || waving || autoGreeting) {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -1.45 + Math.sin(t * 13) * .20
        rightArmRef.current.rotation.x = -.18
      }
    }

    if (interaction === 'high-five') {
      robot.position.y = .04 + Math.sin(t * 2.4) * .015
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -1.60
        rightArmRef.current.rotation.x = -1.05
      }
      if (headRef.current) {
        headRef.current.rotation.x = -.04
        headRef.current.rotation.y = -.08
      }
    }

    if (interaction === 'dance') {
      robot.position.y = .05 + Math.abs(Math.sin(t * 4.4)) * .07
      robot.rotation.y = Math.sin(t * 4.5) * .30
      robot.rotation.z = Math.sin(t * 7) * .11
      if (leftArmRef.current) leftArmRef.current.rotation.z = .9 + Math.sin(t * 8) * .55
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.9 - Math.sin(t * 8 + Math.PI) * .55
      if (headRef.current) headRef.current.rotation.z = Math.sin(t * 5) * .09
    }

    if (interaction === 'thinking') {
      robot.position.y = Math.sin(t * 1.1) * .015
      if (headRef.current) {
        headRef.current.rotation.z = -.10
        headRef.current.rotation.y = .14 + Math.sin(t * .8) * .04
        headRef.current.rotation.x = .05
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -1.0
        rightArmRef.current.rotation.x = -.48
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .34
    }

    if (interaction === 'typing') {
      robot.position.y = .015 + Math.sin(t * 2.2) * .01
      robot.rotation.y = Math.sin(t * .9) * .035
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = .55 + Math.sin(t * 10) * .10
        leftArmRef.current.rotation.x = -.72
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -.55 - Math.sin(t * 10 + .8) * .10
        rightArmRef.current.rotation.x = -.72
      }
      if (headRef.current) headRef.current.rotation.x = .10 + Math.sin(t * 3) * .015
    }

    if (interaction === 'sleeping') {
      robot.position.y = -.035 + Math.sin(t * .75) * .008
      robot.rotation.z = -.04
      if (headRef.current) {
        headRef.current.rotation.x = .17 + Math.sin(t * .7) * .025
        headRef.current.rotation.z = -.10
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .34
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.34
    }

    if (interaction === 'excited') {
      robot.position.y = Math.abs(Math.sin(t * 5)) * .13
      robot.rotation.z = Math.sin(t * 9) * .04
      if (leftArmRef.current) leftArmRef.current.rotation.z = 1.18 + Math.sin(t * 8) * .15
      if (rightArmRef.current) rightArmRef.current.rotation.z = -1.18 - Math.sin(t * 8) * .15
      if (headRef.current) headRef.current.rotation.y = Math.sin(t * 7) * .08
    }

    if (interaction === 'sad') {
      robot.position.y = -.04 + Math.sin(t * .8) * .008
      if (headRef.current) {
        headRef.current.rotation.x = .16
        headRef.current.rotation.z = .05
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .40
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.40
    }

    if (interaction === 'celebration') {
      robot.position.y = Math.abs(Math.sin(t * 4.5)) * .14
      robot.rotation.y = Math.sin(t * 6) * .18
      robot.rotation.z = Math.sin(t * 10) * .055
      if (leftArmRef.current) leftArmRef.current.rotation.z = 1.42 + Math.sin(t * 9) * .18
      if (rightArmRef.current) rightArmRef.current.rotation.z = -1.42 - Math.sin(t * 9) * .18
    }
  })

  const robe = outfit !== 'default'
  const clothColor = outfit === 'saudi-red' ? '#d92f45' : '#fbfbfb'
  const clothSecondary = outfit === 'saudi-red' ? '#fff1f3' : '#f0f0f0'
  const sadFace = state === 'error' || interaction === 'sad'

  const poke = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    waveUntil.current = performance.now() + 1400
    onPoke?.()
  }

  return (
    <group ref={robotRef} onClick={poke}>
      <group ref={headRef} position={[0, .03, 0]}>
        <mesh position={[0, 1.38, 0]} scale={[1.13, .95, 1.02]} castShadow>
          <sphereGeometry args={[.73, 64, 64]} />
          <meshPhysicalMaterial color={SHELL} roughness={.16} metalness={.02} clearcoat={.75} clearcoatRoughness={.12} />
        </mesh>
        <mesh position={[0, 1.94, -.03]} rotation={[Math.PI / 2, 0, 0]} scale={[1.06, .88, 1]}>
          <torusGeometry args={[.47, .042, 16, 64]} />
          <meshPhysicalMaterial color={BLUE} roughness={.18} clearcoat={.7} />
        </mesh>
        <mesh position={[0, 1.39, .645]} scale={[.99, .67, .34]}>
          <sphereGeometry args={[.70, 64, 64]} />
          <meshPhysicalMaterial color={BLUE_DARK} roughness={.12} clearcoat={.7} />
        </mesh>
        <mesh position={[0, 1.39, .682]} scale={[.93, .61, .31]}>
          <sphereGeometry args={[.70, 64, 64]} />
          <meshPhysicalMaterial color={VISOR} roughness={.035} metalness={.18} clearcoat={1} clearcoatRoughness={.03} />
        </mesh>
        <mesh position={[-.22, 1.63, .895]} rotation={[0, 0, -.16]} scale={[1.45, .38, .16]}>
          <sphereGeometry args={[.16, 28, 28]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={.16} />
        </mesh>
        <mesh ref={leftEyeRef} position={[-.24, 1.45, .903]} scale={[1.05, .92, .42]}>
          <sphereGeometry args={[.072, 32, 32]} />
          <meshStandardMaterial color={CYAN} emissive="#35ddff" emissiveIntensity={3.8} toneMapped={false} />
        </mesh>
        <mesh ref={rightEyeRef} position={[.24, 1.45, .903]} scale={[1.05, .92, .42]}>
          <sphereGeometry args={[.072, 32, 32]} />
          <meshStandardMaterial color={CYAN} emissive="#35ddff" emissiveIntensity={3.8} toneMapped={false} />
        </mesh>
        {!sadFace ? (
          <mesh position={[0, 1.25, .904]} rotation={[0, 0, Math.PI]} scale={[1, .52, .45]}>
            <torusGeometry args={[.165, .023, 12, 40, Math.PI]} />
            <meshStandardMaterial color={CYAN} emissive="#35ddff" emissiveIntensity={3} toneMapped={false} />
          </mesh>
        ) : (
          <mesh position={[0, 1.25, .904]}>
            <boxGeometry args={[.20, .024, .018]} />
            <meshStandardMaterial color="#ff9b9b" emissive="#ff4b4b" emissiveIntensity={2} toneMapped={false} />
          </mesh>
        )}
        <group position={[-.79, 1.39, -.015]} rotation={[0, 0, Math.PI / 2]}>
          <mesh><cylinderGeometry args={[.225, .225, .17, 48]} /><meshPhysicalMaterial color={BLUE} roughness={.16} clearcoat={.75} /></mesh>
          <mesh position={[0, .095, 0]}><cylinderGeometry args={[.165, .165, .055, 48]} /><meshPhysicalMaterial color={SHELL} roughness={.18} clearcoat={.65} /></mesh>
          <mesh position={[0, .13, 0]}><cylinderGeometry args={[.09, .09, .025, 40]} /><meshStandardMaterial color={CYAN} emissive="#35ddff" emissiveIntensity={1.7} /></mesh>
        </group>
        <group position={[.79, 1.39, -.015]} rotation={[0, 0, Math.PI / 2]}>
          <mesh><cylinderGeometry args={[.225, .225, .17, 48]} /><meshPhysicalMaterial color={BLUE} roughness={.16} clearcoat={.75} /></mesh>
          <mesh position={[0, -.095, 0]}><cylinderGeometry args={[.165, .165, .055, 48]} /><meshPhysicalMaterial color={SHELL} roughness={.18} clearcoat={.65} /></mesh>
          <mesh position={[0, -.13, 0]}><cylinderGeometry args={[.09, .09, .025, 40]} /><meshStandardMaterial color={CYAN} emissive="#35ddff" emissiveIntensity={1.7} /></mesh>
        </group>
        <group position={[.48, 1.97, -.045]} rotation={[0, 0, -.20]}>
          <mesh position={[0, .16, 0]}><cylinderGeometry args={[.022, .026, .34, 16]} /><meshStandardMaterial color="#26394f" metalness={.42} roughness={.25} /></mesh>
          <mesh position={[0, .35, 0]}><sphereGeometry args={[.072, 28, 28]} /><meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={.65} /></mesh>
        </group>
        {robe && <>
          <mesh position={[0, 1.99, -.10]} scale={[1.03, .19, .86]}><sphereGeometry args={[.72, 40, 40]} /><meshStandardMaterial color={clothColor} roughness={.85} /></mesh>
          <mesh position={[-.55, 1.65, -.34]} rotation={[.08, .03, -.18]} scale={[.64, 1.08, .42]}><capsuleGeometry args={[.18, .55, 8, 20]} /><meshStandardMaterial color={clothColor} roughness={.88} /></mesh>
          <mesh position={[.55, 1.65, -.34]} rotation={[.08, -.03, .18]} scale={[.64, 1.08, .42]}><capsuleGeometry args={[.18, .55, 8, 20]} /><meshStandardMaterial color={clothColor} roughness={.88} /></mesh>
          <mesh position={[0, 1.72, -.56]} rotation={[.18, 0, 0]} scale={[1, .64, .38]}><sphereGeometry args={[.50, 32, 32]} /><meshStandardMaterial color={clothSecondary} roughness={.9} /></mesh>
          <mesh position={[0, 2.04, -.015]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.49, .052, 14, 48]} /><meshStandardMaterial color="#121212" roughness={.6} /></mesh>
        </>}
      </group>

      <mesh position={[0, .80, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[.31, .05, 16, 48]} />
        <meshPhysicalMaterial color={BLUE} roughness={.18} clearcoat={.65} />
      </mesh>

      {robe ? (
        <>
          <mesh position={[0, .05, 0]} castShadow><cylinderGeometry args={[.41, .54, 1.10, 36]} /><meshPhysicalMaterial color="#fff" roughness={.38} clearcoat={.35} /></mesh>
          <mesh position={[0, .53, 0]} scale={[1.02, .70, .92]}><capsuleGeometry args={[.41, .34, 10, 28]} /><meshPhysicalMaterial color="#fff" roughness={.34} clearcoat={.4} /></mesh>
        </>
      ) : (
        <>
          <mesh position={[0, .20, 0]} scale={[.98, 1.02, .86]} castShadow><capsuleGeometry args={[.44, .64, 10, 32]} /><meshPhysicalMaterial color={SHELL} roughness={.17} metalness={.015} clearcoat={.72} clearcoatRoughness={.12} /></mesh>
          <mesh position={[0, .10, .42]} scale={[.80, .88, .18]}><sphereGeometry args={[.42, 40, 40]} /><meshPhysicalMaterial color={SHELL_SOFT} roughness={.22} clearcoat={.45} /></mesh>
        </>
      )}

      <mesh position={[-.42, -.17, .02]} scale={[.30, .55, .45]}><sphereGeometry args={[.15, 24, 24]} /><meshPhysicalMaterial color={BLUE} roughness={.18} clearcoat={.55} /></mesh>
      <mesh position={[.42, -.17, .02]} scale={[.30, .55, .45]}><sphereGeometry args={[.15, 24, 24]} /><meshPhysicalMaterial color={BLUE} roughness={.18} clearcoat={.55} /></mesh>
      <ChestMark />
      <Arm side={-1} armRef={leftArmRef} robe={robe} />
      <Arm side={1} armRef={rightArmRef} robe={robe} />
      <Leg side={-1} />
      <Leg side={1} />
    </group>
  )
}
