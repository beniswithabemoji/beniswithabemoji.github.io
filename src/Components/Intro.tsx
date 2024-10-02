export default function Intro() {
    const darkToggleClass = "shadow-[#ffffff] dark:shadow-[#000000]"
    return (
        <>
            <div className={"flex flex-col font-mono flex-shrink"}>
                <div className={"flex-shrink p-4"}>
                    <h1 className={`dark:text-shadow-dark text-shadow-light ${darkToggleClass}`}>My name is </h1>
                    <h1 className={"font-bold underline indent-28"}><span className={`dark:text-shadow-dark text-shadow-light ${darkToggleClass}`}> Daniel </span></h1>
                    <p className={`text-xs dark:text-shadow-dark text-shadow-light ${darkToggleClass} `}>I made this</p>
                </div>
            </div>
        </>
    )
}
//flex flex-col font-mono flex-shrink dark:bg-[#242424] rounded-xl bg-opacity-80
//shadow-[#ffffff] dark:shadow-[#000000]
//shadow-[#000000] dark:shadow-[#ffffff]