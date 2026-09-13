import { useFrame } from '@react-three/fiber'
import { Group, MathUtils, Mesh } from 'three'
import { useRef } from 'react'
import type { CompanionState, Outfit } from '../lib/types'

export function Robot({ state, outfit, onPoke }: { state: CompanionState; outfit: Outfit; onPoke?: () => void }) {
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
    const autoGreeting = state === 'idle' && (t % 13.5) > 11.7

    robot.rotation.x *= .9
    robot.rotation.z *= .9

    const blinkCycle = t % 4.7
    const blink = blinkCycle > 4.52 ? .08 : 1
    let eyeY = blink
    let eyeX = 1

    if (state === 'success') {
      eyeY = Math.min(eyeY, .42)
      eyeX = 1.18
    } else if (state === 'loading') {
      eyeY *= .84 + Math.sin(t * 5) * .07
    } else if (state === 'error') {
      eyeY = Math.min(eyeY, .62)
    } else if (state === 'offline') {
      eyeX = .9
    }

    if (leftEyeRef.current) {
      leftEyeRef.current.scale.x = MathUtils.lerp(leftEyeRef.current.scale.x, eyeX, .2)
      leftEyeRef.current.scale.y = MathUtils.lerp(leftEyeRef.current.scale.y, eyeY, .35)
      leftEyeRef.current.rotation.z = state === 'error' ? .32 : 0
    }

    if (rightEyeRef.current) {
      rightEyeRef.current.scale.x = MathUtils.lerp(rightEyeRef.current.scale.x, eyeX, .2)
      rightEyeRef.current.scale.y = MathUtils.lerp(rightEyeRef.current.scale.y, eyeY, .35)
      rightEyeRef.current.rotation.z = state === 'error' ? -.32 : 0
    }

    if (state === 'idle') {
      robot.position.y = Math.sin(t * 1.45) * .035
      robot.rotation.y = Math.sin(t * .55) * .035
      if (headRef.current) {
        const targetY = pointer.x * .22 + Math.sin(t * .65) * .03
        const targetX = -pointer.y * .11 + Math.sin(t * .4) * .012
        headRef.current.rotation.y = MathUtils.lerp(headRef.current.rotation.y, targetY, .08)
        headRef.current.rotation.x = MathUtils.lerp(headRef.current.rotation.x, targetX, .08)
        headRef.current.rotation.z = MathUtils.lerp(headRef.current.rotation.z, Math.sin(t * .35) * .01, .1)
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .18 + Math.sin(t * 1.2) * .025
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.18 - Math.sin(t * 1.2) * .025
    }

    if (state === 'loading') {
      robot.position.y = Math.sin(t * 3) * .045
      robot.rotation.y = Math.sin(t * 1.8) * .12
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 2.4) * .15
        headRef.current.rotation.x = Math.sin(t * 1.7) * .05
        headRef.current.rotation.z = 0
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .28 + Math.sin(t * 5) * .18
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.28 - Math.sin(t * 5 + 1) * .18
    }

    if (state === 'success') {
      robot.position.y = Math.abs(Math.sin(t * 4)) * .12
      robot.rotation.y = Math.sin(t * 5) * .15
      robot.rotation.z = Math.sin(t * 8) * .04
      if (headRef.current) {
        headRef.current.rotation.x = -.04
        headRef.current.rotation.y = Math.sin(t * 5) * .07
        headRef.current.rotation.z = 0
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = 1.45 + Math.sin(t * 7) * .16
      if (rightArmRef.current) rightArmRef.current.rotation.z = -1.45 - Math.sin(t * 7) * .16
    }

    if (state === 'error') {
      robot.position.y = Math.sin(t * 1.1) * .02
      robot.rotation.z = Math.sin(t * 2.2) * .025
      if (headRef.current) {
        headRef.current.rotation.z = Math.sin(t * 1.4) * .09
        headRef.current.rotation.x = .08
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .52
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.52
    }

    if (state === 'offline') {
      robot.position.y = Math.sin(t * 1.4) * .025
      robot.rotation.y = Math.sin(t * .9) * .13
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 1.5) * .28
        headRef.current.rotation.x = Math.sin(t * .8) * .04
        headRef.current.rotation.z = 0
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .36 + Math.sin(t * 1.8) * .07
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.36 - Math.sin(t * 1.8) * .07
    }

    if (state === 'game') {
      robot.position.y = Math.abs(Math.sin(t * 5.2)) * .075
      robot.rotation.y = Math.sin(t * 2.4) * .07
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 3.2) * .08
        headRef.current.rotation.x = Math.sin(t * 4.3) * .022
        headRef.current.rotation.z = 0
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .35 + Math.sin(t * 7) * .16
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.35 - Math.sin(t * 7 + Math.PI) * .16
    }

    if ((waving || autoGreeting) && rightArmRef.current) {
      rightArmRef.current.rotation.z = -1.55 + Math.sin(t * 13) * .22
    }
  })

  const robe = outfit !== 'default'
  const clothColor = outfit === 'saudi-red' ? '#d92f45' : '#fbfbfb'
  const clothSecondary = outfit === 'saudi-red' ? '#fff1f3' : '#f0f0f0'
  const shell = '#f8fbff'
  const shellSoft = '#eaf1fb'
  const blue = '#0b6cff'
  const blueDark = '#0759d4'
  const visor = '#061426'

  const poke = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    waveUntil.current = performance.now() + 1400
    onPoke?.()
  }

  return (
    <group ref={robotRef} onClick={poke}>
      {/* HEAD / HELMET */}
      <group ref={headRef} position={[0, .04, 0]}>
        <mesh position={[0, 1.34, 0]} scale={[1.08, .93, .98]} castShadow>
          <sphereGeometry args={[.72, 64, 64]} />
          <meshPhysicalMaterial color={shell} roughness={.2} metalness={.03} clearcoat={.55} clearcoatRoughness={.2} />
        </mesh>

        {/* blue helmet crown accent */}
        <mesh position={[0, 1.88, -.02]} rotation={[Math.PI / 2, 0, 0]} scale={[1.02, .88, 1]}>
          <torusGeometry args={[.47, .045, 16, 64]} />
          <meshPhysicalMaterial color={blue} roughness={.22} clearcoat={.5} />
        </mesh>

        {/* curved glossy visor */}
        <mesh position={[0, 1.36, .64]} scale={[.94, .62, .32]}>
          <sphereGeometry args={[.68, 64, 64]} />
          <meshPhysicalMaterial color={visor} roughness={.08} metalness={.15} clearcoat={1} clearcoatRoughness={.07} />
        </mesh>

        {/* visor blue rim */}
        <mesh position={[0, 1.36, .595]} scale={[1.01, .70, .34]}>
          <sphereGeometry args={[.68, 64, 64]} />
          <meshStandardMaterial color={blueDark} transparent opacity={.16} />
        </mesh>

        {/* face */}
        <mesh ref={leftEyeRef} position={[-.24, 1.42, .858]} scale={[1, 1, .45]}>
          <sphereGeometry args={[.07, 32, 32]} />
          <meshStandardMaterial color="#8cf7ff" emissive="#35ddff" emissiveIntensity={3.5} toneMapped={false} />
        </mesh>
        <mesh ref={rightEyeRef} position={[.24, 1.42, .858]} scale={[1, 1, .45]}>
          <sphereGeometry args={[.07, 32, 32]} />
          <meshStandardMaterial color="#8cf7ff" emissive="#35ddff" emissiveIntensity={3.5} toneMapped={false} />
        </mesh>

        {state !== 'error' ? (
          <mesh position={[0, 1.23, .858]} rotation={[0, 0, Math.PI]} scale={[1, .52, .5]}>
            <torusGeometry args={[.16, .024, 12, 36, Math.PI]} />
            <meshStandardMaterial color="#7ef2ff" emissive="#35ddff" emissiveIntensity={2.8} toneMapped={false} />
          </mesh>
        ) : (
          <mesh position={[0, 1.24, .858]}>
            <boxGeometry args={[.20, .024, .018]} />
            <meshStandardMaterial color="#ff9b9b" emissive="#ff4b4b" emissiveIntensity={2} toneMapped={false} />
          </mesh>
        )}

        {/* ear modules */}
        <group position={[-.77, 1.37, -.02]} rotation={[0, 0, Math.PI / 2]}>
          <mesh><cylinderGeometry args={[.22, .22, .16, 40]} /><meshPhysicalMaterial color={blue} roughness={.22} clearcoat={.55} /></mesh>
          <mesh position={[0, .095, 0]}><cylinderGeometry args={[.145, .145, .055, 40]} /><meshPhysicalMaterial color={shell} roughness={.2} clearcoat={.5} /></mesh>
        </group>
        <group position={[.77, 1.37, -.02]} rotation={[0, 0, Math.PI / 2]}>
          <mesh><cylinderGeometry args={[.22, .22, .16, 40]} /><meshPhysicalMaterial color={blue} roughness={.22} clearcoat={.55} /></mesh>
          <mesh position={[0, -.095, 0]}><cylinderGeometry args={[.145, .145, .055, 40]} /><meshPhysicalMaterial color={shell} roughness={.2} clearcoat={.5} /></mesh>
        </group>

        {/* antenna */}
        <mesh position={[.48, 2.0, -.04]} rotation={[0, 0, -.22]}>
          <cylinderGeometry args={[.025, .025, .34, 16]} />
          <meshStandardMaterial color="#354b68" metalness={.45} roughness={.3} />
        </mesh>
        <mesh position={[.515, 2.17, -.04]}>
          <sphereGeometry args={[.075, 24, 24]} />
          <meshStandardMaterial color={blue} emissive={blue} emissiveIntensity={.5} />
        </mesh>

        {/* optional Saudi headwear layered around the same robot helmet */}
        {robe && <>
          <mesh position={[0, 1.95, -.10]} scale={[1.02, .19, .84]}>
            <sphereGeometry args={[.72, 40, 40]} />
            <meshStandardMaterial color={clothColor} roughness={.85} />
          </mesh>
          <mesh position={[-.55, 1.63, -.34]} rotation={[.08, .03, -.18]} scale={[.64, 1.1, .42]}>
            <capsuleGeometry args={[.18, .55, 8, 20]} />
            <meshStandardMaterial color={clothColor} roughness={.88} />
          </mesh>
          <mesh position={[.55, 1.63, -.34]} rotation={[.08, -.03, .18]} scale={[.64, 1.1, .42]}>
            <capsuleGeometry args={[.18, .55, 8, 20]} />
            <meshStandardMaterial color={clothColor} roughness={.88} />
          </mesh>
          <mesh position={[0, 1.70, -.56]} rotation={[.18, 0, 0]} scale={[1.0, .64, .38]}>
            <sphereGeometry args={[.50, 32, 32]} />
            <meshStandardMaterial color={clothSecondary} roughness={.9} />
          </mesh>
          <mesh position={[0, 2.0, -.015]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[.49, .052, 14, 48]} />
            <meshStandardMaterial color="#121212" roughness={.6} />
          </mesh>
        </>}
      </group>

      {/* NECK */}
      <mesh position={[0, .79, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[.33, .055, 16, 48]} />
        <meshPhysicalMaterial color={blue} roughness={.25} clearcoat={.4} />
      </mesh>

      {/* BODY */}
      {robe ? (
        <>
          <mesh position={[0, .05, 0]} castShadow>
            <cylinderGeometry args={[.42, .55, 1.14, 36]} />
            <meshPhysicalMaterial color="#fff" roughness={.42} clearcoat={.28} />
          </mesh>
          <mesh position={[0, .54, 0]} scale={[1.02, .7, .92]}>
            <capsuleGeometry args={[.42, .34, 10, 28]} />
            <meshPhysicalMaterial color="#fff" roughness={.38} clearcoat={.3} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[0, .20, 0]} scale={[1.0, 1.06, .88]} castShadow>
            <capsuleGeometry args={[.45, .68, 10, 32]} />
            <meshPhysicalMaterial color={shell} roughness={.24} metalness={.02} clearcoat={.5} clearcoatRoughness={.2} />
          </mesh>
          <mesh position={[0, .10, .435]} scale={[.82, .88, .20]}>
            <sphereGeometry args={[.42, 40, 40]} />
            <meshPhysicalMaterial color={shellSoft} roughness={.28} clearcoat={.3} />
          </mesh>
        </>
      )}

      {/* chest blue HN-style mark */}
      <group position={[0, .30, .49]}>
        <mesh position={[-.11, 0, 0]}><boxGeometry args={[.055, .22, .035]} /><meshStandardMaterial color={blue} emissive={blueDark} emissiveIntensity={.25} /></mesh>
        <mesh position={[.01, 0, 0]}><boxGeometry args={[.055, .22, .035]} /><meshStandardMaterial color={blue} emissive={blueDark} emissiveIntensity={.25} /></mesh>
        <mesh position={[-.05, 0, 0]}><boxGeometry args={[.12, .045, .035]} /><meshStandardMaterial color={blue} emissive={blueDark} emissiveIntensity={.25} /></mesh>
        <mesh position={[.12, 0, 0]} rotation={[0, 0, -.38]}><boxGeometry args={[.05, .23, .035]} /><meshStandardMaterial color={blue} emissive={blueDark} emissiveIntensity={.25} /></mesh>
        <mesh position={[.20, 0, 0]}><boxGeometry args={[.05, .22, .035]} /><meshStandardMaterial color={blue} emissive={blueDark} emissiveIntensity={.25} /></mesh>
      </group>

      {/* ARMS */}
      <group ref={leftArmRef} position={[-.57, .48, 0]} rotation={[0, 0, .18]}>
        <mesh position={[0, .06, 0]}><sphereGeometry args={[.19, 28, 28]} /><meshPhysicalMaterial color={shell} roughness={.22} clearcoat={.45} /></mesh>
        <mesh position={[-.05, -.26, 0]}><capsuleGeometry args={[.12, .38, 8, 22]} /><meshPhysicalMaterial color={shell} roughness={.25} clearcoat={.35} /></mesh>
        <mesh position={[-.05, -.48, .02]}><sphereGeometry args={[.14, 24, 24]} /><meshPhysicalMaterial color={blue} roughness={.25} clearcoat={.45} /></mesh>
        <mesh position={[-.05, -.63, .02]} scale={[1.12, .92, 1.0]}><sphereGeometry args={[.16, 28, 28]} /><meshPhysicalMaterial color={shell} roughness={.24} clearcoat={.4} /></mesh>
      </group>

      <group ref={rightArmRef} position={[.57, .48, 0]} rotation={[0, 0, -.18]}>
        <mesh position={[0, .06, 0]}><sphereGeometry args={[.19, 28, 28]} /><meshPhysicalMaterial color={shell} roughness={.22} clearcoat={.45} /></mesh>
        <mesh position={[.05, -.26, 0]}><capsuleGeometry args={[.12, .38, 8, 22]} /><meshPhysicalMaterial color={shell} roughness={.25} clearcoat={.35} /></mesh>
        <mesh position={[
          .05, -.48, .02
        ]}><sphereGeometry args={[.14, 24, 24]} /><meshPhysicalMaterial color={blue} roughness={.25} clearcoat={.45} /></mesh>
        <mesh position={[.05, -.63, .02]} scale={[1.12, .92, 1.0]}><sphereGeometry args={[.16, 28, 28]} /><meshPhysicalMaterial color={shell} roughness={.24} clearcoat={.4} /></mesh>
      </group>

      {/* HIPS */}
      <mesh position={[0, -.43, 0]} scale={[1.1, .55, .82]}>
        <sphereGeometry args={[.40, 36, 36]} />
        <meshPhysicalMaterial color={shellSoft} roughness={.28} clearcoat={.3} />
      </mesh>

      {/* LEGS */}
      <group position={[-.25, -.68, 0]}>
        <mesh><capsuleGeometry args={[.14, .38, 8, 22]} /><meshPhysicalMaterial color={shell} roughness={.24} clearcoat={.4} /></mesh>
        <mesh position={[0, -.29, .015]}><sphereGeometry args={[.13, 24, 24]} /><meshPhysicalMaterial color={blue} roughness={.25} clearcoat={.4} /></mesh>
        <mesh position={[0, -.47, .08]} scale={[1.35, .70, 1.65]}><sphereGeometry args={[.17, 30, 30]} /><meshPhysicalMaterial color={shell} roughness={.24} clearcoat={.42} /></mesh>
      </group>
      <group position={[.25, -.68, 0]}>
        <mesh><capsuleGeometry args={[.14, .38, 8, 22]} /><meshPhysicalMaterial color={shell} roughness={.24} clearcoat={.4} /></mesh>
        <mesh position={[0, -.29, .015]}><sphereGeometry args={[.13, 24, 24]} /><meshPhysicalMaterial color={blue} roughness={.25} clearcoat={.4} /></mesh>
        <mesh position={[0, -.47, .08]} scale={[1.35, .70, 1.65]}><sphereGeometry args={[.17, 30, 30]} /><meshPhysicalMaterial color={shell} roughness={.24} clearcoat={.42} /></mesh>
      </group>
    </group>
  )
}
