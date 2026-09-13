import { useFrame } from '@react-three/fiber'
import { Group, MathUtils, Mesh } from 'three'
import { useRef } from 'react'
import type { CompanionInteraction } from '../lib/interactions'
import type { CompanionState, Outfit } from '../lib/types'

const WHITE = '#f8fbff'
const WHITE_SOFT = '#dfe8f3'
const BLUE = '#0b6cff'
const BLUE_DARK = '#063f9d'
const CYAN = '#6ff7ff'
const VISOR = '#061221'
const GLOVE = '#10243f'
const JOINT = '#1a2c43'

function GlowRing({ radius = .16, tube = .03 }: { radius?: number; tube?: number }) {
  return <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[radius, tube, 14, 40]} /><meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={.55} toneMapped={false} /></mesh>
}

function ChestLogo() {
  return <group position={[0, .32, .53]} scale={[.9,.9,.9]}>
    <mesh position={[-.105,0,0]}><boxGeometry args={[.045,.22,.025]}/><meshStandardMaterial color={BLUE}/></mesh>
    <mesh position={[-.02,0,0]}><boxGeometry args={[.045,.22,.025]}/><meshStandardMaterial color={BLUE}/></mesh>
    <mesh position={[-.062,0,0]}><boxGeometry args={[.11,.04,.026]}/><meshStandardMaterial color={BLUE}/></mesh>
    <mesh position={[.075,0,0]}><boxGeometry args={[.045,.22,.025]}/><meshStandardMaterial color={BLUE}/></mesh>
    <mesh position={[.17,0,0]}><boxGeometry args={[.045,.22,.025]}/><meshStandardMaterial color={BLUE}/></mesh>
    <mesh position={[.122,0,0]} rotation={[0,0,-.46]}><boxGeometry args={[.045,.24,.026]}/><meshStandardMaterial color={BLUE}/></mesh>
  </group>
}

