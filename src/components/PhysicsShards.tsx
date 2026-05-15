'use client';

import { useRef, useMemo, useEffect } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

const SHARD_COUNT = 12;

export function PhysicsShards() {
  const shardApis = useRef<any[]>([]);

  const shards = useMemo(
    () =>
      Array.from({ length: SHARD_COUNT }).map((_, i) => ({
        id: i,
        color: new THREE.Color().setHSL(0.1 + Math.random() * 0.15, 1, 0.5 + Math.random() * 0.5),
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
            x: Math.cos(angle) * 2 + (Math.random() - 0.5) * 2,
            y: 3 + Math.random() * 3,
            z: Math.sin(angle) * 2 + (Math.random() - 0.5) * 2,
          },
          true
        );
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Invisible floor */}
      <RigidBody type="fixed" position={[0, -1.5, 0]}>
        <CuboidCollider args={[3, 0.1, 3]} />
      </RigidBody>
      {shards.map((s, i) => (
        <RigidBody
          key={`shard-${i}`}
          colliders="cuboid"
          mass={0.2}
          position={[0, 0, 0]}
          linearDamping={0.4}
          angularDamping={0.5}
          ref={(api) => { shardApis.current[i] = api; }}
        >
          <mesh>
            <boxGeometry args={[0.15, 0.05, 0.05]} />
            <meshStandardMaterial
              color={s.color}
              emissive={s.color}
              emissiveIntensity={2}
              roughness={0.2}
              metalness={0.3}
            />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}
