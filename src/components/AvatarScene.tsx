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
    <Canvas
      camera={{ position: [0, .66, 5.25], fov: 34 }}
      shadows
      dpr={[1.25, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[3.8, 6.2, 5.0]} intensity={3.1} castShadow />
      <directionalLight position={[-3.4, 3.2, 2.6]} intensity={1.35} color="#dcecff" />
      <pointLight position={[0, 2.1, 3.6]} intensity={1.25} color="#77e9ff" />
      <pointLight position={[2.0, .8, 1.8]} intensity={.65} color="#0b6cff" />

      <Robot {...props} />

      <ContactShadows position={[0, -1.18, 0]} opacity={.36} scale={4.5} blur={2.6} far={4.2} />
      <Environment preset="studio" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        target={[0, .38, 0]}
      />
    </Canvas>
  )
}
