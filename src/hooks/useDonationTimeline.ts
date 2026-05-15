'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useDonationStore } from '@/store/useDonationStore';
import { Howl } from 'howler';

const sounds = {
  intro: new Howl({ src: ['/audio/intro.mp3'], volume: 0.7 }),
  impact: new Howl({ src: ['/audio/impact.mp3'], volume: 0.9 }),
};

function playSound(key: keyof typeof sounds) {
  sounds[key]?.play();
}

interface TimelineTargets {
  panelRef: React.RefObject<THREE.Mesh>;
  nameRef: React.RefObject<THREE.Group>;
  amountRef: React.RefObject<THREE.Group>;
  messageRef: React.RefObject<THREE.Mesh>;
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

    const panel = targets.panelRef.current;
    const nameGroup = targets.nameRef.current;
    const amountGroup = targets.amountRef.current;

    // 1. Screen distortion – bloom/chromatic aberration spike handled in postprocessing (we'll increase intensity via a dummy tween if needed, but simpler: just a visual pulse)
    // We'll animate panel opacity and scale for reveal
    tl.set(panel?.material, { opacity: 0 });
    tl.set(panel?.scale, { x: 0.8, y: 0.8, z: 0.8 });
    tl.set(nameGroup?.scale, { x: 0, y: 0, z: 0 });
    tl.set(amountGroup?.scale, { x: 0, y: 0, z: 0 });

    // Audio intro
    tl.call(() => playSound('intro'), undefined, 0);

    // Panel fades in and expands slightly
    if (panel) {
      tl.to(panel.material, { opacity: 0.8, duration: 0.4 }, 0);
      tl.to(panel.scale, { x: 1, y: 1, z: 1, duration: 0.6, ease: 'power2.out' }, 0);
    }

    // Camera push-in
    tl.to(camera.position, { z: 3.5, duration: 1.2, ease: 'power3.inOut' }, 0.2);

    // Name text appears – word-by-word or elastic scale? We'll animate scale of the group
    if (nameGroup) {
      tl.to(nameGroup.scale, { x: 1, y: 1, z: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)' }, '-=0.6');
    }

    // Amount slams – bigger scale and a tiny rotation for punch
    if (amountGroup) {
      tl.fromTo(amountGroup.scale, { x: 0, y: 0, z: 0 }, { x: 1.3, y: 1.3, z: 1.3, duration: 0.5, ease: 'back.out(2.5)' }, '-=0.3');
      tl.to(amountGroup.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: 'power2.out' }, '-=0.1');
    }

    // Impact sound and camera shake
    tl.call(() => playSound('impact'), undefined, '+=0.1');
    const shake = { x: 0, y: 0, z: 0 };
    tl.to(shake, {
      x: 0.02, y: 0.02, z: 0.01,
      duration: 0.12, yoyo: true, repeat: 4,
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
      outroTl.to(camera.position, { z: 6, duration: 1.5, ease: 'power3.in' }, 0);
      if (panel) {
        outroTl.to(panel.material, { opacity: 0, duration: 0.6 }, 0);
        outroTl.to(panel.scale, { x: 0.9, y: 0.9, z: 0.9, duration: 0.8 }, 0);
      }
      [nameGroup, amountGroup, targets.messageRef.current].forEach(ref => {
        if (ref) {
          outroTl.to(ref.scale, { x: 0, y: 0, z: 0, duration: 0.4, ease: 'power2.in' }, 0.2);
        }
      });
    };

    return () => { tl.kill(); };
  }, [activeAlert]); // eslint-disable-line
}
