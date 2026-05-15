'use client';

import { forwardRef, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uOpacity;
  uniform float uTime;

  void main() {
    // Ring shape
    float d = abs(length(vUv - 0.5) * 2.0 - 1.0);
    float ring = 1.0 - smoothstep(0.02, 0.1, d);
    float alpha = ring * uOpacity * (0.8 + 0.2 * sin(uTime * 10.0));
    vec3 color = vec3(0.2, 0.6, 1.0);
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

const ShockwaveRing = forwardRef<THREE.Mesh>((props, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, -0.2]} scale={[0.1, 0.1, 0.1]}>
      <torusGeometry args={[0.8, 0.04, 32, 100]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uOpacity: { value: 0 },
          uTime: { value: 0 },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
});

ShockwaveRing.displayName = 'ShockwaveRing';
export { ShockwaveRing };
