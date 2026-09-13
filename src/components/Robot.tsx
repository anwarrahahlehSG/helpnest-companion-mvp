import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { useRef } from 'react'
import type { CompanionState, Outfit } from '../lib/types'

export function Robot({ state, outfit, onPoke }: { state: CompanionState; outfit: Outfit; onPoke?: () => void }) {
  const robotRef = useRef<Group>(null)
  const headRef = useRef<Group>(null)
  const leftArmRef = useRef<Group>(null)
  const rightArmRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    const robot = robotRef.current
    if (!robot) return
    const t = clock.getElapsedTime()
    robot.rotation.x *= .9
    robot.rotation.z *= .9
    if (state === 'idle') {
      robot.position.y = Math.sin(t * 1.5) * .035
      robot.rotation.y = Math.sin(t * .55) * .07
      if (headRef.current) { headRef.current.rotation.y = Math.sin(t * .75) * .1; headRef.current.rotation.x = Math.sin(t * .45) * .025 }
    }
    if (state === 'loading') {
      robot.position.y = Math.sin(t * 3) * .045
      robot.rotation.y = Math.sin(t * 1.8) * .12
      if (headRef.current) { headRef.current.rotation.y = Math.sin(t * 2.4) * .18; headRef.current.rotation.x = Math.sin(t * 1.7) * .06 }
      if (leftArmRef.current) leftArmRef.current.rotation.z = .35 + Math.sin(t * 5) * .2
      if (rightArmRef.current) rightArmRef.current.rotation.z = -.35 - Math.sin(t * 5 + 1) * .2
    }
    if (state === 'success') {
      robot.position.y = Math.abs(Math.sin(t * 4)) * .13
      robot.rotation.y = Math.sin(t * 5) * .16
      robot.rotation.z = Math.sin(t * 8) * .045
      if (leftArmRef.current) leftArmRef.current.rotation.z = 1.7 + Math.sin(t * 7) * .18
      if (rightArmRef.current) rightArmRef.current.rotation.z = -1.7 - Math.sin(t * 7) * .18
    }
    if (state === 'error') {
      robot.position.y = Math.sin(t * 1.1) * .02
      robot.rotation.z = Math.sin(t * 2.2) * .025
      if (headRef.current) { headRef.current.rotation.z = Math.sin(t * 1.4) * .1; headRef.current.rotation.x = .08 }
    }
    if (state === 'offline') {
      robot.position.y = Math.sin(t * 1.4) * .025
      robot.rotation.y = Math.sin(t * .9) * .14
      if (headRef.current) { headRef.current.rotation.y = Math.sin(t * 1.5) * .32; headRef.current.rotation.x = Math.sin(t * .8) * .04 }
    }
  })

  const robe = outfit !== 'default'
  return (
    <group ref={robotRef} onClick={(e) => { e.stopPropagation(); onPoke?.() }}>
      <group ref={headRef}>
        <mesh position={[0, 1.25, 0]}><sphereGeometry args={[.72, 48, 48]} /><meshStandardMaterial color="#f5f8ff" metalness={.15} roughness={.35} /></mesh>
        <mesh position={[0, 1.28, .5]}><boxGeometry args={[1.05, .65, .12]} /><meshStandardMaterial color="#071c3b" metalness={.4} roughness={.2} /></mesh>
        <mesh position={[-.24, 1.34, .58]}><sphereGeometry args={[.07, 24, 24]} /><meshStandardMaterial color="#5ee7ff" emissive="#2ac8ff" emissiveIntensity={2} /></mesh>
        <mesh position={[.24, 1.34, .58]}><sphereGeometry args={[.07, 24, 24]} /><meshStandardMaterial color="#5ee7ff" emissive="#2ac8ff" emissiveIntensity={2} /></mesh>
        {robe && <>
          <mesh position={[0, 1.8, 0]} rotation={[.2, 0, 0]}><torusGeometry args={[.56, .08, 12, 40]} /><meshStandardMaterial color="#121212" /></mesh>
          <mesh position={[0, 1.65, -.02]} scale={[1.15, .55, 1.15]}><sphereGeometry args={[.78, 32, 32]} /><meshStandardMaterial color={outfit === 'saudi-red' ? '#d7263d' : '#f6f6f6'} roughness={.7} /></mesh>
        </>}
      </group>
      <mesh position={[0, .22, 0]} scale={robe ? [1.15, 1.25, .95] : [1, 1, 1]}><capsuleGeometry args={[.48, .8, 8, 24]} /><meshStandardMaterial color={robe ? '#fff' : '#eaf1ff'} roughness={.45} /></mesh>
      <mesh position={[0, .32, .5]}><boxGeometry args={[.46, .2, .06]} /><meshStandardMaterial color="#0a6cff" /></mesh>
      <group ref={leftArmRef} position={[-.66, .38, 0]} rotation={[0, 0, .25]}><mesh><capsuleGeometry args={[.14, .65, 6, 18]} /><meshStandardMaterial color="#f5f8ff" /></mesh></group>
      <group ref={rightArmRef} position={[.66, .38, 0]} rotation={[0, 0, -.25]}><mesh><capsuleGeometry args={[.14, .65, 6, 18]} /><meshStandardMaterial color="#f5f8ff" /></mesh></group>
      <mesh position={[-.3, -.72, 0]}><capsuleGeometry args={[.16, .55, 6, 18]} /><meshStandardMaterial color="#e9eef9" /></mesh>
      <mesh position={[.3, -.72, 0]}><capsuleGeometry args={[.16, .55, 6, 18]} /><meshStandardMaterial color="#e9eef9" /></mesh>
    </group>
  )
}
