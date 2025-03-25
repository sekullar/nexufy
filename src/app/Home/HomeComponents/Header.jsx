import Logo from "../../images/logo.svg"
import Users from "../../images/users.svg"
import Image from "next/image"

const Header = () => {
    return(
        <>
            <div className="flex justify-between items-center bg-theme-gray-1 p-2">
                <div className="flex items-center">
                    <Image src={Logo} alt="Logo" className="w-[50px]"/>
                    <div className="flex items-center ms-8 gap-4">
                        <p className="title-font-bold text-xl">Sunucu İsmi</p>
                        <p className="title-font-bold opacity-70"># Kanal bilgisi</p>
                    </div>
                </div>
                <Image src={Users} alt="Users" className="w-[50px]"/>
            </div>
        </>
    )
}

export default Header