import {
  AccumulativeShadows,
  OrbitControls,
  PointMaterial,
  Points,
  RandomizedLight,
  useTexture,
} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import * as random from 'maath/random/dist/maath-random.cjs'
import { memo, useRef, useState } from 'react'
import * as THREE from 'three'

function Earth() {
  const ref = useRef<any>({})
  const earth = useTexture({
    map: '8k_earth_daymap.jpg',
    bumpMap: 'EARTH_DISPLACE_42K_16BITS_preview.jpg',
    normalMap: '8k_earth_normal_map.jpg',
    emissiveMap: '8k_earth_nightmap.jpg',
  })
  return (
    <group ref={ref}>
      {/* <Stars /> */}
      <rectAreaLight
        intensity={1}
        position={[10, 10, 10]}
        width={10}
        height={1000}
        onUpdate={(self) => self.lookAt(new THREE.Vector3(0, 0, 0))}
      />
      <rectAreaLight
        intensity={1}
        position={[-10, -10, -10]}
        width={1000}
        height={10}
        onUpdate={(self) => self.lookAt(new THREE.Vector3(0, 0, 0))}
      />
      <mesh castShadow receiveShadow>
        <sphereBufferGeometry attach='geometry' args={[2, 64, 64]} />
        <meshStandardMaterial
          attach='material'
          {...earth}
          bumpScale={0.01}
          emissive={new THREE.Color('#fff')}
          emissiveIntensity={5}
          displacementScale={0.2}
        />
      </mesh>
    </group>
  )
}
function Stars(props: any) {
  const ref = useRef()
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 3 }),
  )

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color='#ffa0e0'
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  )
}

const Shadows = memo(() => (
  <AccumulativeShadows
    temporal
    frames={100}
    color='#9d4b4b'
    colorBlend={0.5}
    alphaTest={0.9}
    scale={20}
  >
    <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
  </AccumulativeShadows>
))

export default function Visualizer() {
  return (
    <Canvas>
      <Earth />
      {/* <Stars /> */}

      <OrbitControls makeDefault />
      <Shadows />
    </Canvas>
  )
}
