'use client';

import { forwardRef } from 'react';
import { Text } from '@react-three/drei';
import { useDonationStore } from '@/store/useDonationStore';
import * as THREE from 'three';

interface EmberTextProps {
  nameRef?: React.RefObject<THREE.Mesh>;
  amountRef?: React.RefObject<THREE.Mesh>;
  messageRef?: React.RefObject<THREE.Mesh>;
}

const EmberText = forwardRef<any, EmberTextProps>(
  ({ nameRef, amountRef, messageRef }, ref) => {
    const activeAlert = useDonationStore((s) => s.activeAlert);
    if (!activeAlert) return null;

    const { donorName, amount, message, currency } = activeAlert;

    return (
      <group position={[0, 0.1, 0]}>
        {/* Background ember glow mesh behind text */}
        <mesh position={[0, 0.3, -0.05]} scale={[2.8, 1.4, 1]}>
          <planeGeometry />
          <meshBasicMaterial
            color="#ff4400"
            transparent
            opacity={0.15}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <Text
          ref={nameRef}
          fontSize={0.55}
          color="#ffb86c"
          anchorX="center"
          anchorY="middle"
          position={[0, 0.8, 0]}
          outlineWidth={0.03}
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
          position={[0, 0.15, 0]}
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {currency}{amount}
        </Text>
        {message && (
          <Text
            ref={messageRef}
            fontSize={0.28}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            position={[0, -0.45, 0]}
          >
            {message}
          </Text>
        )}
      </group>
    );
  }
);

EmberText.displayName = 'EmberText';
export { EmberText };
