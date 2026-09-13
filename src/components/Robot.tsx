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
  return <group position={[0,.35,.575]} scale={[1.18,1.18,1.18]}>
    <mesh position={[-.105,0,0]}><boxGeometry args={[.045,.22,.028]}/><meshStandardMaterial color={BLUE}/></mesh>
    <mesh position={[-.02,0,0]}><boxGeometry args={[.045,.22,.028]}/><meshStandardMaterial color={BLUE}/></mesh>
    <mesh position={[-.062,0,0]}><boxGeometry args={[.11,.04,.029]}/><meshStandardMaterial color={BLUE}/></mesh>
    <mesh position={[.075,0,0]}><boxGeometry args={[.045,.22,.028]}/><meshStandardMaterial color={BLUE}/></mesh>
    <mesh position={[.17,0,0]}><boxGeometry args={[.045,.22,.028]}/><meshStandardMaterial color={BLUE}/></mesh>
    <mesh position={[.122,0,0]} rotation={[0,0,-.46]}><boxGeometry args={[.045,.24,.029]}/><meshStandardMaterial color={BLUE}/></mesh>
  </group>
}

function Finger({ x, y, rot=0 }: { x:number; y:number; rot?:number }) {
  return <group position={[x,y,.085]} rotation={[0,0,rot]}>
    <mesh><capsuleGeometry args={[.046,.095,7,14]}/><meshPhysicalMaterial color={GLOVE} roughness={.18} clearcoat={.48}/></mesh>
    <mesh position={[0,-.064,.002]}><sphereGeometry args={[.048,20,20]}/><meshStandardMaterial color="#294461"/></mesh>
  </group>
}

function Hand({ side }: { side:-1|1 }) {
  return <group scale={1.28}>
    <mesh scale={[1.08,1.02,.80]} castShadow>
      <sphereGeometry args={[.18,36,36]}/>
      <meshPhysicalMaterial color={GLOVE} roughness={.16} clearcoat={.58}/>
    </mesh>
    <Finger x={-.115} y={-.145} rot={-.10}/>
    <Finger x={-.038} y={-.17} rot={-.035}/>
    <Finger x={.038} y={-.17} rot={.035}/>
    <Finger x={.115} y={-.145} rot={.10}/>
    <mesh position={[side*.19,-.01,.07]} rotation={[0,0,side*.72]}>
      <capsuleGeometry args={[.05,.12,7,14]}/>
      <meshPhysicalMaterial color={GLOVE} roughness={.18} clearcoat={.5}/>
    </mesh>
  </group>
}

function Arm({ side, refObj }: { side:-1|1; refObj:React.RefObject<Group|null> }) {
  return <group ref={refObj} position={[side*.82,.50,.08]} rotation={[0,0,side*-.08]}>
    <mesh castShadow><sphereGeometry args={[.22,34,34]}/><meshPhysicalMaterial color={JOINT} roughness={.17} metalness={.22} clearcoat={.55}/></mesh>
    <mesh position={[side*.02,-.025,.01]} scale={[1.16,.84,1.08]}><sphereGeometry args={[.20,32,32]}/><PbrWhite/></mesh>
    <group position={[0,-.21,.02]}><GlowRing radius={.155} tube={.028}/></group>
    <mesh position={[side*.025,-.37,.04]} scale={[1.03,1.34,.97]} castShadow><capsuleGeometry args={[.132,.28,8,20]}/><PbrWhite/></mesh>
    <mesh position={[side*.035,-.58,.07]}><sphereGeometry args={[.122,28,28]}/><meshPhysicalMaterial color={JOINT} roughness={.18} metalness={.16}/></mesh>
    <group position={[side*.035,-.63,.08]}><GlowRing radius={.122} tube={.023}/></group>
    <mesh position={[side*.055,-.80,.12]} scale={[1.02,1.30,.95]} castShadow><capsuleGeometry args={[.12,.24,8,20]}/><PbrWhite soft/></mesh>
    <group position={[side*.08,-1.01,.25]} rotation={[.10,0,side*.02]}><Hand side={side}/></group>
  </group>
}

