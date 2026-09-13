import fs from 'node:fs'
import path from 'node:path'
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    result=null; onloadend=null; onerror=null
    readAsArrayBuffer(blob){blob.arrayBuffer().then(b=>{this.result=b;this.onloadend?.({target:this})}).catch(e=>this.onerror?.(e))}
    readAsDataURL(blob){blob.arrayBuffer().then(b=>{this.result=`data:${blob.type||'application/octet-stream'};base64,${Buffer.from(b).toString('base64')}`;this.onloadend?.({target:this})}).catch(e=>this.onerror?.(e))}
  }
}

const WHITE=0xfbfefe,SOFT=0xeaf2fb,BLUE=0x0d6cff,BLUE_DARK=0x063d9a,CYAN=0x8bf8ff,VISOR=0x05111f,JOINT=0x15283f,GLOVE=0x152a45
const shell=new THREE.MeshPhysicalMaterial({color:WHITE,roughness:.10,metalness:.03,clearcoat:1,clearcoatRoughness:.035})
const soft=new THREE.MeshPhysicalMaterial({color:SOFT,roughness:.18,clearcoat:.78})
const blue=new THREE.MeshPhysicalMaterial({color:BLUE,roughness:.09,metalness:.22,clearcoat:1})
const deepBlue=new THREE.MeshPhysicalMaterial({color:BLUE_DARK,roughness:.08,metalness:.36,clearcoat:1})
const visor=new THREE.MeshPhysicalMaterial({color:VISOR,roughness:.035,metalness:.48,clearcoat:1,clearcoatRoughness:.02})
const joint=new THREE.MeshPhysicalMaterial({color:JOINT,roughness:.16,metalness:.42})
const glove=new THREE.MeshPhysicalMaterial({color:GLOVE,roughness:.14,metalness:.32,clearcoat:.60})
const cyan=new THREE.MeshStandardMaterial({color:CYAN,emissive:CYAN,emissiveIntensity:2.2,toneMapped:false})
const glass=new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.10,roughness:.01,clearcoat:1})

function mesh(geometry,material,name,position=[0,0,0],rotation=[0,0,0],scale=[1,1,1]){const m=new THREE.Mesh(geometry,material);m.name=name;m.position.set(...position);m.rotation.set(...rotation);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;return m}
function glowRing(radius,name,tube=.023){return mesh(new THREE.TorusGeometry(radius,tube,16,48),cyan,name,[0,0,0],[Math.PI/2,0,0])}
function arc(radius,tube,arcLength,name,position,rotation=[0,0,0],scale=[1,1,1]){return mesh(new THREE.TorusGeometry(radius,tube,12,40,arcLength),cyan,name,position,rotation,scale)}

function makeHand(side){
  const s=side<0?'L':'R',g=new THREE.Group();g.name=`Hand_${s}`
  g.add(mesh(new THREE.SphereGeometry(.215,34,26),glove,`Palm_${s}`,[0,0,0],[0,0,0],[1.08,.98,.78]))
  const xs=[-.12,-.04,.04,.12]
  xs.forEach((x,i)=>g.add(mesh(new THREE.CapsuleGeometry(.043,.105,6,12),glove,`Finger${i+1}_${s}`,[x,-.18,.06],[0,0,(i-1.5)*.07])))
  g.add(mesh(new THREE.CapsuleGeometry(.052,.12,6,12),glove,`Thumb_${s}`,[side*.20,-.02,.07],[0,0,side*.78]))
  return g
}

