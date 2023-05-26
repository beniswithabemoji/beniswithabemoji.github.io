const vertexShader = `
uniform float iTime;

varying float vZ;
varying vec2 vUv;
varying float vDisplacement;

void main() {
  vUv = uv;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  //modelPosition.x += cos(modelPosition.x * 2.0 + iTime * 1.0) * 0.1;
  
  vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;
        gl_Position = projectionPosition;
        vUv = uv;
    
}
`

export default vertexShader