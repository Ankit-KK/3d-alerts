'use client';

import { useRef, Suspense } from 'react';
import { HolographicRing, HolographicRingHandle } from './HolographicRing';
import { PhysicsShards } from './PhysicsShards';
import { TextOverlay } from './TextOverlay';
import { useDonationTimeline } from '@/hooks/useDonationTimeline';
import { useDonationStore } from '@/store/useDonationStore';
import * as THREE from 'three';

export function DonationAlertScene() {
  const ringRef = useRef<HolographicRingHandle>(null);
  const nameRef = useRef<THREE.Mesh>(null);
  const amountRef = useRef<THREE.Mesh>(null);
  const messageRef = useRef<THREE.Mesh>(null);
  const activeAlert = useDonationStore((s) => s.activeAlert);

  const explodePhysics = () => {
    // PhysicsShards auto-explodes on mount via key
  };

  useDonationTimeline({
    ringRef,
    nameRef,
    amountRef,
    messageRef,
    explodePhysics,
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 1, 2]} intensity={1.5} color="#ff5500" />
      <HolographicRing ref={ringRef} />
      <Suspense fallback={null}>
        <TextOverlay
          nameRef={nameRef}
          amountRef={amountRef}
          messageRef={messageRef}
        />
      </Suspense>
      {activeAlert && <PhysicsShards key={activeAlert.id} />}
    </>
  );
}
