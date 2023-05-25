const vertexShader = `
uniform float iTime;

varying float vZ;
varying vec2 vUv;
varying float vDisplacement;

void main() {
  vUv = uv;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  //modelPosition.x += cos(modelPosition.z * 2.0 + iTime * 2.0) * 0.1;
  
  vZ = modelPosition.x;
  
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
    
}
`

export default vertexShader