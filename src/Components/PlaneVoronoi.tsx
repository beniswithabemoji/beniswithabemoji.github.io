import {useMemo, useRef} from "react";
import {useFrame} from "@react-three/fiber";
import planeFrag from "./Shaders/planeVoroFrag.glsl?raw";
import planeVert from "./Shaders/planeVoroVert.glsl?raw";
import * as THREE from 'three';

export default function PlaneVoronoi({darkMix}: { darkMix: number }) {
    const mesh = useRef(null);

    const uniforms = useMemo(
        () => ({
            u_time: {value: 0.0,},
            u_color: {
                type: "c",
                value: new THREE.Color('rgb(2,255,225)')
            },
            u_resolution: {value: new THREE.Vector2(1920 / 2, 1080 / 2)},
            u_darkMix: {type: THREE.FloatType,value: 0.0}
        }),
        []
    );

    useFrame((state, delta) => {
        const {clock} = state;
        mesh.current.material.uniforms.u_time.value = 0.4 * clock.getElapsedTime();
        mesh.current.rotateZ(delta * .06)
        mesh.current.material.uniforms.u_darkMix.value = darkMix;
    });

    return (
        <mesh
            ref={mesh}
            position={[0, 0, 0]}
            scale={1}
        >
            <planeGeometry args={[10, 10]}/>
            <shaderMaterial
                fragmentShader={planeFrag}
                vertexShader={planeVert}
                uniforms={uniforms}
                wireframe={false}
                side={THREE.FrontSide}
                transparent={true}
            />
        </mesh>
    );
}