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
    }vec3 permute(vec3 x) {
          return mod289(((x * 34.0) + 10.0) * x);
    }float snoise(vec2 v) {
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

vec3 palette(float d){
    return mix(vec3(0.2,0.7,0.9),vec3(1.,0.,1.),d);
}

vec2 rotate(vec2 p,float a){
    float c = cos(a);
    float s = sin(a);
    return p*mat2(c,s,-s,c);
}

float map(vec3 p){
    for( int i = 0; i<8; ++i){
        float t = iTime*0.2;
        p.xz =rotate(p.xz,t);
        p.xy =rotate(p.xy,t*1.89);
        p.xz = abs(p.xz);
        p.xz-=.5;
    }
    return dot(sign(p),p)/5.;
}

vec4 rm (vec3 ro, vec3 rd){
    float t = 0.;
    vec3 col = vec3(0.);
    float d;
    for(float i =0.; i<64.; i++){
        vec3 p = ro + rd*t;
        d = map(p)*.5;
        if(d<0.02){
            break;
        }
        if(d>100.){
            break;
        }
        //col+=vec3(0.6,0.8,0.8)/(400.*(d));
        col+=palette(length(p)*.1)/(400.*(d));
        t+=d;
    }
    return vec4(col,1./(d*100.));
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-(iResolution.xy/2.))/iResolution.x;
    vec3 ro = vec3(0.,0.,-50.);
    ro.xz = rotate(ro.xz,iTime);
    vec3 cf = normalize(-ro);
    vec3 cs = normalize(cross(cf,vec3(0.,1.,0.)));
    vec3 cu = normalize(cross(cf,cs));

    vec3 uuv = ro+cf*3. + uv.x*cs + uv.y*cu;

    vec3 rd = normalize(uuv-ro);

    vec4 col = rm(ro,rd);


    fragColor = col;
}

/** SHADERDATA
{
"title": "fractal pyramid",
"description": "",
"model": "car"
}
*/
void main(){
    mainImage(gl_FragColor,gl_FragCoord.xy);
}
`
const fragNoise = `

precision highp float;

uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;

vec3 hash33(vec3 p3)
{
	p3 = fract(p3 * vec3(.1031,.11369,.13787));
    p3 += dot(p3, p3.yxz+19.19);
    return -1.0 + 2.0 * fract(vec3(p3.x+p3.y, p3.x+p3.z, p3.y+p3.z)*p3.zyx);
}
float snoise3(vec3 p)
{
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;
    
    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
    
    vec3 e = step(vec3(0.0), d0 - d0.yzx);
	vec3 i1 = e * (1.0 - e.zxy);
	vec3 i2 = 1.0 - e.zxy * (1.0 - e);
    
    vec3 d1 = d0 - (i1 - K2);
    vec3 d2 = d0 - (i2 - K1);
    vec3 d3 = d0 - 0.5;
    
    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
    vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));
    
    return dot(vec4(31.316), n);
}

vec4 extractAlpha(vec3 colorIn)
{
    vec4 colorOut;
    float maxValue = min(max(max(colorIn.r, colorIn.g), colorIn.b), 1.0);
    if (maxValue > 1e-5)
    {
        colorOut.rgb = colorIn.rgb * (1.0 / maxValue);
        colorOut.a = maxValue;
    }
    else
    {
        colorOut = vec4(0.0);
    }
    return colorOut;
}

#define BG_COLOR (vec3(sin(iTime)*0.5+0.5) * 0.0 + vec3(0.0))
#define time iTime
const vec3 color1 = vec3(0.611765, 0.262745, 0.996078);
const vec3 color2 = vec3(0.298039, 0.760784, 0.913725);
const vec3 color3 = vec3(0.062745, 0.078431, 0.600000);
const float innerRadius = 0.6;
const float noiseScale = 0.65;

float light1(float intensity, float attenuation, float dist)
{
    return intensity / (1.0 + dist * attenuation);
}
float light2(float intensity, float attenuation, float dist)
{
    return intensity / (1.0 + dist * dist * attenuation);
}

void draw( out vec4 _FragColor, in vec2 vUv )
{
    vec2 uv = vUv;
    float ang = atan(uv.y, uv.x);
    float len = length(uv);
    float v0, v1, v2, v3, cl;
    float r0, d0, n0;
    float r, d;
    
    // ring
    n0 = snoise3( vec3(uv * noiseScale, time * 0.5) ) * 0.5 + 0.5;
    r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
    d0 = distance(uv, r0 / len * uv);
    v0 = light1(1.0, 10.0, d0);
    v0 *= smoothstep(r0 * 1.05, r0, len);
    cl = cos(ang + time * 2.0) * 0.5 + 0.5;
    
    // high light
    float a = time * -1.0;
    vec2 pos = vec2(cos(a), sin(a)) * r0;
    d = distance(uv, pos);
    v1 = light2(1.5, 5.0, d);
    v1 *= light1(1.0, 50.0 , d0);
    
    // back decay
    v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
    
    // hole
    v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
    
    // color
    vec3 c = mix(color1, color2, cl);
    vec3 col = mix(color1, color2, cl);
    col = mix(color3, col, v0);
    col = (col + v1) * v2 * v3;
    col.rgb = clamp(col.rgb, 0.0, 1.0);
    
    //gl_FragColor = extractAlpha(col);
    _FragColor = extractAlpha(col);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord*1.5-iResolution.xy)/iResolution.y;
    
    vec4 col;
    draw(col, uv);

    vec3 bg = BG_COLOR;

    fragColor.rgb = mix(bg, col.rgb, col.a); //normal blend
}

void main(){
    mainImage(gl_FragColor,gl_FragCoord.xy);
}
`
export {fragmentShader, fragOld, fragmentShader2, testFrag, fragNoise};
