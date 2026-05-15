'use client';

import { forwardRef } from 'react';
import { Text } from '@react-three/drei';
import { useDonationStore } from '@/store/useDonationStore';
import * as THREE from 'three';

interface TextOverlayProps {
  nameRef?: React.RefObject<THREE.Mesh>;
  amountRef?: React.RefObject<THREE.Mesh>;
  messageRef?: React.RefObject<THREE.Mesh>;
}

const TextOverlay = forwardRef<any, TextOverlayProps>(
  ({ nameRef, amountRef, messageRef }, ref) => {
    const activeAlert = useDonationStore((s) => s.activeAlert);
    if (!activeAlert) return null;

    const { donorName, amount, message, currency } = activeAlert;

    return (
      <group position={[0, 0.2, 0]}>
        <Text
          ref={nameRef}
          fontSize={0.55}
          color="#ffb86c"
          anchorX="center"
          anchorY="middle"
          position={[0, 0.8, 0]}
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {donorName}
        </Text>
        <Text
          ref={amountRef}
          fontSize={0.8}
          color="#ffd000"
          anchorX="center"
          anchorY="middle"
          position={[0, 0.1, 0]}
          outlineWidth={0.04}
          outlineColor="#000000"
        >
          {currency}{amount}
        </Text>
        {message && (
          <Text
            ref={messageRef}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            position={[0, -0.4, 0]}
          >
            {message}
          </Text>
        )}
      </group>
    );
  }
);

TextOverlay.displayName = 'TextOverlay';
export { TextOverlay };
