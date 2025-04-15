import { useEffect, useState } from "react"
import Logo from "../../../../public/icons/logo.svg"
import Users from "../../../../public/icons/users.svg"
import Image from "next/image"
import { useInterfaceContext } from "@/Context/InterfaceContext"

const Header = ({triggerOuterHeader}) => {

    const [triggerOuterState,setTriggetOuterState] = useState(0);
    const {serverData,headerChannelName} = useInterfaceContext();

    useEffect(() => {
        if(triggerOuterState != 0){
            triggerOuterHeader(triggerOuterState);
        }
    }, [triggerOuterState])

    return(
        <>
            <div className="flex justify-between items-center bg-theme-gray-1 p-2 z-20">
                <div className="flex items-center">
                    <Image src={Logo} alt="Logo" onClick={() => setTriggetOuterState(triggerOuterState + 1)} className="w-[50px]"/>
                    <div className="flex items-center ms-8 gap-4">
                        <p className="title-font-bold text-xl">{serverData[0].serverName}</p>
                        <p className="title-font-bold opacity-70"># {headerChannelName}</p>
                    </div>
                </div>
                <Image src={Users} alt="Users" className="w-[50px]"/>
            </div>
        </>
    )
}

export default Header