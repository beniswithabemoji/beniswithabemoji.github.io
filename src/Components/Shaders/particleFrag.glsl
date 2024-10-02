varying float v_distance;
uniform vec3 u_primaryColor;
uniform vec3 u_secondaryColor;
uniform float u_darkMix;

void main(){
  vec3 color=vec3(.8902,.3412,.9608);
  float strength=distance(gl_PointCoord,vec2(.5));
  strength=1.-strength;
  strength=pow(strength,3.);
  if(u_darkMix>.1){
    color=vec3(0.,0.,0.);
  }
  color=mix(color,vec3(0.,1.,.8353),v_distance*.05);
  color=mix(vec3(0.),color,strength);
  
  gl_FragColor=vec4(color,strength);
}
