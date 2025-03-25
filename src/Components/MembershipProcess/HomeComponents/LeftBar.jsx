import Annon from "../../../../public/icons/announcement.svg"
import Message from "../../../../public/icons/message.svg"
import Sound from "../../../../public/icons/headphone.svg"
import Settings from "../../../../public/icons/settings.svg"
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