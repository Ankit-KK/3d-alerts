'use client';

import { useRef, useMemo, useEffect } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

const COUNT = 16;

export function EnergyFragments() {
  const apis = useRef<any[]>([]);

  const frags = useMemo(
    () =>
      Array.from({ length: COUNT }).map((_, i) => ({
        id: i,
        color: new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.9, 0.6),
        scale: 0.08 + Math.random() * 0.1,
      })),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      apis.current.forEach((api, i) => {
        if (!api) return;
        const angle = (i / COUNT) * Math.PI * 2;
        const speed = 2.5 + Math.random() * 2;
        api.applyImpulse(
          {
            x: Math.cos(angle) * speed,
            y: 4 + Math.random() * 3,
            z: Math.sin(angle) * speed + (Math.random() - 0.5) * 2,
          },
          true
        );
      });
    }, 80);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <RigidBody type="fixed" position={[0, -1.5, 0]}>
        <CuboidCollider args={[3, 0.1, 3]} />
      </RigidBody>
      {frags.map((f, i) => (
        <RigidBody
          key={i}
          colliders="cuboid"
          mass={0.08}
          position={[0, 0.15, 0]}
          linearDamping={0.3}
          angularDamping={0.4}
          ref={(api) => { apis.current[i] = api; }}
        >
          <mesh scale={[f.scale, f.scale, f.scale]}>
            <boxGeometry />
            <meshStandardMaterial
              color={f.color}
              emissive={f.color}
              emissiveIntensity={1.5}
              roughness={0.1}
              metalness={0.7}
            />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}
