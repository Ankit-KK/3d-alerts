'use client';

import { forwardRef, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalMatrix * normal;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    // Glow based on normal angle
    float glow = abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    glow = pow(glow, 2.0);
    // Pulse over time
    float pulse = sin(uTime * 5.0) * 0.2 + 0.8;
    // Combine
    vec3 color = mix(vec3(0.1, 0.4, 1.0), vec3(0.8, 0.9, 1.0), glow);
    float alpha = glow * pulse;
    gl_FragColor = vec4(color, alpha);
  }
`;

const EnergyCore = forwardRef<THREE.Mesh>((props, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.15, 0]} scale={[0.6, 0.6, 0.6]}>
      <icosahedronGeometry args={[0.7, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
});

EnergyCore.displayName = 'EnergyCore';
export { EnergyCore };
