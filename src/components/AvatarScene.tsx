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
      camera={{ position: [0, .58, 5.75], fov: 33 }}
      shadows
      dpr={[1.25, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={.82} />
      <hemisphereLight intensity={.72} color="#ffffff" groundColor="#dbe8f8" />
      <directionalLight position={[4.1, 5.8, 5.2]} intensity={2.35} castShadow />
      <directionalLight position={[-3.8, 3.4, 2.8]} intensity={1.05} color="#d8ebff" />
      <pointLight position={[-1.6, 1.9, 3.4]} intensity={.58} color="#b9f5ff" />
      <pointLight position={[2.2, .8, 2.0]} intensity={.42} color="#2b78ff" />

      <Robot {...props} />

      <ContactShadows position={[0, -1.24, 0]} opacity={.32} scale={4.8} blur={3.2} far={4.5} />
      <Environment preset="apartment" environmentIntensity={.55} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        target={[0, .42, 0]}
      />
    </Canvas>
  )
}
