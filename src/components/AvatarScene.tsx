import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Robot } from './Robot'
import type { CompanionState, Outfit } from '../lib/types'

export function AvatarScene(props: { state: CompanionState; outfit: Outfit; onPoke?: () => void }) {
  return (
    <Canvas camera={{ position: [0, 0.55, 5.8], fov: 38 }} shadows dpr={[1, 1.5]}>
      <ambientLight intensity={1.35} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} castShadow />
      <pointLight position={[-3, 2, 3]} intensity={0.7} color="#72c7ff" />
      <Robot {...props} />
      <ContactShadows position={[0, -1.08, 0]} opacity={0.32} scale={5} blur={2.5} />
      <Environment preset="city" />
      <OrbitControls enableZoom={false} enablePan={false} target={[0, 0.3, 0]} minPolarAngle={1.25} maxPolarAngle={1.9} minAzimuthAngle={-0.5} maxAzimuthAngle={0.5} />
    </Canvas>
  )
}
