'use client';

import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useSearchParams } from 'next/navigation';
import { Vector2 } from 'three';

export function PostProcessingEffects() {
  const searchParams = useSearchParams();
  const lowPerf = searchParams.get('perf') === 'low';

  return (
    <EffectComposer>
      {!lowPerf ? (
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.2}
          radius={0.4}
          mipmapBlur
        />
      ) : (
        <></>
      )}
      <ChromaticAberration
        offset={new Vector2(0.002, 0.002)}
        radialModulation={false}
        modulationOffset={0.15}
      />
      <Vignette darkness={0.5} offset={0.3} />
    </EffectComposer>
  );
}
