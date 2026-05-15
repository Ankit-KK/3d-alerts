'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { useSearchParams } from 'next/navigation';
import { Perf } from 'r3f-perf';
import { DonationAlertScene } from '@/components/DonationAlertScene';
import { PostProcessingEffects } from '@/components/PostProcessingEffects';
import { useFakeWebSocket } from '@/hooks/useFakeWebSocket';

export default function Home() {
  useFakeWebSocket();
  const searchParams = useSearchParams();
  const showPerf = searchParams.get('debug') === '1';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        width: 400,
        height: 140,
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.8, 0]}>
            <DonationAlertScene />
          </Physics>
          <PostProcessingEffects />
          {process.env.NODE_ENV === 'development' && showPerf && <Perf position="top-left" />}
        </Suspense>
      </Canvas>
    </div>
  );
}
