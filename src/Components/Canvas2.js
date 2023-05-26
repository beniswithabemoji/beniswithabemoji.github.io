import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Color, MathUtils, Vector2 } from "three";
import { TextureLoader } from 'three/src/loaders/TextureLoader'

import { fragmentShader, fragmentShader2, fragNoise, fragOld, testFrag } from "../WebGL/Fragment";
import vertexShader from "../WebGL/Vertex";
import cat from "../assets/cat.jpg"

const Flag = () => {
    // This reference will give us direct access to the mesh
    const mesh = useRef();
    const mousePosition = useRef({ x: 0, y: 0 });
    const updateMousePosition = useCallback((e) => {
        mousePosition.current = { x: e.pageX, y: e.pageY };
    }, []);

    const colorMap = useLoader(TextureLoader, cat)
    const { viewport, camera } = useThree()
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, 0])

    const uniforms = useMemo(
        () => ({
            u_time: {
                value: 0.0,
            },
            iTime: {
                value: 0.0,
            },
            iResolution: {
                value: new Vector2(window.innerWidth, window.innerHeight)
            },
            iMouse: {
                value: new Vector2(0, 0)
            },
            u_colorA: { value: new Color("#9FBAF9") },
            u_colorB: { value: new Color("#FEB3D9") },
            u_colorChannel: {
                value: colorMap
            },
            u_intensity: {
                value: 0.3
            }

        }), []
    );

    const hover = useRef(false);
    useFrame((state) => {
        const { clock } = state;

        mesh.current.material.uniforms.iTime.value = clock.getElapsedTime();
        mesh.current.material.uniforms.iMouse.value = new Vector2(
            mousePosition.current.x,
            mousePosition.current.y
        );

    });
    useEffect(() => {
        window.addEventListener("mousemove", updateMousePosition, false);
        return () => {
            window.removeEventListener("mousemove", updateMousePosition, false);
        };
    }, [updateMousePosition]);

    return (
        <mesh ref={mesh} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[width, height, 1]}>
            <planeGeometry args={[1, 1, 16, 16]} />
            <meshStandardMaterial
                map={colorMap}
            />
            <shaderMaterial
                fragmentShader={testFrag}
                vertexShader={vertexShader}
                uniforms={uniforms}
                wireframe={false}
            />
        </mesh>
    );
};

const Sphere = () => {
    const mesh = useRef();
    const mousePosition = useRef({ x: 0, y: 0 });
    const updateMousePosition = useCallback((e) => {
        mousePosition.current = { x: e.pageX, y: e.pageY };
    }, []);

    const colorMap = useLoader(TextureLoader, cat)
    const { viewport, camera } = useThree()
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, 0])

    const uniforms = useMemo(
        () => ({
            u_time: {
                value: 0.0,
            },
            iTime: {
                value: 0.0,
            },
            iResolution: {
                value: new Vector2(window.innerWidth, window.innerHeight)
            },
            iMouse: {
                value: new Vector2(0, 0)
            },
            u_colorA: { value: new Color("#9FBAF9") },
            u_colorB: { value: new Color("#FEB3D9") },
            u_colorChannel: {
                value: colorMap
            },
            u_intensity: {
                value: 0.3
            }

        }), [colorMap]
    );
    useEffect(() => {
        window.addEventListener("mousemove", updateMousePosition, false);
        return () => {
            window.removeEventListener("mousemove", updateMousePosition, false);
        };
    }, [updateMousePosition]);
    useFrame((state) => {
        const { clock } = state;

        mesh.current.material.uniforms.iTime.value = clock.getElapsedTime();
        mesh.current.material.uniforms.iMouse.value = new Vector2(
            mousePosition.current.x,
            mousePosition.current.y
        );

    });
    const hover = useRef(false);
    return (
        <mesh ref={mesh} position={[-2, 0, 0]} >
            <sphereGeometry args={[3, 20, 20]} />
            <meshStandardMaterial />
            <shaderMaterial
                fragmentShader={fragNoise}
                vertexShader={vertexShader}
                uniforms={uniforms}
                wireframe={true}
            />
        </mesh>
    );
};

// const Scene = () => {
//     return (
//
//     );
// };

export default function CanvasNew() {
    return (
        <div className='main-canvas z-10 absolute w-full h-full'>
            <Canvas camera={{ position: [0.0, 3.0, 1.0] }}>
                {/* <pointLight position={[15, 15, 15]} /> */}
                {/* <Flag /> */}
                <Sphere />
                <OrbitControls />
            </Canvas>
        </div>
    );
}
