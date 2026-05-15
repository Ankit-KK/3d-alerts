'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useDonationStore } from '@/store/useDonationStore';
import type { HolographicRingHandle } from '@/components/HolographicRing';
import { Howl } from 'howler';

const sounds = {
  intro: new Howl({ src: ['/audio/intro.mp3'], volume: 0.7 }),
  impact: new Howl({ src: ['/audio/impact.mp3'], volume: 0.8 }),
};

function playSound(key: keyof typeof sounds) {
  sounds[key]?.play();
}

interface TimelineTargets {
  ringRef: React.RefObject<HolographicRingHandle>;
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
      onComplete: () => {
        outro();
      },
    });
    tlRef.current = tl;

    const ring = targets.ringRef.current;

    // Intro sound
    tl.call(() => playSound('intro'), undefined, 0);

    // Ring appear
    if (ring) {
      tl.to(ring.mesh!.scale, { x: 1, y: 1, z: 1, duration: 0.6, ease: 'back.out(1.7)' }, 0);

      const color1Proxy = { r: 1, g: 0.4, b: 0 };
      tl.to(color1Proxy, {
        r: 1, g: 0.6, b: 0,
        duration: 0.8,
        onUpdate: () => {
          if (ring.material) ring.material.uniforms.uColor1.value.setRGB(color1Proxy.r, color1Proxy.g, color1Proxy.b);
        },
      }, 0);

      const color2Proxy = { r: 1, g: 0.8, b: 0 };
      tl.to(color2Proxy, {
        r: 1, g: 0.9, b: 0.2,
        duration: 0.8,
        onUpdate: () => {
          if (ring.material) ring.material.uniforms.uColor2.value.setRGB(color2Proxy.r, color2Proxy.g, color2Proxy.b);
        },
      }, 0);
    }

    // Text entrance
    if (targets.nameRef.current) {
      tl.fromTo(
        targets.nameRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)' },
        '-=0.8'
      );
    }
    if (targets.amountRef.current) {
      tl.fromTo(
        targets.amountRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 0.5, ease: 'back.out(2)' },
        '-=0.4'
      );
    }

    // Physics explosion & impact sound
    tl.call(() => {
      targets.explodePhysics();
      playSound('impact');
    }, undefined, '+=0.2');

    // Camera shake
    const shakeProps = { x: 0, y: 0, z: 0 };
    tl.to(shakeProps, {
      x: 0.01, y: 0.01, z: 0.005,
      duration: 0.08,
      yoyo: true,
      repeat: 5,
      ease: 'power1.inOut',
      onUpdate: () => {
        camera.rotation.x = shakeProps.x;
        camera.rotation.y = shakeProps.y;
        camera.rotation.z = shakeProps.z;
      },
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

    return () => {
      tl.kill();
    };
  }, [activeAlert]); // eslint-disable-line
}
