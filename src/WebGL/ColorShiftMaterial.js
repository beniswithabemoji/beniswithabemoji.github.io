import * as THREE from "three";
import { useRef } from "react";
import { extend, Canvas, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import resolveLygia from "https://lygia.xyz/resolve.esm.js";
import { Vector2 } from "three";

const ColorShiftMaterial = shaderMaterial(
  {
    u_time: 0.0,
    u_resolution: new THREE.Vector2(600, 600),
    u_mouse: new Vector2(0, 0),
  },
  // vertex shader
  resolveLygia(`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `),
  // fragment shader
  resolveLygia(`
    
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#include "lygia/generative/fbm.glsl"
#include "lygia/distort/barrel.glsl"
#include "lygia/draw/rect.glsl"
#include "lygia/color/dither.glsl"
#include "lygia/math/mirror.glsl"

vec3 colorA=vec3(.149,.141,.912);
vec3 colorB=vec3(1.,.833,.224);

vec4 barr(vec4 col){
    vec2 pixel=.2/u_resolution.xy;
    vec2 st=gl_FragCoord.xy*pixel;
    
    vec3 color=vec3(0.,0.,0.);
    vec2 stw=barrel(st,1.1);
    
    st*=10.;
    st=fract(st-sin(u_time*.4));
    vec3 r=vec3(rect(vec2(st.y),.5));
    //r.y = sin(u_time);
    color=mix(color,r,.1);
    
    return vec4(color+col.rgb,1.);
}

vec4 dith(){
    vec4 color=vec4(vec3(0.),.1);
    float size=.1;
    vec2 pixel=size/u_resolution.xy;
    vec2 st=gl_FragCoord.xy*pixel;

    vec3 black=vec3(0,0,0);
    const float c0=32.;
    vec2 its=mix(vec2(0.),vec2(.1)/c0,st);
    
    color.rgb=mix(black,vec3(its.y),.5);
    
    color.rgb=mix(color.rgb,dither(color.rgb,.1),1.);
    
    // compress
    color.rgb=floor(color.rgb*255.)/255.;
    color.rgb*=c0;
    
    color+=barr(color);
    return color;
}

void main(){
    vec4 color=vec4(vec3(0.),1.);
    vec2 pixel=1./u_resolution.xy;
    vec2 st=gl_FragCoord.xy*pixel;
    
    float d3=fbm(vec3(st*1.,u_time*.2))*.2+.1;
    
    vec3 blue=vec3(0.,0.,0.);
    //color += mix(d2, d3, .9);
    
    //color+=vec4(blue,1.);
    
    //color+=vec4(vec3(d3),1.);
    color+=dith();
    color+=d3;
    
    gl_FragColor=color;
}

  `)
);

extend({ ColorShiftMaterial });

export { ColorShiftMaterial };
