import Logo from "../../images/logo.svg"
import Image from "next/image"

const ServiceUnavailable = () => {
    return(
        <>
            <div className="flex flex-col items-center justify-center h-screen w-full">
                <Image src={Logo} alt="Logo" className="w-[100px] mb-8"/>
                <p className="text-font-bold color-theme-pink text-2xl">Nexufy şu anda devre dışı bırakıldı. Daha sonra tekrar deneyin!</p>
                <button className="bg-btn w-[300px] text-center rounded-lg py-3 text-font-bold mt-7 cursor-pointer">Beklerken mini-oyun oynayın</button>
            </div>
        </>
    )
}

export default ServiceUnavailable