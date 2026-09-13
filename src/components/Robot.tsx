import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { Group, MathUtils, Mesh } from 'three'
import { useRef } from 'react'
import type { CompanionInteraction } from '../lib/interactions'
import type { CompanionState, Outfit } from '../lib/types'

const WHITE = '#fbfdff'
const WHITE_SOFT = '#e8eef7'
const BLUE = '#0b6cff'
const BLUE_DARK = '#073b91'
const CYAN = '#6ff7ff'
const VISOR = '#071421'
const GLOVE = '#10243f'
const JOINT = '#16283e'

function PbrWhite({ soft = false }: { soft?: boolean }) {
  return <meshPhysicalMaterial color={soft ? WHITE_SOFT : WHITE} roughness={.12} metalness={.02} clearcoat={1} clearcoatRoughness={.045} />
}

function GlowRing({ radius=.16, tube=.028 }: { radius?:number; tube?:number }) {
  return <mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[radius,tube,16,48]}/><meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={1.05} toneMapped={false}/></mesh>
}

function ChestLogo() {
  return <group position={[0,.34,.555]} scale={[1.1,1.1,1.1]}>
    <mesh position={[-.105,0,0]}><boxGeometry args={[.045,.22,.028]}/><meshStandardMaterial color={BLUE}/></mesh>
    <mesh position={[-.02,0,0]}><boxGeometry args={[.045,.22,.028]}/><meshStandardMaterial color={BLUE}/></mesh>
    <mesh position={[-.062,0,0]}><boxGeometry args={[.11,.04,.029]}/><meshStandardMaterial color={BLUE}/></mesh>
    <mesh position={[.075,0,0]}><boxGeometry args={[.045,.22,.028]}/><meshStandardMaterial color={BLUE}/></mesh>
    <mesh position={[.17,0,0]}><boxGeometry args={[.045,.22,.028]}/><meshStandardMaterial color={BLUE}/></mesh>
    <mesh position={[.122,0,0]} rotation={[0,0,-.46]}><boxGeometry args={[.045,.24,.029]}/><meshStandardMaterial color={BLUE}/></mesh>
  </group>
}

function Finger({ x, y, side, rot=0 }: { x:number; y:number; side:-1|1; rot?:number }) {
  return <group position={[x,y,.055]} rotation={[0,0,rot]}>
    <mesh><capsuleGeometry args={[.035,.115,6,12]}/><meshPhysicalMaterial color={GLOVE} roughness={.2} clearcoat={.42}/></mesh>
    <mesh position={[0,-.072,0]}><sphereGeometry args={[.037,18,18]}/><meshStandardMaterial color={side===1?'#233b59':'#233b59'}/></mesh>
  </group>
}

function Hand({ side }: { side:-1|1 }) {
  return <group scale={1.15}>
    <mesh scale={[1.05,.92,.72]} castShadow><sphereGeometry args={[.16,32,32]}/><meshPhysicalMaterial color={GLOVE} roughness={.18} clearcoat={.52}/></mesh>
    <Finger side={side} x={-.105} y={-.14} rot={-.10}/><Finger side={side} x={-.035} y={-.16} rot={-.035}/><Finger side={side} x={.035} y={-.16} rot={.035}/><Finger side={side} x={.105} y={-.135} rot={.10}/>
    <mesh position={[side*.17,-.02,.035]} rotation={[0,0,side*.75]}><capsuleGeometry args={[.04,.12,6,12]}/><meshPhysicalMaterial color={GLOVE} roughness={.2} clearcoat={.45}/></mesh>
  </group>
}

