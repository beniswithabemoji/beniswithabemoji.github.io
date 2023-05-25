uniform float u_test;
varying vec2 vUv;

void main(){
    vec4 modelPosition=modelMatrix*vec4(position,1.);
    modelPosition.y+=sin(modelPosition.x*4.+u_time*2.)*.2;
    
    // Uncomment the code and hit the refresh button below for a more complex effect 🪄
    modelPosition.y+=sin(modelPosition.z*6.+u_time*2.)*.1;
    
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    
    gl_Position=projectedPosition;
}