
const fragmentShader = `
uniform vec2 iMouse;
uniform float iTime;
uniform vec2 iResolution;

uniform sampler2D u_colorChannel;

uniform vec3 u_colorA;
uniform vec3 u_colorB;
varying float vZ;

float random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
    (c - a)* u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 st = vec2(gl_FragCoord.xy / iResolution.xy);
    
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*iTime);
    q.y = fbm( st + vec2(0.5));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*iTime );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*iTime);

float f = fbm(st+r);

    color = mix(vec3(0.101961,0.619608,0.666667),
                vec3(0.666667,0.666667,0.498039),
                clamp((f*f)*4.0,0.0,0.2));

    color = mix(color,
                vec3(0,0,0.164706),
                clamp(length(q),0.0,0.2));

    color = mix(color,
                vec3(0.666667,1,1),
                clamp(length(r.x),0.0,0.2));
    //vec3 mapped = texture(u_colorChannel, p).xyz;
    //gl_FragColor = vec4(color, 0.1);
    
    gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color,0.1);
}
`;
const fragmentShader2 = `
uniform vec2 iMouse;
uniform float iTime;
uniform vec2 iResolution;

varying vec2 vUv;
varying float vDisplacement;

float random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    
    return -1.0 + 2.0 * fract( sin( dot( st.xy, vec2(12.9898,78.233) ) ) * 43758.5453123);
}
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( random2( i + vec2(0.0,0.0) ), 
                     random2( i + vec2(1.0,0.0) ), u.x),
                mix( random2( i + vec2(0.0,1.0) ), 
                     random2( i + vec2(1.0,1.0) ), u.x), u.y);
}
void main() {
      vec2 st = gl_FragCoord.xy/iResolution.xy;
    st.x *= iResolution.x/iResolution.y;
    vec3 color = vec3(0.0);

    vec2 pos = vec2(st*10.0);

    color = vec3( noise(pos)*.5+.5 );
    color += smoothstep(.15,.2,noise(st*10.)); // Black splatter
    color -= smoothstep(.35,.4,noise(st*10.));

    gl_FragColor = vec4(color,0.1);
}

`
const testFrag = `
precision highp float;
uniform sampler2D grainTex;
uniform sampler2D blurTex;
uniform float iTime;
uniform float seed;
uniform vec3 back;
uniform float param1;
uniform float param2;
uniform float param3;
varying vec2 vUv;

#define PI 3.141592653589793

//// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//
vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    vec2 mod289(vec2 x) 
    {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    vec3 permute(vec3 x) {
          return mod289(((x * 34.0) + 10.0) * x);
    }
    float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);  vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
          m = m * m;
          m = m * m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
          vec3 g;  g.x = a0.x * x0.x + h.x * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        float snoise01(vec2 v) {
              return (1.0 + snoise(v)) * 0.5;
            }
            
            float noise2d(vec2 st) {
                  return snoise01(vec2(st.x +iTime * 0.02, st.y -iTime * 0.04 + seed));
                }
                
                float pattern(vec2 p) {
                      vec2 q = vec2(noise2d(p + vec2(0.0, 0.0)), noise2d(p + vec2(5.2, 1.3)));
                      vec2 r = vec2(noise2d(p + 4.0 * q + vec2(1.7, 9.2)), noise2d(p + 4.0 * q + vec2(8.3, 2.8)));
                      return noise2d(p + 1.0 * r);
                    }
                    void main() {
                          vec2 uv = vUv;
                          vec2 p = gl_FragCoord.xy;
                          
                        // texture
                          vec3 grainColor = texture2D(grainTex, mod(p * param1 * 5.0, 1024.0) / 1024.0).rgb;
                          float blurAlpha = texture2D(blurTex, uv).a;
                          float gr = pow(grainColor.r * 1.0, 1.5) + 0.5 * (1.0 - blurAlpha);
                          float gg = grainColor.g;
                          float ax = param2 * gr * cos(gg * 2.0 * PI);
                          float ay = param2 * gr * sin(gg * 2.0 * PI);
                          // noise
                          float ndx = 1.0 * 1.0 * param3 + 0.1 * (1.0 - blurAlpha);
                          float ndy = 2.0 * 1.0 * param3 + 0.1 * (1.0 - blurAlpha);
                          float nx = uv.x * ndx + ax;
                          float ny = uv.y * ndy + ay;
                          float n = pattern(vec2(nx, ny));
                          n = pow(n * 1.05, 6.0);
                          n = smoothstep(0.0, 1.0, n);
                          vec3 front = vec3(0.1);
                          vec3 result = mix(back, front, n);
                          gl_FragColor = vec4(result, blurAlpha);
                          // gl_FragColor = vec4(vec3(blurAlpha), 1.0);
                        }
`
const fragOld = `
precision highp float;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;

uniform float time;
uniform vec3 colorStart;
uniform vec3 colorEnd;
varying vec2 vUv;

vec3 mod289(vec3 x)
{
    return x-floor(x*(1./289.))*289.;
}

vec4 mod289(vec4 x)
{
    return x-floor(x*(1./289.))*289.;
}

vec4 permute(vec4 x)
{
    return mod289(((x*34.)+1.)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159-.85373472095314*r;
}

vec3 fade(vec3 t){
    return t*t*t*(t*(t*6.-15.)+10.);
}

// Classic Perlin noise
float cnoise3(vec3 P)
{
    vec3 Pi0=floor(P);// Integer part for indexing
    vec3 Pi1=Pi0+vec3(1.);// Integer part + 1
    Pi0=mod289(Pi0);
    Pi1=mod289(Pi1);
    vec3 Pf0=fract(P);// Fractional part for interpolation
    vec3 Pf1=Pf0-vec3(1.);// Fractional part - 1.0
    vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
    vec4 iy=vec4(Pi0.yy,Pi1.yy);
    vec4 iz0=Pi0.zzzz;
    vec4 iz1=Pi1.zzzz;
    
    vec4 ixy=permute(permute(ix)+iy);
    vec4 ixy0=permute(ixy+iz0);
    vec4 ixy1=permute(ixy+iz1);
    
    vec4 gx0=ixy0*(1./7.);
    vec4 gy0=fract(floor(gx0)*(1./7.))-.5;
    gx0=fract(gx0);
    vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);
    vec4 sz0=step(gz0,vec4(0.));
    gx0-=sz0*(step(0.,gx0)-.5);
    gy0-=sz0*(step(0.,gy0)-.5);
    
    vec4 gx1=ixy1*(1./7.);
    vec4 gy1=fract(floor(gx1)*(1./7.))-.5;
    gx1=fract(gx1);
    vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);
    vec4 sz1=step(gz1,vec4(0.));
    gx1-=sz1*(step(0.,gx1)-.5);
    gy1-=sz1*(step(0.,gy1)-.5);
    
    vec3 g000=vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100=vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010=vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110=vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001=vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101=vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011=vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111=vec3(gx1.w,gy1.w,gz1.w);
    
    vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
    g000*=norm0.x;
    g010*=norm0.y;
    g100*=norm0.z;
    g110*=norm0.w;
    vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
    g001*=norm1.x;
    g011*=norm1.y;
    g101*=norm1.z;
    g111*=norm1.w;
    
    float n000=dot(g000,Pf0);
    float n100=dot(g100,vec3(Pf1.x,Pf0.yz));
    float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));
    float n110=dot(g110,vec3(Pf1.xy,Pf0.z));
    float n001=dot(g001,vec3(Pf0.xy,Pf1.z));
    float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
    float n011=dot(g011,vec3(Pf0.x,Pf1.yz));
    float n111=dot(g111,Pf1);
    
    vec3 fade_xyz=fade(Pf0);
    vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
    vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
    float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);
    return 2.2*n_xyz;
}

void main(){
    vec2 displacedUv=vUv+cnoise3(vec3(vUv*1.,iTime*.05));
    displacedUv*=10.;
    float strength=cnoise3(vec3(displacedUv*10.,iTime*.2));
    float outerGlow=distance(vUv,vec2(.8))*5.-.5;
    strength+=outerGlow;
    strength+=step(-.2,strength)*.6;
    strength=clamp(strength,0.,1.);
    vec3 color=mix(colorStart,colorEnd,strength);
    vec4 outPutColor=vec4(mix(colorStart,colorEnd,vec3(0,0,0),1.))
     gl_FragColor=outPutColor;
}
`
const fragNoise = `
// Author: @patriciogv
// Title: Simple Voronoi

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(.0);

    // Scale
    st *= 4.;

    // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float m_dist = 15.;  // minimum distance
    vec2 m_point;        // minimum point

    for (int j=-1; j<=1; j++ ) {
        for (int i=-1; i<=1; i++ ) {
            vec2 neighbor = vec2(float(i),float(j));
            vec2 point = random2(i_st + neighbor);
            point = 0.5 + 0.5*sin(u_time + 6.2831*point);
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);

            if( dist < m_dist ) {
                m_dist = dist;
                m_point = point;
            }
        }
    }

    // Assign a color using the closest point position
    color += dot(m_point,vec2(.01,.02));

    // Add distance field to closest point center
    // color.g = m_dist;

    // Show isolines
    //color -= abs(sin(40.0*m_dist))*0.07;

    // Draw cell center
    //color += 1.-step(.04, m_dist);

    // Draw grid
    //color.r += step(.98, f_st.x) + step(.98, f_st.y);

    gl_FragColor = vec4(color,0.1);
}

`
export {fragmentShader, fragOld, fragmentShader2, testFrag, fragNoise};
