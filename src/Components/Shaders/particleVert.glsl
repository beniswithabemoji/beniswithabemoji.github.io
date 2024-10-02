
uniform float u_radius;
uniform float u_time;

varying float v_distance;

mat3 rotation3dY(float angle){
  float s=sin(angle*.5);
  float c=cos(angle*.5);
  return mat3(
    c,0.,-s,
    0.,1.,0.,
    s,0.,c
  );
}

float rand(vec2 co){
  return fract(sin(dot(co,vec2(12.9898,78.233)))*43758.5453);
}

void main(){
  float distanceFactor=pow(u_radius-distance(position,vec3(0.)),1.5);
  float size=distanceFactor*10.+10.;
  vec3 particlePosition=position*rotation3dY(u_time*.01*distanceFactor);
  particlePosition.y*=.3;
  
  v_distance=distanceFactor;
  
  vec4 modelPosition=modelMatrix*vec4(particlePosition,1.);
  vec4 viewPosition=viewMatrix*modelPosition;
  vec4 projectedPosition=projectionMatrix*viewPosition;
  
  gl_Position=projectedPosition;
  
  gl_PointSize=size;
  // Size attenuation;
  gl_PointSize*=(1./-viewPosition.z)*.2;
}
