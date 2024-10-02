import {Canvas} from '@react-three/fiber'
import PlaneVoronoi from "./PlaneVoronoi.tsx";
import OrbitCamera from "./OrbitCamera.tsx";
import Particles from "./Particles.tsx";
import {Bloom, EffectComposer, ToneMapping} from "@react-three/postprocessing";
import {Stats} from '@react-three/drei'

export default function MainCanvas({showStats, darkMix}: { showStats: boolean, darkMix: number }) {

    return (
        <div className={"p-12 h-dvh w-full"}>
            <div className="border-2 border-blue-300 h-full flex flex-col p-0">
                <Canvas className={"absolute"}>
                    {showStats ? <Stats/> : <></>}
                    <ambientLight intensity={0.8}/>
                    <directionalLight color="blue" position={[1, 6, 5]} intensity={1.5}/>
                    <Particles count={1000} darkMix={darkMix}/>
                    <PlaneVoronoi darkMix={darkMix}/>
                    <OrbitCamera/>
                    <EffectComposer>
                        <Bloom luminanceThreshold={.4} mipmapBlur/>
                        <ToneMapping adaptive resolution={256} maxLuminance={7.0} averageLuminance={1.0}
                                     adaptationRate={1.0}/>
                    </EffectComposer>
                </Canvas>
            </div>
        </div>
    )
}
