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
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = buffer
        this.onloadend?.({ target: this })
      }).catch((error) => this.onerror?.(error))
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buffer) => {
        const base64 = Buffer.from(buffer).toString('base64')
        this.result = `data:${blob.type || 'application/octet-stream'};base64,${base64}`
        this.onloadend?.({ target: this })
      }).catch((error) => this.onerror?.(error))
    }
  }
}

const WHITE = 0xf8fbff
const SOFT = 0xe6eef8
const BLUE = 0x0b6cff
const BLUE_DARK = 0x073b91
const CYAN = 0x6ff7ff
const VISOR = 0x071421
const JOINT = 0x16283e
const GLOVE = 0x10243f

const shell = new THREE.MeshPhysicalMaterial({ color: WHITE, roughness: .16, metalness: .04, clearcoat: 1, clearcoatRoughness: .05 })
const soft = new THREE.MeshPhysicalMaterial({ color: SOFT, roughness: .25, clearcoat: .7 })
const blue = new THREE.MeshPhysicalMaterial({ color: BLUE, roughness: .14, metalness: .25, clearcoat: 1 })
const deepBlue = new THREE.MeshPhysicalMaterial({ color: BLUE_DARK, roughness: .12, metalness: .35, clearcoat: 1 })
const visor = new THREE.MeshPhysicalMaterial({ color: VISOR, roughness: .05, metalness: .45, clearcoat: 1, clearcoatRoughness: .03 })
const joint = new THREE.MeshPhysicalMaterial({ color: JOINT, roughness: .2, metalness: .42 })
const glove = new THREE.MeshPhysicalMaterial({ color: GLOVE, roughness: .18, metalness: .30, clearcoat: .55 })
const cyan = new THREE.MeshStandardMaterial({ color: CYAN, emissive: CYAN, emissiveIntensity: 1.8 })

