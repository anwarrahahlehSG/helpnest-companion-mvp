import fs from 'node:fs'
import path from 'node:path'
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    result = null
    onloadend = null
    onerror = null
    readAsArrayBuffer(blob) { blob.arrayBuffer().then((buffer)=>{ this.result=buffer; this.onloadend?.({target:this}) }).catch((error)=>this.onerror?.(error)) }
    readAsDataURL(blob) { blob.arrayBuffer().then((buffer)=>{ const base64=Buffer.from(buffer).toString('base64'); this.result=`data:${blob.type||'application/octet-stream'};base64,${base64}`; this.onloadend?.({target:this}) }).catch((error)=>this.onerror?.(error)) }
  }
}

const WHITE=0xf8fbff,SOFT=0xe6eef8,BLUE=0x0b6cff,BLUE_DARK=0x073b91,CYAN=0x6ff7ff,VISOR=0x071421,JOINT=0x16283e,GLOVE=0x10243f
const shell=new THREE.MeshPhysicalMaterial({color:WHITE,roughness:.14,metalness:.04,clearcoat:1,clearcoatRoughness:.04})
const soft=new THREE.MeshPhysicalMaterial({color:SOFT,roughness:.22,clearcoat:.75})
const blue=new THREE.MeshPhysicalMaterial({color:BLUE,roughness:.12,metalness:.24,clearcoat:1})
const deepBlue=new THREE.MeshPhysicalMaterial({color:BLUE_DARK,roughness:.10,metalness:.34,clearcoat:1})
const visor=new THREE.MeshPhysicalMaterial({color:VISOR,roughness:.045,metalness:.42,clearcoat:1,clearcoatRoughness:.025})
const joint=new THREE.MeshPhysicalMaterial({color:JOINT,roughness:.18,metalness:.42})
const glove=new THREE.MeshPhysicalMaterial({color:GLOVE,roughness:.17,metalness:.30,clearcoat:.58})
const cyan=new THREE.MeshStandardMaterial({color:CYAN,emissive:CYAN,emissiveIntensity:1.8})
const glassGlow=new THREE.MeshPhysicalMaterial({color:0xbdfaff,transparent:true,opacity:.22,roughness:.02,metalness:.05,clearcoat:1})

function mesh(geometry,material,name,position=[0,0,0],rotation=[0,0,0],scale=[1,1,1]){const m=new THREE.Mesh(geometry,material);m.name=name;m.position.set(...position);m.rotation.set(...rotation);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;return m}
function glowRing(radius,name,tube=.025){return mesh(new THREE.TorusGeometry(radius,tube,14,42),cyan,name,[0,0,0],[Math.PI/2,0,0])}

function makeHand(side){
  const s=side<0?'L':'R',g=new THREE.Group();g.name=`Hand_${s}`
  g.add(mesh(new THREE.SphereGeometry(.19,30,22),glove,`Palm_${s}`,[0,0,0],[0,0,0],[1.08,1,.78]))
  const xs=[-.105,-.035,.035,.105]
  xs.forEach((x,i)=>g.add(mesh(new THREE.CapsuleGeometry(.04,.085,5,10),glove,`Finger${i+1}_${s}`,[x,-.145,.055],[0,0,(i-1.5)*.055])))
  g.add(mesh(new THREE.CapsuleGeometry(.047,.105,5,10),glove,`Thumb_${s}`,[side*.18,-.01,.055],[0,0,side*.72]))
  return g
}

function makeArm(side){
  const s=side<0?'L':'R',rig=new THREE.Group();rig.name=`ArmRig_${s}`;rig.position.set(side*.80,.48,.04)
  rig.add(mesh(new THREE.SphereGeometry(.205,30,22),joint,`ShoulderJoint_${s}`))
  rig.add(mesh(new THREE.SphereGeometry(.195,30,22),shell,`ShoulderShell_${s}`,[side*.02,-.025,.01],[0,0,0],[1.16,.84,1.08]))
  const sr=glowRing(.158,`ShoulderGlow_${s}`,.022);sr.position.set(0,-.19,.015);rig.add(sr)
  rig.add(mesh(new THREE.CapsuleGeometry(.13,.30,7,16),shell,`UpperArm_${s}`,[side*.02,-.36,.035],[0,0,side*-.06]))
  rig.add(mesh(new THREE.SphereGeometry(.118,26,20),joint,`Elbow_${s}`,[side*.035,-.62,.07]))
  const er=glowRing(.122,`ElbowGlow_${s}`,.022);er.position.set(side*.035,-.62,.07);rig.add(er)
  rig.add(mesh(new THREE.CapsuleGeometry(.118,.27,7,16),soft,`Forearm_${s}`,[side*.06,-.89,.12],[0,0,side*-.05]))
  const wr=glowRing(.115,`WristGlow_${s}`,.018);wr.position.set(side*.08,-1.08,.19);rig.add(wr)
  const hand=makeHand(side);hand.position.set(side*.10,-1.19,.25);rig.add(hand)
  return rig
}

