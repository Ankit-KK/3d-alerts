'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useDonationStore } from '@/store/useDonationStore';
import type { EmberRingHandle } from '@/components/EmberRing';
import { Howl } from 'howler';

const sounds = {
  intro: new Howl({ src: ['/audio/intro.mp3'], volume: 0.7 }),
  impact: new Howl({ src: ['/audio/impact.mp3'], volume: 0.8 }),
};

function playSound(key: keyof typeof sounds) {
  sounds[key]?.play();
}

interface TimelineTargets {
  ringRef: React.RefObject<EmberRingHandle>;
  nameRef: React.RefObject<THREE.Mesh>;
  amountRef: React.RefObject<THREE.Mesh>;
  messageRef: React.RefObject<THREE.Mesh>;
  explodePhysics: () => void;
}

export function useDonationTimeline(targets: TimelineTargets) {
  const activeAlert = useDonationStore((s) => s.activeAlert);
  const setActiveAlert = useDonationStore((s) => s.setActiveAlert);
  const processQueue = useDonationStore((s) => s.processQueue);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (!activeAlert) return;

    tlRef.current?.kill();
    const tl = gsap.timeline({
      onComplete: () => outro(),
    });
    tlRef.current = tl;

    const ring = targets.ringRef.current;

    tl.call(() => playSound('intro'), undefined, 0);

    if (ring) {
      tl.to(ring.mesh!.scale, { x: 1, y: 1, z: 1, duration: 0.6, ease: 'back.out(1.7)' }, 0);
      // Fire color transition
      const c1 = { r: 1, g: 0.2, b: 0 };
      tl.to(c1, { r: 1, g: 0.5, b: 0, duration: 0.8, onUpdate: () => {
        if (ring.material) ring.material.uniforms.uColor1.value.setRGB(c1.r, c1.g, c1.b);
      }}, 0);
      const c2 = { r: 1, g: 0.7, b: 0 };
      tl.to(c2, { r: 1, g: 0.9, b: 0.1, duration: 0.8, onUpdate: () => {
        if (ring.material) ring.material.uniforms.uColor2.value.setRGB(c2.r, c2.g, c2.b);
      }}, 0);
    }

    // Text scale animations
    if (targets.nameRef.current) {
      tl.fromTo(targets.nameRef.current.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 0.7, ease: 'elastic.out(1, 0.4)' }, '-=0.5');
    }
    if (targets.amountRef.current) {
      tl.fromTo(targets.amountRef.current.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 0.5, ease: 'back.out(2.5)' }, '-=0.2');
    }

    // Physics explosion + sound
    tl.call(() => {
      targets.explodePhysics();
      playSound('impact');
    }, undefined, '+=0.1');

    // Camera shake
    const shake = { x: 0, y: 0, z: 0 };
    tl.to(shake, {
      x: 0.015, y: 0.015, z: 0.005,
      duration: 0.1, yoyo: true, repeat: 5,
      ease: 'power1.inOut',
      onUpdate: () => {
        camera.rotation.x = shake.x;
        camera.rotation.y = shake.y;
        camera.rotation.z = shake.z;
      }
    }, '-=0.1');
    tl.to(camera.rotation, { x: 0, y: 0, z: 0, duration: 0.3, ease: 'power2.out' }, '+=0.1');

    // Hold
    tl.to({}, { duration: 2.5 });

    // Outro
    const outro = () => {
      const outroTl = gsap.timeline({
        onComplete: () => {
          setActiveAlert(null);
          processQueue();
        },
      });
      outroTl.to(camera.position, { z: 8, duration: 1.5, ease: 'power3.in' }, 0);
      if (ring) outroTl.to(ring.mesh!.scale, { x: 0, y: 0, z: 0, duration: 0.8, ease: 'back.in(2)' }, 0);
      [targets.nameRef, targets.amountRef, targets.messageRef].forEach(ref => {
        if (ref.current) {
          outroTl.to(ref.current.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: 'power2.in' }, 0.2);
        }
      });
    };

    return () => { tl.kill(); };
  }, [activeAlert]); // eslint-disable-line
}
