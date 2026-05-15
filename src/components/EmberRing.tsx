'use client';

import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  void main() {
    float ring = 1.0 - abs(vUv.y - 0.5) * 2.0;
    ring = pow(ring, 2.0);
    float flicker = sin(vUv.x * 30.0 + uTime * 5.0) * 0.15 + 0.85;
    float scan = sin((vPosition.y + uTime * 0.7) * 18.0) * 0.5 + 0.5;
    vec3 color = mix(uColor1, uColor2, scan * ring);
    float alpha = ring * 0.95 * flicker * (0.6 + 0.4 * sin(uTime * 3.0 + vUv.x * 10.0));
    gl_FragColor = vec4(color, alpha);
  }
`;

export interface EmberRingHandle {
  mesh: THREE.Mesh | null;
  material: THREE.ShaderMaterial | null;
}

const EmberRing = forwardRef<EmberRingHandle>((props, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  useImperativeHandle(ref, () => ({
    mesh: meshRef.current,
    material: materialRef.current,
  }));

  useEffect(() => {
    return () => {
      materialRef.current?.dispose();
      meshRef.current?.geometry.dispose();
    };
  }, []);

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]} scale={[0, 0, 0]} position={[0, 0, -0.3]}>
      <torusGeometry args={[1.4, 0.1, 64, 120]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color('#ff5500') },
          uColor2: { value: new THREE.Color('#ffdd00') },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
});

EmberRing.displayName = 'EmberRing';
export { EmberRing };
