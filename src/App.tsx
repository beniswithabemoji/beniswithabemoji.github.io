import MainCanvas from "./Components/MainCanvas.tsx";
import Socials from "./Components/Socials.tsx";
import DarkModeToggle from "./Components/DarkModeToggle.tsx";
import Header from "./Components/Header.tsx";
import ContentButton from "./Components/ContentButton.tsx";
import {useState} from "react";

export interface ITheme{
    themeCallback:({theme}:{theme:string}) => void;
}
function App() {
    const [showStats, setShowStats] = useState<boolean>(false);
    const [darkMix, setDarkMix] = useState(0.0);

    function themeCallback({theme}: {theme: string }) {
        setDarkMix(theme === 'dark' ? 0.0 : 1.0);
    }
    return (
        <div className="flex flex-col justify-center w-full text-black dark:text-white">
            <div className={"w-full h-dvh overflow-clip dark:bg-[#242424] bg-white"}>
                <div className={"absolute overflow-clip z-10 h-full w-full"}>
                    <div className={"flex flex-col h-dvh"}>
                        <div className={"pl-12 pr-12 flex-shrink max-h-16 flex justify-between"}>
                            <Socials/>
                            <DarkModeToggle themeCallback={themeCallback}/>
                        </div>
                        <div className={"pl-12 pr-12 flex-grow"}>
                            <Header/>
                        </div>
                        <div className={"pl-12 flex-shrink max-h-12"}>
                            <ContentButton text={"Show Stats"} clickEvent={() => setShowStats(!showStats)}
                                           isGrey={true}/>
                        </div>
                    </div>
                </div>
                <MainCanvas showStats={showStats} darkMix={darkMix}/>
            </div>
        </div>
    )
}

export default App
