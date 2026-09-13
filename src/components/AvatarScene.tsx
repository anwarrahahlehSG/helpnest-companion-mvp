import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Robot } from './Robot'
import type { CompanionInteraction } from '../lib/interactions'
import type { CompanionState, Outfit } from '../lib/types'

export function AvatarScene(props: {
  state: CompanionState
  outfit: Outfit
  interaction?: CompanionInteraction
  onPoke?: () => void
}) {
  return (
    <Canvas camera={{ position: [0, .62, 5.45], fov: 36 }} shadows dpr={[1, 1.75]}>
      <ambientLight intensity={1.65} />
      <directionalLight position={[3.5, 5.5, 4.5]} intensity={2.4} castShadow />
      <directionalLight position={[-4, 2.8, 2]} intensity={1.0} color="#cfe7ff" />
      <pointLight position={[0, 1.7, 3]} intensity={.65} color="#8edbff" />
      <Robot {...props} />
      <ContactShadows position={[0, -1.18, 0]} opacity={.30} scale={4.8} blur={3.0} />
      <Environment preset="city" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        target={[0, .35, 0]}
        minPolarAngle={1.25}
        maxPolarAngle={1.85}
        minAzimuthAngle={-.42}
        maxAzimuthAngle={.42}
      />
    </Canvas>
  )
}
