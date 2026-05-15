'use client';

import { useRef, useMemo, useEffect } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

const SHARD_COUNT = 16;

export function EmberShards() {
  const shardApis = useRef<any[]>([]);

  const shards = useMemo(
    () =>
      Array.from({ length: SHARD_COUNT }).map((_, i) => ({
        id: i,
        color: new THREE.Color().setHSL(0.1 + Math.random() * 0.12, 1, 0.4 + Math.random() * 0.5),
      })),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      shardApis.current.forEach((api, i) => {
        if (!api) return;
        const angle = (i / SHARD_COUNT) * Math.PI * 2;
        api.applyImpulse(
          {
            x: Math.cos(angle) * 2.5 + (Math.random() - 0.5) * 2,
            y: 4 + Math.random() * 3,
            z: Math.sin(angle) * 2.5 + (Math.random() - 0.5) * 2,
          },
          true
        );
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <RigidBody type="fixed" position={[0, -1.5, 0]}>
        <CuboidCollider args={[3, 0.1, 3]} />
      </RigidBody>
      {shards.map((s, i) => (
        <RigidBody
          key={`shard-${i}`}
          colliders="cuboid"
          mass={0.15}
          position={[0, 0, 0]}
          linearDamping={0.3}
          angularDamping={0.4}
          ref={(api) => { shardApis.current[i] = api; }}
        >
          <mesh>
            <boxGeometry args={[0.18, 0.06, 0.06]} />
            <meshStandardMaterial
              color={s.color}
              emissive={s.color}
              emissiveIntensity={2.5}
              roughness={0.1}
              metalness={0.2}
            />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}