function Arm({ side, refObj }: { side:-1|1; refObj:React.RefObject<Group|null> }) {
  return <group ref={refObj} position={[side*.70,.48,.04]} rotation={[0,0,side*-.14]}>
    <mesh castShadow><sphereGeometry args={[.205,32,32]}/><meshPhysicalMaterial color={JOINT} roughness={.17} metalness={.22} clearcoat={.55}/></mesh>
    <mesh position={[0,-.03,0]} scale={[1.15,.82,1.08]}><sphereGeometry args={[.19,30,30]}/><PbrWhite/></mesh>
    <group position={[0,-.19,0]}><GlowRing radius={.145} tube={.026}/></group>
    <mesh position={[0,-.34,.01]} scale={[1.0,1.3,.95]} castShadow><capsuleGeometry args={[.125,.25,8,20]}/><PbrWhite/></mesh>
    <mesh position={[0,-.53,.02]}><sphereGeometry args={[.115,26,26]}/><meshPhysicalMaterial color={JOINT} roughness={.18} metalness={.16}/></mesh>
    <group position={[0,-.58,.025]}><GlowRing radius={.115} tube={.022}/></group>
    <mesh position={[0,-.73,.045]} scale={[.98,1.25,.92]} castShadow><capsuleGeometry args={[.112,.22,8,20]}/><PbrWhite soft/></mesh>
    <group position={[0,-.92,.13]}><Hand side={side}/></group>
  </group>
}

function Leg({ side }: { side:-1|1 }) {
  return <group position={[side*.30,-.58,0]}>
    <mesh position={[0,-.02,0]}><sphereGeometry args={[.16,28,28]}/><meshPhysicalMaterial color={JOINT} roughness={.18} metalness={.18}/></mesh>
    <mesh position={[0,-.16,.01]} scale={[1.0,1.25,.95]}><capsuleGeometry args={[.16,.26,8,20]}/><PbrWhite/></mesh>
    <group position={[0,-.36,.02]}><GlowRing radius={.145} tube={.026}/></group>
    <mesh position={[0,-.55,.14]} scale={[1.55,.85,1.85]} castShadow><sphereGeometry args={[.20,36,36]}/><PbrWhite/></mesh>
    <mesh position={[0,-.64,.17]} scale={[1.42,.30,1.62]}><sphereGeometry args={[.20,30,30]}/><meshPhysicalMaterial color={BLUE_DARK} roughness={.12} clearcoat={.8}/></mesh>
    <mesh position={[0,-.61,.30]} scale={[1.0,.12,1.0]}><boxGeometry args={[.36,.08,.17]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.7} toneMapped={false}/></mesh>
  </group>
}

function Ear({ side }: { side:-1|1 }) {
  return <group position={[side*.91,1.48,.02]} rotation={[0,0,Math.PI/2]}>
    <mesh><cylinderGeometry args={[.25,.25,.18,56]}/><meshPhysicalMaterial color={BLUE_DARK} roughness={.10} clearcoat={.95}/></mesh>
    <mesh position={[0,side*.105,0]}><cylinderGeometry args={[.19,.19,.065,56]}/><PbrWhite/></mesh>
    <mesh position={[0,side*.148,0]}><cylinderGeometry args={[.11,.11,.03,48]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.2} toneMapped={false}/></mesh>
  </group>
}

