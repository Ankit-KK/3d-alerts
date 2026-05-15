'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useDonationStore } from '@/store/useDonationStore';
import * as THREE from 'three';

interface CinematicTextProps {
  nameRef?: React.RefObject<THREE.Group>;
  amountRef?: React.RefObject<THREE.Group>;
  messageRef?: React.RefObject<THREE.Mesh>;
}

const CinematicText = forwardRef<any, CinematicTextProps>(
  ({ nameRef, amountRef, messageRef }, ref) => {
    const activeAlert = useDonationStore((s) => s.activeAlert);
    if (!activeAlert) return null;

    const { donorName, amount, message, currency } = activeAlert;

    return (
      <group position={[0, 0.15, 0]}>
        {/* Donor name group – scale will be animated */}
        <group ref={nameRef}>
          <Text
            fontSize={0.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            position={[0, 0.6, 0]}
            outlineWidth={0.03}
            outlineColor="#000000"
          >
            {donorName}
          </Text>
        </group>

        {/* Amount group – scale animated */}
        <group ref={amountRef}>
          <Text
            fontSize={0.85}
            color="#ffd000"
            anchorX="center"
            anchorY="middle"
            position={[0, -0.05, 0]}
            outlineWidth={0.06}
            outlineColor="#000000"
          >
            {currency}{amount}
          </Text>
        </group>

        {/* Message (if any) */}
        {message && (
          <Text
            ref={messageRef}
            fontSize={0.25}
            color="#cccccc"
            anchorX="center"
            anchorY="middle"
            position={[0, -0.65, 0]}
          >
            {message}
          </Text>
        )}
      </group>
    );
  }
);

CinematicText.displayName = 'CinematicText';
export { CinematicText };
