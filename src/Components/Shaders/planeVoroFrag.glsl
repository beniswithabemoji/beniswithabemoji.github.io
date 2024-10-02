// Author: @patriciogv - 2015
// Title: Stippling

precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_darkMix;
varying vec2 vUv;
uniform float u_intensity;
varying float vDisplacement;

vec4 permute(vec4 x){
    return mod((34.*x+1.)*x,2892.);
}

vec2 cellular2x2(vec2 P){
    #define K.142857142857// 1/7
    #define K2.0714285714285// K/2
    #define jitter.01// jitter 1.0 makes F1 wrong more often
    vec2 Pi=mod(floor(P),289.);
    vec2 Pf=fract(P);
    vec4 Pfx=Pf.x+vec4(-.5,-1.5,-.5,-1.5);
    vec4 Pfy=Pf.y+vec4(-.5,-.5,-1.5,-1.5);
    vec4 p=permute(Pi.x+vec4(0.,1.,0.,1.));
    p=permute(p+Pi.y+vec4(0.,0.,1.,1.));
    vec4 ox=mod(p,7.)*K+K2;
    vec4 oy=mod(floor(p*K),7.)*K+K2;
    vec4 dx=Pfx+jitter*ox;
    vec4 dy=Pfy+jitter*oy;
    vec4 d=dx*dx+dy*dy;
    
    #if 0
    d.xy=min(d.xy,d.zw);
    d.x=min(d.x,d.y);
    return d.xx;
    #else
    d.xy=(d.x<d.y)?d.xy:d.yx;
    d.xz=(d.x<d.z)?d.xz:d.zx;
    d.xw=(d.x<d.w)?d.xw:d.wx;
    d.y=min(d.y,d.z);
    d.y=min(d.y,d.w);
    return sqrt(d.xy);
    #endif
}
vec3 createColor(vec2 st){
    vec2 F=cellular2x2(st*15.)-vec2(.45,1.);
    vec2 pos=st-.5;
    float a=dot(pos,pos)-u_time*.05;
    float n=step(abs(sin(a*3.1415*6.)),F.x*3.1);
    vec3 mainColor=vec3(n,n,n);
    //mainColor=mix(color,mainColor,cos(u_time)*sin(u_time));
    return mainColor;
}
void main(void){
    vec2 st=gl_FragCoord.xy/u_resolution.xy;
    st=(st-.5)*.75+.5;
    //float u_darkMix=.2;
    if(u_resolution.y>u_resolution.x){
        st.y*=u_resolution.y/u_resolution.x;
        st.y-=(u_resolution.y*.5-u_resolution.x*.5)/u_resolution.x;
    }else{
        st.x*=u_resolution.x/u_resolution.y;
        st.x-=(u_resolution.x*.5-u_resolution.y*.5)/u_resolution.y;
    }
    vec3 mainColor=createColor(st);
    vec3 additionalColor=vec3(0.,1.,1.);
    if(u_darkMix>.1){
        //mainColor=vec3(1.)-mainColor;
        additionalColor=vec3(0.,.1843,1.);
    }
    vec3 color=mainColor*additionalColor;
    //color.rbg+=vec3(0.0, 0.0, 0.0);
    color.rgb*=u_darkMix>.1?.61:1.;
    float alpha=color.b;
    gl_FragColor=vec4(color.rgb,alpha);
}