function mesh(geometry, material, name, position = [0,0,0], rotation = [0,0,0], scale = [1,1,1]) {
  const m = new THREE.Mesh(geometry, material)
  m.name = name
  m.position.set(...position)
  m.rotation.set(...rotation)
  m.scale.set(...scale)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

function glowRing(radius, name) {
  return mesh(new THREE.TorusGeometry(radius, .025, 12, 36), cyan, name, [0,0,0], [Math.PI/2,0,0])
}

function makeHand(side) {
  const suffix = side < 0 ? 'L' : 'R'
  const group = new THREE.Group()
  group.name = `Hand_${suffix}`
  group.add(mesh(new THREE.SphereGeometry(.17, 28, 20), glove, `Palm_${suffix}`, [0,0,0], [0,0,0], [1.05,.95,.72]))
  const xs = [-.105,-.035,.035,.105]
  xs.forEach((x, i) => {
    group.add(mesh(new THREE.CapsuleGeometry(.035,.10,5,10), glove, `Finger${i+1}_${suffix}`, [x,-.16,.045], [0,0,(i-1.5)*.05]))
  })
  group.add(mesh(new THREE.CapsuleGeometry(.042,.11,5,10), glove, `Thumb_${suffix}`, [side*.17,-.02,.04], [0,0,side*.72]))
  return group
}

function makeArm(side) {
  const suffix = side < 0 ? 'L' : 'R'
  const rig = new THREE.Group()
  rig.name = `ArmRig_${suffix}`
  rig.position.set(side*.78,.48,.03)
  rig.add(mesh(new THREE.SphereGeometry(.20,28,20), joint, `ShoulderJoint_${suffix}`))
  rig.add(mesh(new THREE.SphereGeometry(.19,28,20), shell, `ShoulderShell_${suffix}`, [side*.02,-.03,.01], [0,0,0], [1.12,.82,1.06]))
  const upper = mesh(new THREE.CapsuleGeometry(.13,.30,6,14), shell, `UpperArm_${suffix}`, [side*.02,-.32,.03], [0,0,side*-.08])
  rig.add(upper)
  rig.add(mesh(new THREE.SphereGeometry(.115,24,18), joint, `Elbow_${suffix}`, [side*.04,-.60,.07]))
  const elbowRing = glowRing(.118, `ElbowGlow_${suffix}`); elbowRing.position.set(side*.04,-.60,.07); rig.add(elbowRing)
  rig.add(mesh(new THREE.CapsuleGeometry(.115,.28,6,14), soft, `Forearm_${suffix}`, [side*.06,-.88,.12], [0,0,side*-.06]))
  const hand = makeHand(side)
  hand.position.set(side*.10,-1.18,.24)
  rig.add(hand)
  return rig
}

function makeLeg(side) {
  const suffix = side < 0 ? 'L' : 'R'
  const group = new THREE.Group()
  group.name = `LegRig_${suffix}`
  group.position.set(side*.30,-.55,0)
  group.add(mesh(new THREE.SphereGeometry(.15,24,18), joint, `Hip_${suffix}`))
  group.add(mesh(new THREE.CapsuleGeometry(.16,.32,6,14), shell, `Leg_${suffix}`, [0,-.30,.02]))
  const ankle = glowRing(.145, `AnkleGlow_${suffix}`); ankle.position.set(0,-.54,.05); group.add(ankle)
  group.add(mesh(new THREE.SphereGeometry(.22,28,20), shell, `Boot_${suffix}`, [0,-.72,.16], [0,0,0], [1.42,.82,1.72]))
  group.add(mesh(new THREE.SphereGeometry(.20,24,18), deepBlue, `Sole_${suffix}`, [0,-.86,.18], [0,0,0], [1.40,.26,1.55]))
  return group
}

const root = new THREE.Group()
root.name = 'HelpNestCompanion'

const head = new THREE.Group()
head.name = 'HeadRig'
head.position.set(0,1.48,0)
head.add(mesh(new RoundedBoxGeometry(1.72,1.28,.90,8,.34), shell, 'HeadShell'))
head.add(mesh(new RoundedBoxGeometry(1.56,1.00,.12,8,.28), blue, 'VisorFrame', [0,0,.49]))
head.add(mesh(new RoundedBoxGeometry(1.42,.86,.08,8,.24), visor, 'Visor', [0,0,.57]))
head.add(mesh(new THREE.SphereGeometry(.075,24,18), cyan, 'Eye_L', [-.28,.07,.63], [0,0,0], [1.08,.92,.40]))
head.add(mesh(new THREE.SphereGeometry(.075,24,18), cyan, 'Eye_R', [.28,.07,.63], [0,0,0], [1.08,.92,.40]))
for (let i=0;i<7;i++) {
  const a = .20*Math.PI + i*(.60*Math.PI/6)
  head.add(mesh(new THREE.SphereGeometry(.024,12,10), cyan, `Mouth_${i}`, [.20*Math.cos(a),-.21-.11*Math.sin(a),.635]))
}
for (const side of [-1,1]) {
  const suffix = side < 0 ? 'L' : 'R'
  head.add(mesh(new THREE.CylinderGeometry(.22,.22,.16,28), deepBlue, `Ear_${suffix}`, [side*.94,0,0], [0,0,Math.PI/2]))
}
head.add(mesh(new THREE.CylinderGeometry(.022,.026,.30,10), joint, 'AntennaStem', [.42,.75,0], [0,0,-.10]))
head.add(mesh(new THREE.SphereGeometry(.07,18,14), cyan, 'AntennaTip', [.45,.92,0]))
root.add(head)

root.add(mesh(new THREE.CylinderGeometry(.23,.25,.18,28), joint, 'Neck', [0,.78,0]))
const neckGlow = glowRing(.25,'NeckGlow'); neckGlow.position.set(0,.88,0); root.add(neckGlow)
root.add(mesh(new RoundedBoxGeometry(1.12,1.34,.80,8,.32), shell, 'Torso', [0,.08,0]))
root.add(mesh(new RoundedBoxGeometry(.84,.88,.10,6,.22), soft, 'ChestPanel', [0,.18,.44]))
root.add(mesh(new RoundedBoxGeometry(.055,.30,.035,4,.025), cyan, 'ChestLight', [0,-.06,.515]))

const logo = new THREE.Group(); logo.name = 'HNLogo'; logo.position.set(0,.34,.525)
logo.add(mesh(new THREE.BoxGeometry(.05,.23,.03), blue, 'H1', [-.12,0,0]))
logo.add(mesh(new THREE.BoxGeometry(.05,.23,.03), blue, 'H2', [-.03,0,0]))
logo.add(mesh(new THREE.BoxGeometry(.14,.045,.03), blue, 'HBar', [-.075,0,0]))
logo.add(mesh(new THREE.BoxGeometry(.05,.23,.03), blue, 'N1', [.08,0,0]))
logo.add(mesh(new THREE.BoxGeometry(.05,.23,.03), blue, 'N2', [.18,0,0]))
logo.add(mesh(new THREE.BoxGeometry(.05,.25,.03), blue, 'NDiag', [.13,0,0], [0,0,-.46]))
root.add(logo)

root.add(makeArm(-1))
root.add(makeArm(1))
root.add(makeLeg(-1))
root.add(makeLeg(1))

const exporter = new GLTFExporter()
const outDir = path.resolve('public/models')
fs.mkdirSync(outDir, { recursive: true })

exporter.parse(
  root,
  (result) => {
    const buffer = Buffer.from(result)
    fs.writeFileSync(path.join(outDir, 'helpnest-companion.glb'), buffer)
    console.log(`Generated HelpNest companion model: ${Math.round(buffer.length / 1024)} KB`)
  },
  (error) => {
    console.error(error)
    process.exitCode = 1
  },
  { binary: true, onlyVisible: true, trs: false }
)