function makeArm(side){
  const s=side<0?'L':'R',rig=new THREE.Group();rig.name=`ArmRig_${s}`;rig.position.set(side*.84,.49,.04)
  rig.add(mesh(new THREE.SphereGeometry(.22,34,26),joint,`ShoulderJoint_${s}`))
  rig.add(mesh(new THREE.SphereGeometry(.21,32,24),shell,`ShoulderShell_${s}`,[side*.02,-.02,.01],[0,0,0],[1.22,.86,1.10]))
  const sr=glowRing(.168,`ShoulderGlow_${s}`,.022);sr.position.set(0,-.20,.02);rig.add(sr)
  rig.add(mesh(new THREE.CapsuleGeometry(.14,.31,8,18),shell,`UpperArm_${s}`,[side*.03,-.39,.045],[0,0,side*-.05]))
  rig.add(mesh(new THREE.SphereGeometry(.125,28,22),joint,`Elbow_${s}`,[side*.04,-.65,.08]))
  const er=glowRing(.13,`ElbowGlow_${s}`,.022);er.position.set(side*.04,-.65,.08);rig.add(er)
  rig.add(mesh(new THREE.CapsuleGeometry(.125,.29,8,18),soft,`Forearm_${s}`,[side*.07,-.94,.13],[0,0,side*-.04]))
  const wr=glowRing(.122,`WristGlow_${s}`,.018);wr.position.set(side*.09,-1.14,.20);rig.add(wr)
  const hand=makeHand(side);hand.position.set(side*.11,-1.29,.28);rig.add(hand)
  return rig
}

function makeLeg(side){
  const s=side<0?'L':'R',g=new THREE.Group();g.name=`LegRig_${s}`;g.position.set(side*.33,-.57,0)
  g.add(mesh(new THREE.SphereGeometry(.17,28,22),joint,`Hip_${s}`))
  const hr=glowRing(.17,`HipGlow_${s}`,.022);g.add(hr)
  g.add(mesh(new THREE.CapsuleGeometry(.18,.36,8,18),shell,`Thigh_${s}`,[0,-.34,.03]))
  g.add(mesh(new THREE.SphereGeometry(.125,26,20),joint,`Knee_${s}`,[0,-.62,.05]))
  const kr=glowRing(.13,`KneeGlow_${s}`,.018);kr.position.set(0,-.62,.05);g.add(kr)
  g.add(mesh(new THREE.CapsuleGeometry(.165,.32,8,18),soft,`Shin_${s}`,[0,-.86,.09]))
  const ar=glowRing(.155,`AnkleGlow_${s}`,.022);ar.position.set(0,-1.10,.09);g.add(ar)
  g.add(mesh(new THREE.SphereGeometry(.245,34,26),shell,`Boot_${s}`,[0,-1.26,.22],[0,0,0],[1.55,.88,1.90]))
  g.add(mesh(new THREE.SphereGeometry(.225,30,24),deepBlue,`Sole_${s}`,[0,-1.41,.24],[0,0,0],[1.54,.28,1.70]))
  const br=glowRing(.265,`BootGlow_${s}`,.019);br.position.set(0,-1.34,.22);g.add(br)
  return g
}

const root=new THREE.Group();root.name='HelpNestCompanion'

const head=new THREE.Group();head.name='HeadRig';head.position.set(0,1.54,0)
head.add(mesh(new RoundedBoxGeometry(1.86,1.38,.98,12,.40),shell,'HeadShell'))
head.add(mesh(new RoundedBoxGeometry(1.70,1.12,.18,12,.34),blue,'VisorOuter',[0,0,.50]))
head.add(mesh(new RoundedBoxGeometry(1.56,.98,.13,12,.30),deepBlue,'VisorInner',[0,0,.58]))
head.add(mesh(new RoundedBoxGeometry(1.46,.88,.09,12,.27),visor,'Visor',[0,0,.66]))
head.add(mesh(new RoundedBoxGeometry(.92,.14,.02,8,.07),glass,'VisorHighlight',[-.16,.30,.715],[0,0,-.07]))

