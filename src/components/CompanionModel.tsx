import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Group, MathUtils, Mesh, Object3D } from 'three'
import type { CompanionInteraction } from '../lib/interactions'
import type { CompanionState, Outfit } from '../lib/types'

const MODEL_URL = '/models/helpnest-companion.glb'

type Props = { state: CompanionState; outfit: Outfit; interaction?: CompanionInteraction; onPoke?: () => void }

export function CompanionModel({ state, interaction = 'none', onPoke }: Props) {
  const { scene } = useGLTF(MODEL_URL)
  const model = useMemo(() => scene.clone(true), [scene])
  const rootRef = useRef<Group>(null)
  const head = useMemo(() => model.getObjectByName('HeadRig'), [model])
  const leftArm = useMemo(() => model.getObjectByName('ArmRig_L'), [model])
  const rightArm = useMemo(() => model.getObjectByName('ArmRig_R'), [model])
  const leftEye = useMemo(() => model.getObjectByName('Eye_L') as Mesh | undefined, [model])
  const rightEye = useMemo(() => model.getObjectByName('Eye_R') as Mesh | undefined, [model])
  const mouth = useMemo(() => Array.from({length:7},(_,i)=>model.getObjectByName(`Mouth_${i}`) as Mesh | undefined).filter(Boolean) as Mesh[], [model])

  useFrame(({ clock, pointer }) => {
    const root=rootRef.current;if(!root)return
    const t=clock.getElapsedTime(),active=interaction!=='none'
    const wide=['wave','high-five','dance','excited','celebration'].includes(interaction)
    const targetScale=wide?.82:.92
    root.scale.setScalar(MathUtils.lerp(root.scale.x,targetScale,.12));root.rotation.x=MathUtils.lerp(root.rotation.x,0,.14);root.rotation.y=MathUtils.lerp(root.rotation.y,0,.16);root.rotation.z=MathUtils.lerp(root.rotation.z,0,.14);root.position.x=MathUtils.lerp(root.position.x,0,.14)

    if(head&&!active){head.rotation.z=MathUtils.lerp(head.rotation.z,0,.12);head.rotation.y=MathUtils.lerp(head.rotation.y,state==='idle'?pointer.x*.08:0,.07);head.rotation.x=MathUtils.lerp(head.rotation.x,state==='idle'?-pointer.y*.04:0,.07)}
    if(leftArm&&!active){leftArm.rotation.x=MathUtils.lerp(leftArm.rotation.x,0,.12);leftArm.rotation.z=MathUtils.lerp(leftArm.rotation.z,-.08,.12)}
    if(rightArm&&!active){rightArm.rotation.x=MathUtils.lerp(rightArm.rotation.x,0,.12);rightArm.rotation.z=MathUtils.lerp(rightArm.rotation.z,.08,.12)}

    // Living face: blink, eye squash, gaze and animated smile.
    const blinkPhase=t%4.4
    const blink=blinkPhase>4.18?.10:1
    let eyeY=blink,eyeX=1
    if(interaction==='sleeping')eyeY=.10
    else if(interaction==='sad'||state==='error'||state==='offline'){eyeY=.55;eyeX=.92}
    else if(interaction==='excited'||interaction==='celebration'||state==='success'){eyeY=.72;eyeX=1.14}
    else if(interaction==='thinking'){eyeY=.82;eyeX=.96}
    const gazeX=!active&&state==='idle'?pointer.x*.035:interaction==='thinking'?.025:0
    const gazeY=!active&&state==='idle'?-pointer.y*.018:interaction==='sleeping'?-.015:0
    for(const [eye,dir] of [[leftEye,-1],[rightEye,1]] as const){if(eye){eye.scale.x=MathUtils.lerp(eye.scale.x,eyeX,.28);eye.scale.y=MathUtils.lerp(eye.scale.y,eyeY,.34);eye.position.x=MathUtils.lerp(eye.position.x,dir*.28+gazeX,.20);eye.position.y=MathUtils.lerp(eye.position.y,.07+gazeY,.20)}}
    const mouthMood=interaction==='sad'||state==='error'||state==='offline'?'sad':interaction==='sleeping'?'sleep':interaction==='excited'||interaction==='celebration'||state==='success'?'big':'smile'
    mouth.forEach((dot,i)=>{const x=(i-3)*.055;let y=-.20-Math.abs(i-3)*.012;if(mouthMood==='sad')y=-.27+Math.abs(i-3)*.014;else if(mouthMood==='sleep')y=-.235;else if(mouthMood==='big')y=-.18-Math.abs(i-3)*.022;dot.position.x=MathUtils.lerp(dot.position.x,x,.25);dot.position.y=MathUtils.lerp(dot.position.y,y,.25);dot.scale.setScalar(MathUtils.lerp(dot.scale.x,mouthMood==='big'?1.22:1,.22))})

    if(state==='idle'&&!active)root.position.y=Math.sin(t*1.35)*.018
    if(state==='loading'&&!active){root.position.y=Math.sin(t*2.5)*.025;if(head)head.rotation.y=Math.sin(t*1.7)*.05}
    if(state==='success'&&!active){root.position.y=Math.abs(Math.sin(t*4.4))*.065;if(leftArm)leftArm.rotation.z=-.66;if(rightArm)rightArm.rotation.z=.66}
    if(interaction==='wave'&&rightArm){rightArm.rotation.z=.88+Math.sin(t*10)*.12;rightArm.rotation.x=-.18}
    if(interaction==='high-five'&&rightArm){rightArm.rotation.z=.98;rightArm.rotation.x=-.68}
    if(interaction==='dance'){root.position.x=Math.sin(t*4)*.035;root.position.y=.03+Math.abs(Math.sin(t*4.2))*.04;root.rotation.z=Math.sin(t*6)*.05;if(head)head.rotation.y=Math.sin(t*4)*.06;if(leftArm)leftArm.rotation.z=-.46-Math.sin(t*7)*.16;if(rightArm)rightArm.rotation.z=.46+Math.sin(t*7)*.16}
    if(interaction==='thinking'){if(head){head.rotation.z=-.05;head.rotation.y=.06+Math.sin(t*1.8)*.025}if(rightArm){rightArm.rotation.z=.62;rightArm.rotation.x=-.44}}
    if(interaction==='typing'){if(leftArm){leftArm.rotation.z=-.28;leftArm.rotation.x=-.62}if(rightArm){rightArm.rotation.z=.28;rightArm.rotation.x=-.62}if(head)head.rotation.x=.06+Math.sin(t*3)*.015}
    if(interaction==='sleeping'){root.rotation.z=-.10;root.position.y=-.05;if(head){head.rotation.z=-.08;head.rotation.x=.08+Math.sin(t*.8)*.012}}
    if(interaction==='excited'||interaction==='celebration'){root.position.y=Math.abs(Math.sin(t*4.8))*.08;if(head)head.rotation.z=Math.sin(t*5)*.025;if(leftArm)leftArm.rotation.z=-.66;if(rightArm)rightArm.rotation.z=.66}
    if(interaction==='sad'){root.position.y=-.04;if(head)head.rotation.x=.10;if(leftArm)leftArm.rotation.z=-.18;if(rightArm)rightArm.rotation.z=.18}
  })

  const poke=(event:{stopPropagation:()=>void})=>{event.stopPropagation();onPoke?.()}
  return <group ref={rootRef} onClick={poke} scale={.92}><primitive object={model as Object3D}/></group>
}
useGLTF.preload(MODEL_URL)