function Effects({interaction}:{interaction:CompanionInteraction}) {
  if(interaction==='typing') return <group position={[0,-.02,1.02]}><mesh position={[0,.12,0]}><boxGeometry args={[.9,.50,.05]}/><meshPhysicalMaterial color="#dfe8f1" roughness={.25} metalness={.22}/></mesh><mesh position={[0,.12,.032]}><boxGeometry args={[.72,.35,.02]}/><meshStandardMaterial color="#9fd8ff"/></mesh><mesh position={[0,-.17,.22]} rotation={[.2,0,0]}><boxGeometry args={[1.0,.38,.06]}/><meshPhysicalMaterial color="#edf3f9" roughness={.28} metalness={.12}/></mesh></group>
  if(interaction==='thinking') return <group><mesh position={[.88,2.23,.22]}><sphereGeometry args={[.08,20,20]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={.9}/></mesh><mesh position={[1.05,2.42,.22]}><sphereGeometry args={[.055,20,20]}/><meshStandardMaterial color={CYAN}/></mesh></group>
  if(interaction==='sleeping') return <group><mesh position={[.82,2.08,.2]}><boxGeometry args={[.12,.04,.04]}/><meshStandardMaterial color={BLUE}/></mesh><mesh position={[1.0,2.28,.2]}><boxGeometry args={[.16,.04,.04]}/><meshStandardMaterial color={BLUE}/></mesh><mesh position={[1.18,2.50,.2]}><boxGeometry args={[.2,.04,.04]}/><meshStandardMaterial color={BLUE}/></mesh></group>
  if(interaction==='celebration'||interaction==='excited') return <>{[-1.05,-.82,.82,1.05].map((x,i)=><mesh key={i} position={[x,1.45+(i%2)*.55,.24]} rotation={[0,0,(i-1.5)*.35]}><boxGeometry args={[.06,.25,.04]}/><meshStandardMaterial color={i%2?CYAN:'#ffb11b'} emissive={i%2?CYAN:'#ffb11b'} emissiveIntensity={.4}/></mesh>)}</>
  return null
}

type Props={state:CompanionState;outfit:Outfit;interaction?:CompanionInteraction;onPoke?:()=>void}

export function Robot({state,outfit,interaction='none',onPoke}:Props){
  const robotRef=useRef<Group>(null),headRef=useRef<Group>(null),leftArmRef=useRef<Group>(null),rightArmRef=useRef<Group>(null),leftEyeRef=useRef<Mesh>(null),rightEyeRef=useRef<Mesh>(null)
  const waveUntil=useRef(0)
  useFrame(({clock,pointer})=>{
    const robot=robotRef.current;if(!robot)return
    const t=clock.getElapsedTime(),waving=performance.now()<waveUntil.current,active=interaction!=='none'
    robot.rotation.x=MathUtils.lerp(robot.rotation.x,0,.12);robot.rotation.y=MathUtils.lerp(robot.rotation.y,0,.16);robot.rotation.z=MathUtils.lerp(robot.rotation.z,0,.12);robot.position.x=MathUtils.lerp(robot.position.x,0,.14)
    if(headRef.current&&active){headRef.current.rotation.x=MathUtils.lerp(headRef.current.rotation.x,0,.18);headRef.current.rotation.y=MathUtils.lerp(headRef.current.rotation.y,0,.18)}
    if(leftArmRef.current){leftArmRef.current.rotation.x=MathUtils.lerp(leftArmRef.current.rotation.x,0,.14);leftArmRef.current.rotation.y=MathUtils.lerp(leftArmRef.current.rotation.y,0,.14)}
    if(rightArmRef.current){rightArmRef.current.rotation.x=MathUtils.lerp(rightArmRef.current.rotation.x,0,.14);rightArmRef.current.rotation.y=MathUtils.lerp(rightArmRef.current.rotation.y,0,.14)}
    const blink=(t%4.7)>4.52?.06:1;let eyeY=blink
    if(interaction==='sleeping')eyeY=.06;else if(state==='error'||interaction==='sad')eyeY=Math.min(eyeY,.5);else if(state==='success'||interaction==='celebration'||interaction==='excited')eyeY=Math.min(eyeY,.72)
    if(leftEyeRef.current)leftEyeRef.current.scale.y=MathUtils.lerp(leftEyeRef.current.scale.y,eyeY,.35)
    if(rightEyeRef.current)rightEyeRef.current.scale.y=MathUtils.lerp(rightEyeRef.current.scale.y,eyeY,.35)
    if(state==='idle'&&!active){robot.position.y=Math.sin(t*1.35)*.022;robot.rotation.y=Math.sin(t*.45)*.012;if(headRef.current){headRef.current.rotation.y=MathUtils.lerp(headRef.current.rotation.y,pointer.x*.09,.06);headRef.current.rotation.x=MathUtils.lerp(headRef.current.rotation.x,-pointer.y*.045,.06)};if(leftArmRef.current)leftArmRef.current.rotation.z=.13;if(rightArmRef.current)rightArmRef.current.rotation.z=-.13}
    if(state==='loading'&&!active){robot.position.y=Math.sin(t*2.6)*.03;if(headRef.current)headRef.current.rotation.y=Math.sin(t*1.8)*.06}
    if(state==='success'&&!active){robot.position.y=Math.abs(Math.sin(t*4))*.07;if(leftArmRef.current)leftArmRef.current.rotation.z=1.12;if(rightArmRef.current)rightArmRef.current.rotation.z=-1.12}
    if((state==='error'||state==='offline')&&!active){robot.position.y=-.02;if(headRef.current)headRef.current.rotation.x=.07}
    if(interaction==='wave'||waving){if(rightArmRef.current){rightArmRef.current.rotation.z=-1.28+Math.sin(t*11)*.18;rightArmRef.current.rotation.x=-.15}}
    if(interaction==='high-five'){if(rightArmRef.current){rightArmRef.current.rotation.z=-1.42;rightArmRef.current.rotation.x=-.94};robot.position.y=.03}
    if(interaction==='dance'){robot.position.x=Math.sin(t*4)*.05;robot.position.y=.04+Math.abs(Math.sin(t*4.2))*.05;robot.rotation.z=Math.sin(t*6)*.06;if(leftArmRef.current){leftArmRef.current.rotation.x=-.25;leftArmRef.current.rotation.z=.72+Math.sin(t*7)*.30};if(rightArmRef.current){rightArmRef.current.rotation.x=-.25;rightArmRef.current.rotation.z=-.72-Math.sin(t*7)*.30}}
    if(interaction==='thinking'){if(headRef.current){headRef.current.rotation.z=-.07;headRef.current.rotation.y=.08};if(rightArmRef.current){rightArmRef.current.rotation.z=-.92;rightArmRef.current.rotation.x=-.40}}
    if(interaction==='typing'){if(leftArmRef.current){leftArmRef.current.rotation.z=.46;leftArmRef.current.rotation.x=-.70};if(rightArmRef.current){rightArmRef.current.rotation.z=-.46;rightArmRef.current.rotation.x=-.70};if(headRef.current)headRef.current.rotation.x=.07}
    if(interaction==='sleeping'){robot.rotation.z=-.14;robot.position.y=-.07;if(headRef.current){headRef.current.rotation.z=-.10;headRef.current.rotation.x=.11}}
    if(interaction==='excited'||interaction==='celebration'){robot.position.y=Math.abs(Math.sin(t*4.8))*.10;if(leftArmRef.current)leftArmRef.current.rotation.z=1.22;if(rightArmRef.current)rightArmRef.current.rotation.z=-1.22}
    if(interaction==='sad'){robot.position.y=-.05;if(headRef.current)headRef.current.rotation.x=.12;if(leftArmRef.current)leftArmRef.current.rotation.z=.28;if(rightArmRef.current)rightArmRef.current.rotation.z=-.28}
  })

  const sad=state==='error'||interaction==='sad',robe=outfit!=='default',cloth=outfit==='saudi-red'?'#d82e42':'#fbfbfb'
  const poke=(e:{stopPropagation:()=>void})=>{e.stopPropagation();waveUntil.current=performance.now()+1400;onPoke?.()}

  return <group ref={robotRef} onClick={poke}>
    <group ref={headRef}>
      <RoundedBox args={[1.74,1.30,.92]} radius={.36} smoothness={10} position={[0,1.48,0]} castShadow><meshPhysicalMaterial color={WHITE} roughness={.09} clearcoat={1} clearcoatRoughness={.035}/></RoundedBox>
      <RoundedBox args={[1.58,1.02,.16]} radius={.30} smoothness={10} position={[0,1.47,.50]}><meshPhysicalMaterial color={BLUE_DARK} roughness={.08} clearcoat={1}/></RoundedBox>
      <RoundedBox args={[1.46,.90,.13]} radius={.27} smoothness={10} position={[0,1.47,.595]}><meshPhysicalMaterial color={VISOR} roughness={.055} metalness={.12} clearcoat={.78} clearcoatRoughness={.08}/></RoundedBox>
      <RoundedBox args={[1.54,.98,.035]} radius={.30} smoothness={10} position={[0,1.47,.675]}><meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={.62} toneMapped={false}/></RoundedBox>
      <RoundedBox args={[1.43,.87,.045]} radius={.26} smoothness={10} position={[0,1.47,.697]}><meshPhysicalMaterial color={VISOR} roughness={.04} metalness={.18} clearcoat={.95} clearcoatRoughness={.045}/></RoundedBox>
      <mesh position={[-.34,1.73,.735]} rotation={[0,0,-.22]} scale={[1.7,.30,.10]}><sphereGeometry args={[.15,30,30]}/><meshStandardMaterial color="#fff" transparent opacity={.10}/></mesh>
      <mesh ref={leftEyeRef} position={[-.30,1.53,.735]} scale={[1.05,.95,.38]}><sphereGeometry args={[.078,30,30]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={3.8} toneMapped={false}/></mesh>
      <mesh ref={rightEyeRef} position={[.30,1.53,.735]} scale={[1.05,.95,.38]}><sphereGeometry args={[.078,30,30]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={3.8} toneMapped={false}/></mesh>
      {!sad?<mesh position={[0,1.29,.735]} rotation={[0,0,Math.PI]} scale={[1,.56,.45]}><torusGeometry args={[.18,.024,14,48,Math.PI]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.7} toneMapped={false}/></mesh>:<mesh position={[0,1.29,.735]}><boxGeometry args={[.20,.025,.018]}/><meshStandardMaterial color="#ff7d7d" emissive="#ff4141" emissiveIntensity={1.7}/></mesh>}
      <Ear side={-1}/><Ear side={1}/>
      <group position={[.43,2.16,-.02]} rotation={[0,0,-.12]}><mesh position={[0,.12,0]}><cylinderGeometry args={[.022,.028,.26,16]}/><meshStandardMaterial color={JOINT} metalness={.5} roughness={.18}/></mesh><mesh position={[0,.29,0]}><sphereGeometry args={[.072,24,24]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.8} toneMapped={false}/></mesh></group>
      {robe&&<><mesh position={[0,2.10,-.08]} scale={[1.1,.16,.90]}><sphereGeometry args={[.74,40,40]}/><meshStandardMaterial color={cloth} roughness={.82}/></mesh><mesh position={[0,2.16,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.52,.045,14,48]}/><meshStandardMaterial color="#111" roughness={.55}/></mesh></>}
    </group>

    <mesh position={[0,.78,0]}><cylinderGeometry args={[.24,.26,.17,36]}/><meshPhysicalMaterial color={JOINT} roughness={.14} metalness={.3}/></mesh>
    <group position={[0,.87,0]}><GlowRing radius={.27} tube={.03}/></group>
    <RoundedBox args={[1.05,1.28,.78]} radius={.34} smoothness={8} position={[0,.08,0]} castShadow><meshPhysicalMaterial color={WHITE} roughness={.10} clearcoat={1} clearcoatRoughness={.04}/></RoundedBox>
    <RoundedBox args={[.82,.86,.12]} radius={.24} smoothness={8} position={[0,.18,.435]}><meshPhysicalMaterial color={WHITE_SOFT} roughness={.14} clearcoat={.72}/></RoundedBox>
    <ChestLogo/>
    <RoundedBox args={[.06,.30,.035]} radius={.028} smoothness={5} position={[0,-.06,.515]}><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.6} toneMapped={false}/></RoundedBox>
    <mesh position={[-.46,-.42,0]}><sphereGeometry args={[.14,26,26]}/><meshPhysicalMaterial color={JOINT} roughness={.18} metalness={.18}/></mesh>
    <mesh position={[.46,-.42,0]}><sphereGeometry args={[.14,26,26]}/><meshPhysicalMaterial color={JOINT} roughness={.18} metalness={.18}/></mesh>
    <group position={[-.46,-.42,0]}><GlowRing radius={.16} tube={.025}/></group>
    <group position={[.46,-.42,0]}><GlowRing radius={.16} tube={.025}/></group>
    <Arm side={-1} refObj={leftArmRef}/><Arm side={1} refObj={rightArmRef}/><Leg side={-1}/><Leg side={1}/><Effects interaction={interaction}/>
  </group>
}
