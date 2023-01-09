import {
  AccumulativeShadows,
  OrbitControls,
  PointMaterial,
  Points,
  RandomizedLight,
  useTexture,
} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { memo, Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

function Earth() {
  const ref = useRef<any>({})
  const earth = useTexture({
    map: '8k_earth_daymap.jpg',

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
          emissive={new THREE.Color('#fff')}
          emissiveIntensity={5}
        />
      </mesh>
    </group>
  )
}
function Stars(props: any) {
  const ref = useRef()
  const count = 100 // number point accross one axis ini akan generate point 10.00 dimana count hanya 100 karena multiply
  const sep = 3 //merupakan distance dari tiap point
  const [data, setData] = useState<{
    ID: string
    Name: string
    Orbiting: string
    Ephemeris: any
  }>()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const loadData = async () => {
      const data = await (
        await fetch('/ephemeris/1998-067-A/2021-08-26')
      ).json()
      setData(data)
      setLoading(false)
    }
    loadData()
  }, [])
  console.log(data)

  let positions: Array<any> = []

  data?.Ephemeris.forEach((e) => {
    console.log(e)
    positions.push(e.x / 20, e.y / 20, e.z / 20)
  })
  console.log(positions)
  if (data) {
    console.log(data)
  }
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {!loading && (
        <Points
          ref={ref as any}
          stride={3}
          frustumCulled={false}
          positions={new Float32Array(positions)}
        >
          <PointMaterial
            transparent
            color='#ffa0e0'
            size={0.02}
            sizeAttenuation={true}
            depthWrite={false}
          />
        </Points>
      )}
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
    <Suspense fallback={<>Loading...</>}>
      <Canvas>
        <Earth />
        <Stars />

        <OrbitControls makeDefault />
        <Shadows />
      </Canvas>
    </Suspense>
  )
}
