// Author: @patriciogv - 2015
// Title: Cracks

#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
uniform float u_time;
uniform float u_intensity;
varying float vDisplacement;

uniform vec3 u_color;

vec2 random2(vec2 p){
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

#define ANIMATE
vec3 voronoi(in vec2 x,float rnd){
    
    float adjust=.21;
    
    x.x*=adjust;
    x.y*=adjust;
    
    vec2 n=floor(x);
    vec2 f=fract(x);
    
    // first pass: regular voronoi
    vec2 mg,mr;
    float md=8.;
    for(int j=-1;j<=1;j++){
        for(int i=-1;i<=1;i++){
            vec2 g=vec2(float(i),float(j));
            vec2 o=random2(n+g)*rnd;
            #ifdef ANIMATE
            o=.5+.5*sin(u_time+6.2831*o);
            #endif
            vec2 r=g+o-f;
            float d=dot(r,r);
            
            if(d<md){
                md=d;
                mr=r;
                mg=g;
            }
        }
    }
    
    // second pass: distance to borders
    md=8.;
    for(int j=-2;j<=2;j++){
        for(int i=-2;i<=2;i++){
            vec2 g=mg+vec2(float(i),float(j));
            vec2 o=random2(n+g)*rnd;
            #ifdef ANIMATE
            o=.5+.5*sin(u_time+6.2831*o);
            #endif
            vec2 r=g+o-f;
            
            if(dot(mr-r,mr-r)>.00001)
            md=min(md,dot(1.9*(mr+r),normalize(r-mr)));
        }
    }
    return vec3(md,mr);
}

void main(){
    vec2 st=gl_FragCoord.xy/vUv.xy;
    st=(st-.5)*.75+.5;
    st*=.003;
    
    if(vUv.y>vUv.x){
        st.y*=vUv.y/vUv.x;
        //st.y-=(vUv.y*.5-vUv.x*.5)/vUv.x;
    }else{
        st.x*=vUv.x/vUv.y;
        st.x-=(vUv.x*.5-vUv.y*.5)/vUv.y;
    }
    vec3 color=vec3(0.,0.,0.);
    
    //float d=dot(st-5.5,st-5.5);
    float d=dot(st-5.5,st-5.5);
    vec3 c=voronoi(5.*st,pow(d,.1*sin(u_time)));
    
    //Add background color
    color=mix(vec3(1.),color,smoothstep(.021,.02,c.x));
    color*=u_color;
    //Add line color
    color+=mix(vec3(1.),color,smoothstep(.02,.02,c.x));
    float alpha=color.r;
    
    color*=vec3(0.,.5333,.7451);
    gl_FragColor=vec4(color,alpha);
}