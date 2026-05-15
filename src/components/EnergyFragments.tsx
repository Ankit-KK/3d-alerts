'use client';

import { useRef, useMemo, useEffect } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

const FRAGMENT_COUNT = 14;

export function EnergyFragments() {
  const apis = useRef<any[]>([]);

  const fragments = useMemo(
    () =>
      Array.from({ length: FRAGMENT_COUNT }).map((_, i) => ({
        id: i,
        color: new THREE.Color().setHSL(0.55 + Math.random() * 0.2, 1, 0.5),
      })),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      apis.current.forEach((api, i) => {
        if (!api) return;
        // Directional explosion: mostly outward and upward
        const angle = (i / FRAGMENT_COUNT) * Math.PI * 2;
        api.applyImpulse(
          {
            x: Math.cos(angle) * 2.2,
            y: 3 + Math.random() * 2,
            z: Math.sin(angle) * 2.2 + (Math.random() - 0.5) * 1.5,
          },
          true
        );
      });
    }, 80);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <RigidBody type="fixed" position={[0, -1.8, 0]}>
        <CuboidCollider args={[2.5, 0.1, 2.5]} />
      </RigidBody>
      {fragments.map((f, i) => (
        <RigidBody
          key={`frag-${i}`}
          colliders="cuboid"
          mass={0.1}
          position={[0, 0, 0]}
          linearDamping={0.25}
          angularDamping={0.3}
          ref={(api) => { apis.current[i] = api; }}
        >
          <mesh>
            <boxGeometry args={[0.12, 0.12, 0.12]} />
            <meshStandardMaterial
              color={f.color}
              emissive={f.color}
              emissiveIntensity={1.8}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}
