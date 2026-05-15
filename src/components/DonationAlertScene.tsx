'use client';

import { useRef, Suspense } from 'react';
import { EnergyCore } from './EnergyCore';
import { ShockwaveRing } from './ShockwaveRing';
import { EnergyFragments } from './EnergyFragments';
import { AlertText } from './AlertText';
import { useDonationTimeline } from '@/hooks/useDonationTimeline';
import { useDonationStore } from '@/store/useDonationStore';
import * as THREE from 'three';

export function DonationAlertScene() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const nameRef = useRef<THREE.Group>(null);
  const amountRef = useRef<THREE.Group>(null);
  const messageRef = useRef<THREE.Mesh>(null);
  const activeAlert = useDonationStore((s) => s.activeAlert);

  useDonationTimeline({
    coreRef,
    ringRef,
    nameRef,
    amountRef,
    messageRef,
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 1, 2]} intensity={1.8} color="#ffffff" />
      <pointLight position={[0, -0.8, -1]} intensity={0.6} color="#0088ff" />
      <EnergyCore ref={coreRef} />
      <ShockwaveRing ref={ringRef} />
      <Suspense fallback={null}>
        <AlertText
          nameRef={nameRef}
          amountRef={amountRef}
          messageRef={messageRef}
        />
      </Suspense>
      {activeAlert && <EnergyFragments key={activeAlert.id} />}
    </>
  );
}
