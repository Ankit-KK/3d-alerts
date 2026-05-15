'use client';

import { forwardRef } from 'react';
import { Text } from '@react-three/drei';
import { useDonationStore } from '@/store/useDonationStore';
import * as THREE from 'three';

interface AlertTextProps {
  nameRef?: React.RefObject<THREE.Group>;
  amountRef?: React.RefObject<THREE.Group>;
  messageRef?: React.RefObject<THREE.Mesh>;
}

const AlertText = forwardRef<any, AlertTextProps>(
  ({ nameRef, amountRef, messageRef }, ref) => {
    const activeAlert = useDonationStore((s) => s.activeAlert);
    if (!activeAlert) return null;

    const { donorName, amount, message, currency } = activeAlert;

    return (
      <group position={[0, 0, 0]}>
        {/* Name */}
        <group ref={nameRef}>
          <Text
            fontSize={0.45}
            color="#ffffff"
            anchorX="center"
            anchorY="bottom"
            position={[0, 0.65, 0]}
            outlineWidth={0.04}
            outlineColor="#000000"
          >
            {donorName}
          </Text>
        </group>

        {/* Amount */}
        <group ref={amountRef}>
          <Text
            fontSize={0.75}
            color="#ffd000"
            anchorX="center"
            anchorY="top"
            position={[0, -0.15, 0]}
            outlineWidth={0.06}
            outlineColor="#000000"
          >
            {currency}{amount}
          </Text>
        </group>

        {/* Message */}
        {message && (
          <Text
            ref={messageRef}
            fontSize={0.22}
            color="#cccccc"
            anchorX="center"
            anchorY="top"
            position={[0, -0.75, 0]}
          >
            {message}
          </Text>
        )}
      </group>
    );
  }
);

AlertText.displayName = 'AlertText';
export { AlertText };
