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

    robot.rotation.x *= .9
    robot.rotation.z *= .9

    const blinkCycle = t % 4.7
    const blink = blinkCycle > 4.52 ? .08 : 1
    let eyeY = blink
    let eyeX = 1

    if (state === 'success') {
      eyeY = Math.min(eyeY, .38)
      eyeX = 1.18
    } else if (state === 'loading') {
      eyeY *= .82 + Math.sin(t * 5) * .08
    } else if (state === 'error') {
      eyeY = Math.min(eyeY, .62)
    } else if (state === 'offline') {
      eyeX = .9
    }

    if (leftEyeRef.current) {
      leftEyeRef.current.scale.x = MathUtils.lerp(leftEyeRef.current.scale.x, eyeX, .2)
      leftEyeRef.current.scale.y = MathUtils.lerp(leftEyeRef.current.scale.y, eyeY, .35)
      leftEyeRef.current.rotation.z = state === 'error' ? .38 : 0
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.x = MathUtils.lerp(rightEyeRef.current.scale.x, eyeX, .2)
      rightEyeRef.current.scale.y = MathUtils.lerp(rightEyeRef.current.scale.y, eyeY, .35)
      rightEyeRef.current.rotation.z = state === 'error' ? -.38 : 0
    }

    if (state === 'idle') {
      robot.position.y = Math.sin(t * 1.5) * .035
      robot.rotation.y = Math.sin(t * .55) * .035

      if (headRef.current) {
        const targetY = pointer.x * .24 + Math.sin(t * .65) * .035
        const targetX = -pointer.y * .13 + Math.sin(t * .4) * .015
        headRef.current.rotation.y = MathUtils.lerp(headRef.current.rotation.y, targetY, .08)
        headRef.current.rotation.x = MathUtils.lerp(headRef.current.rotation.x, targetX, .08)
        headRef.current.rotation.z = MathUtils.lerp(headRef.current.rotation.z, 0, .1)
      }

      if (leftArmRef.current) leftArmRef.current.rotation.z = .25 + Math.sin(t * 1.2) * .025
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.25 - Math.sin(t * 1.2) * .025
    }

    if (state === 'loading') {
      robot.position.y = Math.sin(t * 3) * .045
      robot.rotation.y = Math.sin(t * 1.8) * .12
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 2.4) * .18
        headRef.current.rotation.x = Math.sin(t * 1.7) * .06
        headRef.current.rotation.z = 0
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .35 + Math.sin(t * 5) * .2
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.35 - Math.sin(t * 5 + 1) * .2
    }

    if (state === 'success') {
      robot.position.y = Math.abs(Math.sin(t * 4)) * .13
      robot.rotation.y = Math.sin(t * 5) * .16
      robot.rotation.z = Math.sin(t * 8) * .045
      if (headRef.current) {
        headRef.current.rotation.x = -.05
        headRef.current.rotation.y = Math.sin(t * 5) * .08
        headRef.current.rotation.z = 0
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = 1.7 + Math.sin(t * 7) * .18
      if (rightArmRef.current) rightArmRef.current.rotation.z = -1.7 - Math.sin(t * 7) * .18
    }

    if (state === 'error') {
      robot.position.y = Math.sin(t * 1.1) * .02
      robot.rotation.z = Math.sin(t * 2.2) * .025
      if (headRef.current) {
        headRef.current.rotation.z = Math.sin(t * 1.4) * .1
        headRef.current.rotation.x = .09
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .6
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.6
    }

    if (state === 'offline') {
      robot.position.y = Math.sin(t * 1.4) * .025
      robot.rotation.y = Math.sin(t * .9) * .14
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 1.5) * .32
        headRef.current.rotation.x = Math.sin(t * .8) * .04
        headRef.current.rotation.z = 0
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .45 + Math.sin(t * 1.8) * .08
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.45 - Math.sin(t * 1.8) * .08
    }

    if (state === 'game') {
      robot.position.y = Math.abs(Math.sin(t * 5.2)) * .08
      robot.rotation.y = Math.sin(t * 2.4) * .08
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 3.2) * .09
        headRef.current.rotation.x = Math.sin(t * 4.3) * .025
        headRef.current.rotation.z = 0
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .42 + Math.sin(t * 7) * .18
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.42 - Math.sin(t * 7 + Math.PI) * .18
    }

    if (waving && rightArmRef.current) {
      rightArmRef.current.rotation.z = -1.75 + Math.sin(t * 13) * .22
    }
  })

  const robe = outfit !== 'default'
  const clothColor = outfit === 'saudi-red' ? '#d92f45' : '#fafafa'

  const poke = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    waveUntil.current = performance.now() + 1400
    onPoke?.()
  }

  return (
    <group ref={robotRef} onClick={poke}>
      <group ref={headRef}>
        <mesh position={[0, 1.25, 0]}>
          <sphereGeometry args={[.72, 48, 48]} />
          <meshStandardMaterial color="#f5f8ff" metalness={.12} roughness={.3} />
        </mesh>

        {/* Face display deliberately sits on the front surface of the head. */}
        <mesh position={[0, 1.29, .695]} scale={[1, .78, 1]}>
          <boxGeometry args={[1.02, .61, .055]} />
          <meshStandardMaterial color="#061a34" metalness={.28} roughness={.18} />
        </mesh>

        <mesh ref={leftEyeRef} position={[-.24, 1.35, .735]}>
          <sphereGeometry args={[.078, 24, 24]} />
          <meshStandardMaterial color="#8cf4ff" emissive="#25d8ff" emissiveIntensity={3.2} toneMapped={false} />
        </mesh>
        <mesh ref={rightEyeRef} position={[.24, 1.35, .735]}>
          <sphereGeometry args={[.078, 24, 24]} />
          <meshStandardMaterial color="#8cf4ff" emissive="#25d8ff" emissiveIntensity={3.2} toneMapped={false} />
        </mesh>

        {state !== 'error' ? (
          <mesh position={[0, 1.16, .738]} rotation={[0, 0, Math.PI]} scale={[1, .55, 1]}>
            <torusGeometry args={[.17, .025, 10, 30, Math.PI]} />
            <meshStandardMaterial color="#70efff" emissive="#25d8ff" emissiveIntensity={2.4} toneMapped={false} />
          </mesh>
        ) : (
          <mesh position={[0, 1.16, .738]}>
            <boxGeometry args={[.22, .025, .018]} />
            <meshStandardMaterial color="#ff8f8f" emissive="#ff5151" emissiveIntensity={1.7} toneMapped={false} />
          </mesh>
        )}

        {robe && <>
          {/* Ghutra / shemagh cap stays behind the face instead of covering it. */}
          <mesh position={[0, 1.78, -.13]} scale={[1, .22, .82]}>
            <sphereGeometry args={[.72, 36, 36]} />
            <meshStandardMaterial color={clothColor} roughness={.78} />
          </mesh>
          <mesh position={[-.55, 1.36, -.24]} rotation={[0, 0, -.12]}>
            <boxGeometry args={[.28, .82, .08]} />
            <meshStandardMaterial color={clothColor} roughness={.82} />
          </mesh>
          <mesh position={[.55, 1.36, -.24]} rotation={[0, 0, .12]}>
            <boxGeometry args={[.28, .82, .08]} />
            <meshStandardMaterial color={clothColor} roughness={.82} />
          </mesh>
          <mesh position={[0, 1.82, -.02]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[.5, .055, 12, 40]} />
            <meshStandardMaterial color="#121212" roughness={.65} />
          </mesh>
        </>}
      </group>

      {robe ? (
        <>
          <mesh position={[0, .12, 0]}>
            <cylinderGeometry args={[.46, .61, 1.28, 32]} />
            <meshStandardMaterial color="#fff" roughness={.58} />
          </mesh>
          <mesh position={[0, .68, 0]} scale={[1.04, .65, .92]}>
            <capsuleGeometry args={[.43, .42, 8, 24]} />
            <meshStandardMaterial color="#fff" roughness={.5} />
          </mesh>
        </>
      ) : (
        <mesh position={[0, .22, 0]}>
          <capsuleGeometry args={[.48, .8, 8, 24]} />
          <meshStandardMaterial color="#eaf1ff" roughness={.45} />
        </mesh>
      )}

      <mesh position={[0, .32, .5]}>
        <boxGeometry args={[.46, .2, .06]} />
        <meshStandardMaterial color="#0a6cff" emissive="#075bd8" emissiveIntensity={.35} />
      </mesh>

      <group ref={leftArmRef} position={[-.66, .38, 0]} rotation={[0, 0, .25]}>
        <mesh>
          <capsuleGeometry args={[.14, .65, 6, 18]} />
          <meshStandardMaterial color={robe ? '#fff' : '#f5f8ff'} roughness={.42} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[.66, .38, 0]} rotation={[0, 0, -.25]}>
        <mesh>
          <capsuleGeometry args={[.14, .65, 6, 18]} />
          <meshStandardMaterial color={robe ? '#fff' : '#f5f8ff'} roughness={.42} />
        </mesh>
      </group>

      <mesh position={[-.3, -.72, 0]}>
        <capsuleGeometry args={[.16, .55, 6, 18]} />
        <meshStandardMaterial color="#e9eef9" />
      </mesh>
      <mesh position={[.3, -.72, 0]}>
        <capsuleGeometry args={[.16, .55, 6, 18]} />
        <meshStandardMaterial color="#e9eef9" />
      </mesh>
    </group>
  )
}
