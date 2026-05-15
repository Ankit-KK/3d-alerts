'use client';

import { useRef, Suspense } from 'react';
import { HolographicPanel } from './HolographicPanel';
import { EnergyFragments } from './EnergyFragments';
import { CinematicText } from './CinematicText';
import { useDonationTimeline } from '@/hooks/useDonationTimeline';
import { useDonationStore } from '@/store/useDonationStore';
import * as THREE from 'three';

export function DonationAlertScene() {
  const panelRef = useRef<THREE.Mesh>(null);
  const nameRef = useRef<THREE.Group>(null);
  const amountRef = useRef<THREE.Group>(null);
  const messageRef = useRef<THREE.Mesh>(null);
  const activeAlert = useDonationStore((s) => s.activeAlert);

  useDonationTimeline({
    panelRef,
    nameRef,
    amountRef,
    messageRef,
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 1, 2]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, -0.5, -1]} intensity={0.8} color="#0077ff" />
      <HolographicPanel ref={panelRef} />
      <Suspense fallback={null}>
        <CinematicText
          nameRef={nameRef}
          amountRef={amountRef}
          messageRef={messageRef}
        />
      </Suspense>
      {activeAlert && <EnergyFragments key={activeAlert.id} />}
    </>
  );
}
