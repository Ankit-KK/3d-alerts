'use client';

import { useRef, Suspense } from 'react';
import { EmberRing, EmberRingHandle } from './EmberRing';
import { EmberShards } from './EmberShards';
import { EmberText } from './EmberText';
import { SparkField } from './SparkField';
import { useDonationTimeline } from '@/hooks/useDonationTimeline';
import { useDonationStore } from '@/store/useDonationStore';
import * as THREE from 'three';

export function DonationAlertScene() {
  const ringRef = useRef<EmberRingHandle>(null);
  const nameRef = useRef<THREE.Mesh>(null);
  const amountRef = useRef<THREE.Mesh>(null);
  const messageRef = useRef<THREE.Mesh>(null);
  const activeAlert = useDonationStore((s) => s.activeAlert);

  const explodePhysics = () => {};

  useDonationTimeline({
    ringRef,
    nameRef,
    amountRef,
    messageRef,
    explodePhysics,
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 1, 2]} intensity={2} color="#ff5500" />
      <pointLight position={[-2, 0.5, -1]} intensity={1.5} color="#ff8800" />
      <EmberRing ref={ringRef} />
      <SparkField />
      <Suspense fallback={null}>
        <EmberText
          nameRef={nameRef}
          amountRef={amountRef}
          messageRef={messageRef}
        />
      </Suspense>
      {activeAlert && <EmberShards key={activeAlert.id} />}
    </>
  );
}