function Leg({ side }: { side:-1|1 }) {
  return <group position={[side*.31,-.62,0]}>
    <mesh position={[0,-.02,0]}><sphereGeometry args={[.17,30,30]}/><meshPhysicalMaterial color={JOINT} roughness={.18} metalness={.18}/></mesh>
    <mesh position={[0,-.17,.01]} scale={[1.03,1.28,.98]}><capsuleGeometry args={[.165,.28,8,20]}/><PbrWhite/></mesh>
    <group position={[0,-.38,.02]}><GlowRing radius={.15} tube={.027}/></group>
    <mesh position={[0,-.58,.14]} scale={[1.62,.90,1.90]} castShadow><sphereGeometry args={[.205,38,38]}/><PbrWhite/></mesh>
    <mesh position={[0,-.675,.18]} scale={[1.48,.32,1.67]}><sphereGeometry args={[.205,32,32]}/><meshPhysicalMaterial color={BLUE_DARK} roughness={.12} clearcoat={.8}/></mesh>
    <mesh position={[0,-.64,.315]} scale={[1.02,.12,1.02]}><boxGeometry args={[.38,.08,.18]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.7} toneMapped={false}/></mesh>
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
  if(interaction==='typing') return <group position={[0,-.02,1.05]}><mesh position={[0,.12,0]}><boxGeometry args={[.94,.52,.05]}/><meshPhysicalMaterial color="#dfe8f1" roughness={.25} metalness={.22}/></mesh><mesh position={[0,.12,.032]}><boxGeometry args={[.75,.36,.02]}/><meshStandardMaterial color="#9fd8ff"/></mesh><mesh position={[0,-.17,.22]} rotation={[.2,0,0]}><boxGeometry args={[1.04,.39,.06]}/><meshPhysicalMaterial color="#edf3f9" roughness={.28} metalness={.12}/></mesh></group>
  if(interaction==='thinking') return <group><mesh position={[.92,2.25,.22]}><sphereGeometry args={[.08,20,20]}/><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={.9}/></mesh><mesh position={[1.09,2.44,.22]}><sphereGeometry args={[.055,20,20]}/><meshStandardMaterial color={CYAN}/></mesh></group>
  if(interaction==='sleeping') return <group><mesh position={[.82,2.08,.2]}><boxGeometry args={[.12,.04,.04]}/><meshStandardMaterial color={BLUE}/></mesh><mesh position={[1.0,2.28,.2]}><boxGeometry args={[.16,.04,.04]}/><meshStandardMaterial color={BLUE}/></mesh><mesh position={[1.18,2.50,.2]}><boxGeometry args={[.2,.04,.04]}/><meshStandardMaterial color={BLUE}/></mesh></group>
  if(interaction==='celebration'||interaction==='excited') return <>{[-1.08,-.84,.84,1.08].map((x,i)=><mesh key={i} position={[x,1.45+(i%2)*.55,.24]} rotation={[0,0,(i-1.5)*.35]}><boxGeometry args={[.06,.25,.04]}/><meshStandardMaterial color={i%2?CYAN:'#ffb11b'} emissive={i%2?CYAN:'#ffb11b'} emissiveIntensity={.4}/></mesh>)}</>
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

    if(state==='idle'&&!active){
      robot.position.y=Math.sin(t*1.35)*.022
      robot.rotation.y=Math.sin(t*.45)*.012
      if(headRef.current){headRef.current.rotation.y=MathUtils.lerp(headRef.current.rotation.y,pointer.x*.09,.06);headRef.current.rotation.x=MathUtils.lerp(headRef.current.rotation.x,-pointer.y*.045,.06)}
      if(leftArmRef.current)leftArmRef.current.rotation.z=.05
      if(rightArmRef.current)rightArmRef.current.rotation.z=-.05
    }
    if(state==='loading'&&!active){robot.position.y=Math.sin(t*2.6)*.03;if(headRef.current)headRef.current.rotation.y=Math.sin(t*1.8)*.06}
    if(state==='success'&&!active){robot.position.y=Math.abs(Math.sin(t*4))*.07;if(leftArmRef.current)leftArmRef.current.rotation.z=.95;if(rightArmRef.current)rightArmRef.current.rotation.z=-.95}
    if((state==='error'||state==='offline')&&!active){robot.position.y=-.02;if(headRef.current)headRef.current.rotation.x=.07}

    if(interaction==='wave'||waving){if(rightArmRef.current){rightArmRef.current.rotation.z=-1.10+Math.sin(t*11)*.16;rightArmRef.current.rotation.x=-.24;rightArmRef.current.rotation.y=-.12}}
    if(interaction==='high-five'){if(rightArmRef.current){rightArmRef.current.rotation.z=-1.18;rightArmRef.current.rotation.x=-.90;rightArmRef.current.rotation.y=-.12};robot.position.y=.03}
    if(interaction==='dance'){robot.position.x=Math.sin(t*4)*.05;robot.position.y=.04+Math.abs(Math.sin(t*4.2))*.05;robot.rotation.z=Math.sin(t*6)*.06;if(leftArmRef.current){leftArmRef.current.rotation.x=-.30;leftArmRef.current.rotation.z=.52+Math.sin(t*7)*.24};if(rightArmRef.current){rightArmRef.current.rotation.x=-.30;rightArmRef.current.rotation.z=-.52-Math.sin(t*7)*.24}}
    if(interaction==='thinking'){if(headRef.current){headRef.current.rotation.z=-.07;headRef.current.rotation.y=.08};if(rightArmRef.current){rightArmRef.current.rotation.z=-.66;rightArmRef.current.rotation.x=-.58;rightArmRef.current.rotation.y=-.12}}
    if(interaction==='typing'){if(leftArmRef.current){leftArmRef.current.rotation.z=.30;leftArmRef.current.rotation.x=-.76};if(rightArmRef.current){rightArmRef.current.rotation.z=-.30;rightArmRef.current.rotation.x=-.76};if(headRef.current)headRef.current.rotation.x=.07}
    if(interaction==='sleeping'){robot.rotation.z=-.14;robot.position.y=-.07;if(headRef.current){headRef.current.rotation.z=-.10;headRef.current.rotation.x=.11}}
    if(interaction==='excited'||interaction==='celebration'){robot.position.y=Math.abs(Math.sin(t*4.8))*.10;if(leftArmRef.current){leftArmRef.current.rotation.z=.78;leftArmRef.current.rotation.x=-.25};if(rightArmRef.current){rightArmRef.current.rotation.z=-.78;rightArmRef.current.rotation.x=-.25}}
    if(interaction==='sad'){robot.position.y=-.05;if(headRef.current)headRef.current.rotation.x=.12;if(leftArmRef.current)leftArmRef.current.rotation.z=.18;if(rightArmRef.current)rightArmRef.current.rotation.z=-.18}
  })

  const sad=state==='error'||interaction==='sad',robe=outfit!=='default',cloth=outfit==='saudi-red'?'#d82e42':'#fbfbfb'
  const poke=(e:{stopPropagation:()=>void})=>{e.stopPropagation();waveUntil.current=performance.now()+1400;onPoke?.()}

  return <group ref={robotRef} onClick={poke} scale={[1.04,1.04,1.04]}>
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

    <mesh position={[0,.79,0]}><cylinderGeometry args={[.25,.27,.18,36]}/><meshPhysicalMaterial color={JOINT} roughness={.14} metalness={.3}/></mesh>
    <group position={[0,.89,0]}><GlowRing radius={.28} tube={.031}/></group>
    <RoundedBox args={[1.16,1.33,.82]} radius={.36} smoothness={8} position={[0,.06,0]} castShadow><meshPhysicalMaterial color={WHITE} roughness={.10} clearcoat={1} clearcoatRoughness={.04}/></RoundedBox>
    <RoundedBox args={[.90,.88,.13]} radius={.25} smoothness={8} position={[0,.18,.46]}><meshPhysicalMaterial color={WHITE_SOFT} roughness={.14} clearcoat={.72}/></RoundedBox>
    <ChestLogo/>
    <RoundedBox args={[.065,.31,.035]} radius={.028} smoothness={5} position={[0,-.08,.54]}><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.6} toneMapped={false}/></RoundedBox>
    <mesh position={[-.50,-.44,0]}><sphereGeometry args={[.15,28,28]}/><meshPhysicalMaterial color={JOINT} roughness={.18} metalness={.18}/></mesh>
    <mesh position={[.50,-.44,0]}><sphereGeometry args={[.15,28,28]}/><meshPhysicalMaterial color={JOINT} roughness={.18} metalness={.18}/></mesh>
    <group position={[-.50,-.44,0]}><GlowRing radius={.17} tube={.026}/></group>
    <group position={[.50,-.44,0]}><GlowRing radius={.17} tube={.026}/></group>

    <Arm side={-1} refObj={leftArmRef}/>
    <Arm side={1} refObj={rightArmRef}/>
    <Leg side={-1}/>
    <Leg side={1}/>
    <Effects interaction={interaction}/>
  </group>
}