const leftEye=new THREE.Group();leftEye.name='Eye_L';leftEye.position.set(-.31,.10,.715);leftEye.add(arc(.12,.028,Math.PI,'EyeArc_L',[0,0,0],[0,0,0],[1.15,.78,1]));head.add(leftEye)
const rightEye=new THREE.Group();rightEye.name='Eye_R';rightEye.position.set(.31,.10,.715);rightEye.add(arc(.12,.028,Math.PI,'EyeArc_R',[0,0,0],[0,0,0],[1.15,.78,1]));head.add(rightEye)
const smile=new THREE.Group();smile.name='MouthSmile';smile.position.set(0,-.20,.718);smile.add(arc(.23,.029,Math.PI,'SmileArc',[0,0,0],[0,0,Math.PI],[1,.72,1]));head.add(smile)

for(const side of [-1,1]){const s=side<0?'L':'R';head.add(mesh(new THREE.CylinderGeometry(.25,.25,.18,36),deepBlue,`Ear_${s}`,[side*1.01,0,0],[0,0,Math.PI/2]));head.add(mesh(new THREE.CylinderGeometry(.17,.17,.05,32),cyan,`EarGlow_${s}`,[side*1.11,0,0],[0,0,Math.PI/2]))}
head.add(mesh(new THREE.CylinderGeometry(.022,.026,.31,12),joint,'AntennaStem',[.44,.82,-.03],[0,0,-.10]))
head.add(mesh(new THREE.SphereGeometry(.075,20,16),cyan,'AntennaTip',[.47,1.00,-.03]))
root.add(head)

root.add(mesh(new THREE.CylinderGeometry(.25,.27,.19,32),joint,'Neck',[0,.80,0]))
const ng=glowRing(.265,'NeckGlow',.027);ng.position.set(0,.90,0);root.add(ng)
root.add(mesh(new RoundedBoxGeometry(1.26,1.42,.86,10,.38),shell,'Torso',[0,.05,0]))
root.add(mesh(new RoundedBoxGeometry(.96,.96,.12,9,.26),soft,'ChestPanel',[0,.18,.48]))
root.add(mesh(new RoundedBoxGeometry(.065,.33,.04,5,.03),cyan,'ChestLight',[0,-.09,.56]))

const logo=new THREE.Group();logo.name='HNLogo';logo.position.set(0,.36,.57)
logo.add(mesh(new THREE.BoxGeometry(.055,.25,.03),blue,'H1',[-.13,0,0]));logo.add(mesh(new THREE.BoxGeometry(.055,.25,.03),blue,'H2',[-.03,0,0]));logo.add(mesh(new THREE.BoxGeometry(.15,.05,.03),blue,'HBar',[-.08,0,0]));logo.add(mesh(new THREE.BoxGeometry(.055,.25,.03),blue,'N1',[.08,0,0]));logo.add(mesh(new THREE.BoxGeometry(.055,.25,.03),blue,'N2',[.19,0,0]));logo.add(mesh(new THREE.BoxGeometry(.055,.27,.03),blue,'NDiag',[.135,0,0],[0,0,-.46]));root.add(logo)

for(const side of [-1,1]){root.add(mesh(new THREE.SphereGeometry(.16,26,20),joint,`WaistJoint_${side<0?'L':'R'}`,[side*.50,-.47,0]));const r=glowRing(.17,`WaistGlow_${side<0?'L':'R'}`,.022);r.position.set(side*.50,-.47,0);root.add(r)}
root.add(makeArm(-1));root.add(makeArm(1));root.add(makeLeg(-1));root.add(makeLeg(1))

const exporter=new GLTFExporter(),outDir=path.resolve('public/models');fs.mkdirSync(outDir,{recursive:true})
exporter.parse(root,(result)=>{const buffer=Buffer.from(result);fs.writeFileSync(path.join(outDir,'helpnest-companion.glb'),buffer);console.log(`Generated HelpNest companion model: ${Math.round(buffer.length/1024)} KB`)},(error)=>{console.error(error);process.exitCode=1},{binary:true,onlyVisible:true,trs:false})
