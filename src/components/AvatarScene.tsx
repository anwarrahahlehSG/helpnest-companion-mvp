import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { CompanionModel } from './CompanionModel'
import { ModelErrorBoundary } from './ModelErrorBoundary'
import { Robot } from './Robot'
import type { CompanionInteraction } from '../lib/interactions'
import type { CompanionState, Outfit } from '../lib/types'

export function AvatarScene(props: {
  state: CompanionState
  outfit: Outfit
  interaction?: CompanionInteraction
  onPoke?: () => void
}) {
  const fallback = <Robot {...props} />

  return (
    <Canvas
      camera={{ position: [0, .30, 7.35], fov: 30 }}
      shadows
      dpr={[1.25, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={.78} />
      <hemisphereLight intensity={.72} color="#ffffff" groundColor="#dbe8f8" />
      <directionalLight position={[4.1, 5.8, 5.2]} intensity={2.2} castShadow />
      <directionalLight position={[-3.8, 3.4, 2.8]} intensity={1.0} color="#d8ebff" />
      <pointLight position={[-1.6, 1.9, 3.4]} intensity={.54} color="#b9f5ff" />
      <pointLight position={[2.2, .8, 2.0]} intensity={.38} color="#2b78ff" />

      <ModelErrorBoundary fallback={fallback}>
        <Suspense fallback={fallback}>
          <CompanionModel {...props} />
        </Suspense>
      </ModelErrorBoundary>

      <ContactShadows position={[0, -1.37, 0]} opacity={.30} scale={5.2} blur={3.4} far={4.8} />
      <Environment preset="apartment" environmentIntensity={.50} />

      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} target={[0, .25, 0]} />
    </Canvas>
  )
}
