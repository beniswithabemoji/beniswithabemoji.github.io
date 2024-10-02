import React from "react";

interface ButtonProps {
    clickEvent: (event: React.MouseEvent<HTMLButtonElement> | undefined) => void;
    text: string;
    isGrey?: boolean
}

export default function ContentButton({text, clickEvent, isGrey}: ButtonProps) {
    return (
        <>
            <button
                className={`hover:bg-cyan-300 border-2 border-blue-300 rounded-xl bg-blue-50 dark:bg-[#242424] pt-2 pb-2 pr-6 pl-6 ${(isGrey ? "opacity-15" : "")}`}
                onClick={clickEvent}>{text}</button>
        </>
    )
}