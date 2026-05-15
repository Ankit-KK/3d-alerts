'use client';

import { Sparkles } from '@react-three/drei';

export function SparkField() {
  return (
    <Sparkles
      count={30}
      scale={[3, 2, 1]}
      size={1.5}
      speed={0.4}
      opacity={0.7}
      color="#ff9900"
    />
  );
}
