import React, {useEffect, useState} from "react";
import {ITheme} from "../App.tsx";

function DarkModeToggle({themeCallback}:ITheme) {
    const [currentTheme, setCurrentTheme] = useState<string>("")

    useEffect(() => {
        const localTheme = localStorage.getItem("color-theme");
        if (localTheme) {
            setCurrentTheme(localTheme);
        } else {
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setCurrentTheme(systemPrefersDark ? "dark" : "light");
        }
    }, []);
    useEffect(() => {
        if (currentTheme) {
            if (currentTheme === "dark") {
                document.documentElement.classList.add("dark");

            } else {
                document.documentElement.classList.remove("dark");
            }
            localStorage.setItem("color-theme", currentTheme);
            themeCallback({theme: currentTheme})
        }
    }, [currentTheme]);

    const toggleTheme = () => {
        setCurrentTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

    const LightThemeIcon = () => (
        <svg aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24">
            <path stroke="cyan" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>
        </svg>

    );

    const DarkThemeIcon = () => (
        <svg aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24">
            <path stroke="cyan" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 21a9 9 0 0 1-.5-17.986V3c-.354.966-.5 1.911-.5 3a9 9 0 0 0 9 9c.239 0 .254.018.488 0A9.004 9.004 0 0 1 12 21Z"/>
        </svg>

    );

    interface IThemeButton {
        clickEvent: (event: React.MouseEvent<HTMLButtonElement> | undefined) => void;
    }

    function ThemeButton({clickEvent}: IThemeButton) {
        return (
            <div className={"p-1 flex justify-end"}>
                <button
                    id='theme-toggle-light'
                    type='button'
                    onClick={clickEvent}
                    className='hover:bg-gray-700 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm'>
                    {currentTheme === 'dark' ? <LightThemeIcon/> : <DarkThemeIcon/>}
                </button>
            </div>
        );
    }

    return (
        <ThemeButton clickEvent={() => toggleTheme()}/>
    );
}

export default DarkModeToggle;