function Finger({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return <mesh position={[x,y,.06]} rotation={[0,0,r]}><capsuleGeometry args={[.026,.11,5,10]}/><meshPhysicalMaterial color={GLOVE} roughness={.22} clearcoat={.35}/></mesh>
}

function Hand({ side }: { side: -1 | 1 }) {
  return <group>
    <mesh scale={[1,.95,.7]} castShadow><sphereGeometry args={[.14,28,28]}/><meshPhysicalMaterial color={GLOVE} roughness={.2} clearcoat={.45}/></mesh>
    <Finger x={side*-.085} y={-.11} r={side*.12}/><Finger x={side*-.028} y={-.13} r={side*.05}/><Finger x={side*.03} y={-.13} r={side*-.03}/><Finger x={side*.085} y={-.105} r={side*-.11}/>
    <mesh position={[side*.15,-.01,.04]} rotation={[0,0,side*.75]}><capsuleGeometry args={[.03,.10,5,10]}/><meshPhysicalMaterial color={GLOVE} roughness={.22} clearcoat={.35}/></mesh>
  </group>
}

function Arm({ side, refObj }: { side:-1|1; refObj: React.RefObject<Group|null> }) {
  return <group ref={refObj} position={[side*.68,.43,.08]} rotation={[0,0,side*-.14]}>
    <mesh castShadow><sphereGeometry args={[.17,28,28]}/><meshPhysicalMaterial color={WHITE} roughness={.16} clearcoat={.8}/></mesh>
    <mesh position={[0,-.12,0]}><sphereGeometry args={[.115,24,24]}/><meshPhysicalMaterial color={JOINT} roughness={.2} metalness={.18}/></mesh>
    <group position={[0,-.18,0]}><GlowRing radius={.115} tube={.025}/></group>
    <mesh position={[0,-.34,.015]} scale={[.95,1.25,.95]}><capsuleGeometry args={[.105,.22,7,18]}/><meshPhysicalMaterial color={WHITE} roughness={.17} clearcoat={.65}/></mesh>
    <mesh position={[0,-.52,.02]}><sphereGeometry args={[.10,24,24]}/><meshPhysicalMaterial color={JOINT} roughness={.22}/></mesh>
    <group position={[0,-.58,.02]}><GlowRing radius={.095} tube={.022}/></group>
    <mesh position={[0,-.72,.04]} scale={[.9,1.15,.92]}><capsuleGeometry args={[.095,.20,7,18]}/><meshPhysicalMaterial color={WHITE_SOFT} roughness={.18} clearcoat={.55}/></mesh>
    <group position={[0,-.89,.10]}><Hand side={side}/></group>
  </group>
}

function Leg({ side }: { side:-1|1 }) {
  return <group position={[side*.28,-.62,0]}>
    <mesh position={[0,-.02,0]} scale={[1,1.15,.95]}><capsuleGeometry args={[.14,.26,8,20]}/><meshPhysicalMaterial color={WHITE} roughness={.16} clearcoat={.72}/></mesh>
    <mesh position={[0,-.22,0]}><sphereGeometry args={[.11,24,24]}/><meshPhysicalMaterial color={JOINT} roughness={.22}/></mesh>
    <group position={[0,-.28,.01]}><GlowRing radius={.125} tube={.025}/></group>
    <mesh position={[0,-.45,.10]} scale={[1.45,.8,1.65]} castShadow><sphereGeometry args={[.18,30,30]}/><meshPhysicalMaterial color={WHITE} roughness={.14} clearcoat={.8}/></mesh>
    <mesh position={[0,-.54,.15]} scale={[1.28,.25,1.48]}><sphereGeometry args={[.18,28,28]}/><meshStandardMaterial color={BLUE_DARK}/></mesh>
    <mesh position={[0,-.51,.25]} scale={[.9,.12,.92]}><boxGeometry args={[.34,.08,.18]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.2} toneMapped={false}/></mesh>
  </group>
}

function Ear({ side }: { side:-1|1 }) {
  return <group position={[side*.83,1.46,0]} rotation={[0,0,Math.PI/2]}>
    <mesh><cylinderGeometry args={[.235,.235,.16,48]}/><meshPhysicalMaterial color={BLUE_DARK} roughness={.12} clearcoat={.85}/></mesh>
    <mesh position={[0,side*.09,0]}><cylinderGeometry args={[.18,.18,.055,48]}/><meshPhysicalMaterial color={WHITE} roughness={.15} clearcoat={.72}/></mesh>
    <mesh position={[0,side*.13,0]}><cylinderGeometry args={[.105,.105,.025,40]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.8} toneMapped={false}/></mesh>
  </group>
}

function Effects({ interaction }: { interaction: CompanionInteraction }) {
  if(interaction==='typing') return <group position={[0,-.02,.95]}><mesh position={[0,.12,0]}><boxGeometry args={[.84,.48,.05]}/><meshPhysicalMaterial color="#dfe8f1" roughness={.28} metalness={.2}/></mesh><mesh position={[0,.12,.03]}><boxGeometry args={[.68,.34,.02]}/><meshStandardMaterial color="#9fd8ff"/></mesh><mesh position={[0,-.16,.22]} rotation={[.2,0,0]}><boxGeometry args={[.96,.36,.06]}/><meshPhysicalMaterial color="#edf3f9" roughness={.32} metalness={.12}/></mesh></group>
  if(interaction==='thinking') return <group><mesh position={[.78,2.18,.22]}><sphereGeometry args={[.08,20,20]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={.8}/></mesh><mesh position={[.96,2.38,.22]}><sphereGeometry args={[.055,20,20]}/><meshStandardMaterial color={CYAN}/></mesh></group>
  if(interaction==='sleeping') return <group><mesh position={[.75,2.05,.2]}><boxGeometry args={[.12,.04,.04]}/><meshStandardMaterial color={BLUE}/></mesh><mesh position={[.9,2.22,.2]}><boxGeometry args={[.16,.04,.04]}/><meshStandardMaterial color={BLUE}/></mesh><mesh position={[1.08,2.42,.2]}><boxGeometry args={[.2,.04,.04]}/><meshStandardMaterial color={BLUE}/></mesh></group>
  if(interaction==='celebration'||interaction==='excited') return <>{[-.95,-.72,.72,.95].map((x,i)=><mesh key={i} position={[x,1.45+(i%2)*.5,.24]} rotation={[0,0,(i-1.5)*.35]}><boxGeometry args={[.06,.24,.04]}/><meshStandardMaterial color={i%2?CYAN:'#ffb11b'} emissive={i%2?CYAN:'#ffb11b'} emissiveIntensity={.35}/></mesh>)}</>
  return null
}

type Props={state:CompanionState;outfit:Outfit;interaction?:CompanionInteraction;onPoke?:()=>void}

export function Robot({state,outfit,interaction='none',onPoke}:Props){
  const robotRef=useRef<Group>(null), headRef=useRef<Group>(null), leftArmRef=useRef<Group>(null), rightArmRef=useRef<Group>(null), leftEyeRef=useRef<Mesh>(null), rightEyeRef=useRef<Mesh>(null)
  const waveUntil=useRef(0)

  useFrame(({clock,pointer})=>{
    const robot=robotRef.current;if(!robot)return
    const t=clock.getElapsedTime(), waving=performance.now()<waveUntil.current, active=interaction!=='none'
    robot.rotation.x=MathUtils.lerp(robot.rotation.x,0,.12); robot.rotation.y=MathUtils.lerp(robot.rotation.y,0,.16); robot.rotation.z=MathUtils.lerp(robot.rotation.z,0,.12); robot.position.x=MathUtils.lerp(robot.position.x,0,.14)
    if(headRef.current&&active){headRef.current.rotation.x=MathUtils.lerp(headRef.current.rotation.x,0,.18);headRef.current.rotation.y=MathUtils.lerp(headRef.current.rotation.y,0,.18)}
    if(leftArmRef.current){leftArmRef.current.rotation.x=MathUtils.lerp(leftArmRef.current.rotation.x,0,.14);leftArmRef.current.rotation.y=MathUtils.lerp(leftArmRef.current.rotation.y,0,.14)}
    if(rightArmRef.current){rightArmRef.current.rotation.x=MathUtils.lerp(rightArmRef.current.rotation.x,0,.14);rightArmRef.current.rotation.y=MathUtils.lerp(rightArmRef.current.rotation.y,0,.14)}

    const blink=(t%4.7)>4.52?.06:1; let eyeY=blink
    if(interaction==='sleeping')eyeY=.06; else if(state==='error'||interaction==='sad')eyeY=Math.min(eyeY,.5); else if(state==='success'||interaction==='celebration'||interaction==='excited')eyeY=Math.min(eyeY,.72)
    if(leftEyeRef.current)leftEyeRef.current.scale.y=MathUtils.lerp(leftEyeRef.current.scale.y,eyeY,.35)
    if(rightEyeRef.current)rightEyeRef.current.scale.y=MathUtils.lerp(rightEyeRef.current.scale.y,eyeY,.35)

    if(state==='idle'&&!active){robot.position.y=Math.sin(t*1.35)*.025;robot.rotation.y=Math.sin(t*.45)*.018;if(headRef.current){headRef.current.rotation.y=MathUtils.lerp(headRef.current.rotation.y,pointer.x*.12,.06);headRef.current.rotation.x=MathUtils.lerp(headRef.current.rotation.x,-pointer.y*.06,.06)};if(leftArmRef.current)leftArmRef.current.rotation.z=.15;if(rightArmRef.current)rightArmRef.current.rotation.z=-.15}
    if(state==='loading'&&!active){robot.position.y=Math.sin(t*2.6)*.035;if(headRef.current)headRef.current.rotation.y=Math.sin(t*1.8)*.08}
    if(state==='success'&&!active){robot.position.y=Math.abs(Math.sin(t*4))* .08;if(leftArmRef.current)leftArmRef.current.rotation.z=1.18;if(rightArmRef.current)rightArmRef.current.rotation.z=-1.18}
    if((state==='error'||state==='offline')&&!active){robot.position.y=-.02;if(headRef.current)headRef.current.rotation.x=.08}

    if(interaction==='wave'||waving){if(rightArmRef.current){rightArmRef.current.rotation.z=-1.35+Math.sin(t*11)*.18;rightArmRef.current.rotation.x=-.15}}
    if(interaction==='high-five'){if(rightArmRef.current){rightArmRef.current.rotation.z=-1.45;rightArmRef.current.rotation.x=-.95};robot.position.y=.03}
    if(interaction==='dance'){robot.position.x=Math.sin(t*4)*.055;robot.position.y=.04+Math.abs(Math.sin(t*4.2))*.055;robot.rotation.z=Math.sin(t*6)*.07;if(leftArmRef.current){leftArmRef.current.rotation.x=-.28;leftArmRef.current.rotation.z=.75+Math.sin(t*7)*.32};if(rightArmRef.current){rightArmRef.current.rotation.x=-.28;rightArmRef.current.rotation.z=-.75-Math.sin(t*7)*.32}}
    if(interaction==='thinking'){if(headRef.current){headRef.current.rotation.z=-.08;headRef.current.rotation.y=.1};if(rightArmRef.current){rightArmRef.current.rotation.z=-.95;rightArmRef.current.rotation.x=-.42}}
    if(interaction==='typing'){if(leftArmRef.current){leftArmRef.current.rotation.z=.48;leftArmRef.current.rotation.x=-.72};if(rightArmRef.current){rightArmRef.current.rotation.z=-.48;rightArmRef.current.rotation.x=-.72};if(headRef.current)headRef.current.rotation.x=.08}
    if(interaction==='sleeping'){robot.rotation.z=-.16;robot.position.y=-.08;if(headRef.current){headRef.current.rotation.z=-.12;headRef.current.rotation.x=.12}}
    if(interaction==='excited'||interaction==='celebration'){robot.position.y=Math.abs(Math.sin(t*4.8))*.12;if(leftArmRef.current)leftArmRef.current.rotation.z=1.28;if(rightArmRef.current)rightArmRef.current.rotation.z=-1.28}
    if(interaction==='sad'){robot.position.y=-.05;if(headRef.current)headRef.current.rotation.x=.13;if(leftArmRef.current)leftArmRef.current.rotation.z=.3;if(rightArmRef.current)rightArmRef.current.rotation.z=-.3}
  })

  const sad=state==='error'||interaction==='sad'; const robe=outfit!=='default'; const cloth=outfit==='saudi-red'?'#d82e42':'#fbfbfb'
  const poke=(e:{stopPropagation:()=>void})=>{e.stopPropagation();waveUntil.current=performance.now()+1400;onPoke?.()}

  return <group ref={robotRef} onClick={poke}>
    <group ref={headRef}>
      <mesh position={[0,1.46,0]} scale={[1.18,.98,1.02]} castShadow><sphereGeometry args={[.72,64,64]}/><meshPhysicalMaterial color={WHITE} roughness={.1} clearcoat={1} clearcoatRoughness={.05}/></mesh>
      <mesh position={[0,1.45,.64]} scale={[1.03,.7,.34]}><sphereGeometry args={[.7,64,64]}/><meshPhysicalMaterial color={BLUE_DARK} roughness={.08} clearcoat={1}/></mesh>
      <mesh position={[0,1.45,.68]} scale={[.96,.64,.30]}><sphereGeometry args={[.7,64,64]}/><meshPhysicalMaterial color={VISOR} roughness={.025} metalness={.28} clearcoat={1} clearcoatRoughness={.02}/></mesh>
      <mesh position={[-.20,1.70,.90]} rotation={[0,0,-.18]} scale={[1.6,.36,.12]}><sphereGeometry args={[.14,28,28]}/><meshStandardMaterial color="#fff" transparent opacity={.18}/></mesh>
      <mesh ref={leftEyeRef} position={[-.25,1.49,.905]} scale={[1.1,.95,.42]}><sphereGeometry args={[.075,30,30]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={3.5} toneMapped={false}/></mesh>
      <mesh ref={rightEyeRef} position={[.25,1.49,.905]} scale={[1.1,.95,.42]}><sphereGeometry args={[.075,30,30]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={3.5} toneMapped={false}/></mesh>
      {!sad?<mesh position={[0,1.27,.905]} rotation={[0,0,Math.PI]} scale={[1,.55,.45]}><torusGeometry args={[.17,.022,12,40,Math.PI]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.8} toneMapped={false}/></mesh>:<mesh position={[0,1.27,.905]}><boxGeometry args={[.18,.02,.018]}/><meshStandardMaterial color="#ff8080" emissive="#ff4040" emissiveIntensity={1.5}/></mesh>}
      <Ear side={-1}/><Ear side={1}/>
      <group position={[.46,2.03,-.02]} rotation={[0,0,-.16]}><mesh position={[0,.13,0]}><cylinderGeometry args={[.02,.026,.28,16]}/><meshStandardMaterial color={JOINT} metalness={.45} roughness={.2}/></mesh><mesh position={[0,.30,0]}><sphereGeometry args={[.07,24,24]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.5} toneMapped={false}/></mesh></group>
      {robe&&<><mesh position={[0,2.0,-.08]} scale={[1.05,.18,.88]}><sphereGeometry args={[.72,40,40]}/><meshStandardMaterial color={cloth} roughness={.82}/></mesh><mesh position={[0,2.07,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.5,.045,14,48]}/><meshStandardMaterial color="#111" roughness={.55}/></mesh></>}
    </group>

    <mesh position={[0,.84,0]}><cylinderGeometry args={[.22,.24,.14,32]}/><meshPhysicalMaterial color={JOINT} roughness={.15} metalness={.28}/></mesh><group position={[0,.89,0]}><GlowRing radius={.25} tube={.028}/></group>
    <mesh position={[0,.18,0]} scale={[1.04,1.08,.9]} castShadow><capsuleGeometry args={[.46,.65,12,40]}/><meshPhysicalMaterial color={WHITE} roughness={.1} clearcoat={1} clearcoatRoughness={.05}/></mesh>
    <mesh position={[0,.14,.45]} scale={[.78,.88,.16]}><sphereGeometry args={[.43,40,40]}/><meshPhysicalMaterial color={WHITE_SOFT} roughness={.14} clearcoat={.7}/></mesh>
    <mesh position={[0,-.06,.52]}><boxGeometry args={[.05,.24,.025]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.2} toneMapped={false}/></mesh>
    <ChestLogo/>
    <mesh position={[-.42,-.18,.02]} scale={[.34,.55,.48]}><sphereGeometry args={[.15,24,24]}/><meshPhysicalMaterial color={BLUE_DARK} roughness={.15} clearcoat={.65}/></mesh><mesh position={[.42,-.18,.02]} scale={[.34,.55,.48]}><sphereGeometry args={[.15,24,24]}/><meshPhysicalMaterial color={BLUE_DARK} roughness={.15} clearcoat={.65}/></mesh>

    <Arm side={-1} refObj={leftArmRef}/><Arm side={1} refObj={rightArmRef}/><Leg side={-1}/><Leg side={1}/><Effects interaction={interaction}/>
  </group>
}