function makeLeg(side){
  const s=side<0?'L':'R',g=new THREE.Group();g.name=`LegRig_${s}`;g.position.set(side*.31,-.55,0)
  g.add(mesh(new THREE.SphereGeometry(.16,26,20),joint,`Hip_${s}`))
  const hr=glowRing(.16,`HipGlow_${s}`,.022);g.add(hr)
  g.add(mesh(new THREE.CapsuleGeometry(.17,.34,7,16),shell,`Thigh_${s}`,[0,-.31,.02]))
  g.add(mesh(new THREE.SphereGeometry(.115,24,18),joint,`Knee_${s}`,[0,-.57,.045]))
  const kr=glowRing(.12,`KneeGlow_${s}`,.018);kr.position.set(0,-.57,.045);g.add(kr)
  g.add(mesh(new THREE.CapsuleGeometry(.155,.29,7,16),soft,`Shin_${s}`,[0,-.78,.08]))
  const ar=glowRing(.145,`AnkleGlow_${s}`,.022);ar.position.set(0,-1.00,.08);g.add(ar)
  g.add(mesh(new THREE.SphereGeometry(.23,30,22),shell,`Boot_${s}`,[0,-1.13,.18],[0,0,0],[1.48,.86,1.82]))
  g.add(mesh(new THREE.SphereGeometry(.21,26,20),deepBlue,`Sole_${s}`,[0,-1.27,.20],[0,0,0],[1.46,.25,1.64]))
  const br=glowRing(.245,`BootGlow_${s}`,.018);br.position.set(0,-1.22,.18);g.add(br)
  return g
}

const root=new THREE.Group();root.name='HelpNestCompanion'

const head=new THREE.Group();head.name='HeadRig';head.position.set(0,1.50,0)
head.add(mesh(new RoundedBoxGeometry(1.78,1.30,.94,10,.35),shell,'HeadShell'))
head.add(mesh(new RoundedBoxGeometry(1.62,1.05,.16,10,.30),deepBlue,'VisorOuter',[0,0,.485]))
head.add(mesh(new RoundedBoxGeometry(1.52,.95,.12,10,.27),blue,'VisorGlowFrame',[0,0,.565]))
head.add(mesh(new RoundedBoxGeometry(1.42,.85,.09,10,.24),visor,'Visor',[0,0,.64]))
head.add(mesh(new RoundedBoxGeometry(.78,.13,.025,8,.06),glassGlow,'VisorHighlight',[-.18,.28,.695],[0,0,-.08]))
head.add(mesh(new THREE.SphereGeometry(.078,26,20),cyan,'Eye_L',[-.29,.06,.69],[0,0,0],[1.08,.94,.40]))
head.add(mesh(new THREE.SphereGeometry(.078,26,20),cyan,'Eye_R',[.29,.06,.69],[0,0,0],[1.08,.94,.40]))
for(let i=0;i<9;i++){const a=.18*Math.PI+i*(.64*Math.PI/8);head.add(mesh(new THREE.SphereGeometry(.022,12,10),cyan,`Mouth_${i}`,[.22*Math.cos(a),-.21-.105*Math.sin(a),.695]))}
for(const side of [-1,1]){const s=side<0?'L':'R';head.add(mesh(new THREE.CylinderGeometry(.235,.235,.17,32),deepBlue,`Ear_${s}`,[side*.96,0,0],[0,0,Math.PI/2]));head.add(mesh(new THREE.CylinderGeometry(.15,.15,.045,28),cyan,`EarGlow_${s}`,[side*1.055,0,0],[0,0,Math.PI/2]))}
head.add(mesh(new THREE.CylinderGeometry(.022,.026,.30,10),joint,'AntennaStem',[.42,.75,-.02],[0,0,-.10]))
head.add(mesh(new THREE.SphereGeometry(.072,18,14),cyan,'AntennaTip',[.45,.92,-.02]))
root.add(head)

root.add(mesh(new THREE.CylinderGeometry(.24,.26,.18,30),joint,'Neck',[0,.80,0]))
const ng=glowRing(.255,'NeckGlow',.026);ng.position.set(0,.89,0);root.add(ng)
root.add(mesh(new RoundedBoxGeometry(1.18,1.36,.82,9,.34),shell,'Torso',[0,.08,0]))
root.add(mesh(new RoundedBoxGeometry(.90,.92,.11,8,.23),soft,'ChestPanel',[0,.18,.455]))
root.add(mesh(new RoundedBoxGeometry(.06,.31,.04,5,.025),cyan,'ChestLight',[0,-.07,.53]))

const logo=new THREE.Group();logo.name='HNLogo';logo.position.set(0,.35,.54)
logo.add(mesh(new THREE.BoxGeometry(.05,.24,.03),blue,'H1',[-.12,0,0]));logo.add(mesh(new THREE.BoxGeometry(.05,.24,.03),blue,'H2',[-.03,0,0]));logo.add(mesh(new THREE.BoxGeometry(.14,.045,.03),blue,'HBar',[-.075,0,0]));logo.add(mesh(new THREE.BoxGeometry(.05,.24,.03),blue,'N1',[.08,0,0]));logo.add(mesh(new THREE.BoxGeometry(.05,.24,.03),blue,'N2',[.18,0,0]));logo.add(mesh(new THREE.BoxGeometry(.05,.26,.03),blue,'NDiag',[.13,0,0],[0,0,-.46]));root.add(logo)

for(const side of [-1,1]){root.add(mesh(new THREE.SphereGeometry(.15,24,18),joint,`WaistJoint_${side<0?'L':'R'}`,[side*.46,-.43,0]));const r=glowRing(.16,`WaistGlow_${side<0?'L':'R'}`,.022);r.position.set(side*.46,-.43,0);root.add(r)}
root.add(makeArm(-1));root.add(makeArm(1));root.add(makeLeg(-1));root.add(makeLeg(1))

const exporter=new GLTFExporter(),outDir=path.resolve('public/models');fs.mkdirSync(outDir,{recursive:true})
exporter.parse(root,(result)=>{const buffer=Buffer.from(result);fs.writeFileSync(path.join(outDir,'helpnest-companion.glb'),buffer);console.log(`Generated HelpNest companion model: ${Math.round(buffer.length/1024)} KB`)},(error)=>{console.error(error);process.exitCode=1},{binary:true,onlyVisible:true,trs:false})
