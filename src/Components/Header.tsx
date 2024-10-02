import Intro from "./Intro.tsx";
import ContentButton from "./ContentButton.tsx";

export default function Header() {
    function OnClick(){

    }
    return (
        <div className={"flex justify-between h-full flex-col p-4"}>
            <div className={"justify-between flex"}>
                <Intro/>
                <div className={""}>
                    <ContentButton text={"Look"} clickEvent={OnClick}/>
                </div>
            </div>
            <div>
                <p className={"text-xs opacity-20"}>Don't look too hard please</p>
            </div>
        </div>
    )
}