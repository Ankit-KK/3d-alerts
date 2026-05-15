'use client';

import { forwardRef, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
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
  uniform float uTime;

  void main() {
    // Subtle scanline animation
    float scan = sin(vUv.y * 50.0 + uTime * 2.0) * 0.15 + 0.85;
    // Edge glow
    float edge = max(1.0 - abs(vUv.x - 0.5) * 6.0, 0.0) * 0.5;
    edge += max(1.0 - abs(vUv.y - 0.5) * 6.0, 0.0) * 0.5;
    edge = clamp(edge, 0.0, 1.0);
    // Combine
    float alpha = 0.6 + edge * 0.4;
    alpha *= scan;
    vec3 color = mix(vec3(0.0, 0.8, 1.0), vec3(0.0, 0.4, 0.8), vUv.y);
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

const HolographicPanel = forwardRef<THREE.Mesh>((props, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  useEffect(() => {
    return () => {
      materialRef.current?.dispose();
      meshRef.current?.geometry.dispose();
    };
  }, []);

  // Forward the mesh ref so the timeline can access it
  useEffect(() => {
    if (typeof ref === 'function') {
      ref(meshRef.current);
    } else if (ref) {
      (ref as React.MutableRefObject<THREE.Mesh>).current = meshRef.current!;
    }
  }, [ref]);

  return (
    <mesh ref={meshRef} scale={[2.8, 1.8, 1]} position={[0, 0, -0.5]}>
      <planeGeometry args={[1, 1]} />
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

HolographicPanel.displayName = 'HolographicPanel';
export { HolographicPanel };
