import Annon from "../../images/announcement.svg"
import Message from "../../images/message.svg"
import Sound from "../../images/headphone.svg"
import Settings from "../../images/settings.svg"
import Image from "next/image"

const LeftBar = () => {
    return(
        <>
            <div className="flex flex-col justify-between bg-theme-gray-1 h-spec-screen p-2"> 
                <div className="flex flex-col gap-12 mt-12">
                    <Image src={Annon} alt="Announcement" className="w-[50px]"/>
                    <Image src={Message} alt="Message" className="w-[50px]"/>
                    <Image src={Sound} alt="Sound" className="w-[50px]"/>
                </div>
                <Image src={Settings} alt="Settings" className="w-[50px]"/>
            </div>
        </>
    )
}

export default LeftBar