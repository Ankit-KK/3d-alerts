export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  void main() {
    float scan = sin((vPosition.y + uTime * 0.8) * 15.0) * 0.5 + 0.5;
    float ring = 1.0 - abs(vUv.y - 0.5) * 2.0;
    ring = pow(ring, 2.5);
    vec3 color = mix(uColor1, uColor2, scan * ring);
    float alpha = ring * 0.9 * (0.5 + 0.5 * sin(uTime * 3.0 + vUv.x * 10.0));
    gl_FragColor = vec4(color, alpha);
  }
`;
