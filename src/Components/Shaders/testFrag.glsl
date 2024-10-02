precision highp float;
uniform sampler2D grainTex;
uniform sampler2D blurTex;
uniform float time;
uniform float seed;
uniform vec3 back;
uniform float style;
uniform float param1;
uniform float param2;
uniform float param3;
varying vec2 vUv;

#define PI 3.141592653589793
//// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise//               https://github.com/stegu/webgl-noise//
vec3 mod289(vec3 x){
    return x-floor(x*(1./289.))*289.;
}
vec2 mod289(vec2 x){
    return x-floor(x*(1./289.))*289.;
}
vec3 permute(vec3 x){
    return mod289(((x*34.)+10.)*x);
}
float snoise(vec2 v){
    const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
    
    vec2 i=floor(v+dot(v,C.yy));
    
    vec2 x0=v-i+dot(i,C.xx);
    
    vec2 i1;
    
    i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
    
    vec4 x12=x0.xyxy+C.xxzz;
    x12.xy-=i1;
    i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
    vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
    m=m*m;
    m=m*m;
    vec3 x=2.*fract(p*C.www)-1.;
    vec3 h=abs(x)-.5;
    vec3 ox=floor(x+.5);
    vec3 a0=x-ox;
    m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
    vec3 g;
    g.x=a0.x*x0.x+h.x*x0.y;
    g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.*dot(m,g);
}
float snoise01(vec2 v){return(1.+snoise(v))*.5;
}
float noise2d(vec2 st){return snoise01(vec2(st.x+time*.02,st.y-time*.04+seed));
}
float pattern(vec2 p){vec2 q=vec2(noise2d(p+vec2(0.,0.)),noise2d(p+vec2(5.2,1.3)));
    vec2 r=vec2(noise2d(p+4.*q+vec2(1.7,9.2)),noise2d(p+4.*q+vec2(8.3,2.8)));
    return noise2d(p+1.*r);
}
void main(){vec2 uv=vUv;
    vec2 p=gl_FragCoord.xy;
    uv=style>0.?ceil(uv*50.)/50.:uv;
    // texture  vec3 grainColor = texture2D(grainTex, mod(p * param1 * 5.0, 1024.0) / 1024.0).rgb;
    float blurAlpha=texture2D(blurTex,uv).a;
    float gr=pow(grainColor.r*1.,1.5)+.5*(1.-blurAlpha);
    float gg=grainColor.g;
    float ax=param2*gr*cos(gg*2.*PI);
    float ay=param2*gr*sin(gg*2.*PI);
    // noise  float ndx = 1.0 * 1.0 * param3 + 0.1 * (1.0 - blurAlpha);
    float ndy=2.*1.*param3+.1*(1.-blurAlpha);
    float nx=uv.x*ndx+ax;
    float ny=uv.y*ndy+ay;
    float n=pattern(vec2(nx,ny));
    n=pow(n*1.05,6.);
    n=smoothstep(0.,1.,n);
    vec3 front=vec3(.5);
    vec3 result=mix(back,front,n);
    gl_FragColor=vec4(result,blurAlpha);
    // gl_FragColor = vec4(vec3(blurAlpha), 1.0);
}'

