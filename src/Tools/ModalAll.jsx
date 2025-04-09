import Image from "next/image"
import Close from "../../public/icons/closeServer.svg"
import Category from "../../public/icons/category.svg"
import TextChannel from "../../public/icons/textChannel.svg"

const ModalAll = ({process}) => {
    return(
        <>
            <div className="fixed h-screen w-full bg-dark-transparent flex justify-center items-center">
                <div className="bg-theme-gray-2 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                        <Image src={Close} className="w-[25px] h-[25px]" alt="Kapat"/>
                    </div>
                    {process == "createProcessLeftBar" ?
                    <>
                        <div className="flex items-center gap-3">
                            <div className="flex justify-center items-center p-3">
                                <Image src={Category} width={25} height={25} alt="Category"/>
                                <p className="">Yeni bir kategori oluştur</p>
                            </div>
                        </div>
                    </> : 
                    <></>}
                </div>
            </div>  
        </>
    )
}

export default ModalAll