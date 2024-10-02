import {useMemo, useRef} from "react";
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";
import fragmentShader from "./Shaders/particleFrag.glsl?raw";
import vertexShader from "./Shaders/particleVert.glsl?raw";

export default function Particles({count,darkMix}: { count: number,darkMix: number }) {
    const radius = 10;
    const points = useRef(null);
    const itemSize = 3

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * itemSize);

        for (let i = 0; i < count; i++) {
            const distance = Math.sqrt(Math.random()) * radius;
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);

            const x = distance * Math.sin(theta) * Math.cos(phi)
            const y = distance * Math.sin(theta) * Math.sin(phi);
            const z = distance * Math.cos(theta);

            positions.set([x, y, z], i * itemSize);
        }

        return positions;
    }, [count]);

    const uniforms = useMemo(() => ({
        u_time: {
            value: 0.0
        },
        u_radius: {
            value: radius
        },
        u_primaryColor: {
            type: "c",
            value: new THREE.Color('rgb(0,255,211)')
        },
        u_secondaryColor: {
            type: "c",
            value: new THREE.Color('rgb(0,217,255)')
        },
        u_darkMix: {value: 0.0}
    }), [])
    useFrame((state) => {
        const {clock} = state;
        points.current.material.uniforms.u_time.value = clock.elapsedTime * .5;
        points.current.material.uniforms.u_darkMix.value = darkMix;

    });

    return (
        <>
            <points ref={points} position={[0, 0, 0]}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particlesPosition.length / itemSize}
                        array={particlesPosition}
                        itemSize={itemSize}
                    />
                </bufferGeometry>
                <shaderMaterial
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    fragmentShader={fragmentShader}
                    vertexShader={vertexShader}
                    uniforms={uniforms}
                />
            </points>

        </>
    );
}