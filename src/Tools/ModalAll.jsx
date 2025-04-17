import Image from "next/image"
import Close from "../../public/icons/closeServer.svg"
import Category from "../../public/icons/category.svg"
import TextChannel from "../../public/icons/textChannel.svg"
import { useEffect, useInsertionEffect, useState } from "react"
import { createPortal } from "react-dom"
import toast from "react-hot-toast"
import LogSender from "./LogSender"
import { useUserContext } from "@/Context/UserContext"
import SoundPlayer from "./SoundPlayer"
import { useInterfaceContext } from "@/Context/InterfaceContext"
import { createClient } from "@supabase/supabase-js"

const ModalAll = ({ processPar, openTrigger, closeTrigger }) => {

    const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
    const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;
    
    const supabase = createClient(supabaseUrl,supabaseKey);

    const [closeState, setCloseState] = useState(0);

    const [logSenderTrigger,setLogSenderTrigger] = useState(0);
    const [logsErrorSender,setLogsErrorSender] = useState("");

    const [categoryName,setCategoryName] = useState("");

    const {userData} = useUserContext();
    const {serverData,setLeftBarRefreshState,leftBarRefreshState} = useInterfaceContext();

    const [notificationMode,setNotificationMode] = useState("");
    const [notificationTrigger,setNotificationTrigger] = useState(0);

    const [processState,setProcessState] = useState("");

    
    
    useEffect(() => {
        setProcessState(processPar)
    }, [processPar])

    useEffect(() => {
        closeTrigger(closeState)
    }, [closeState])

    if (!openTrigger) return null;

    const createCategory = async (serverId,categoryName) => {
        if(categoryName == ""){
            toast.error("Kategori ismini boş bırakamazsın")
            setNotificationMode("error");
            setNotificationTrigger(notificationTrigger + 1)
        }
        else{
            toast.loading("Yükleniyor...")
            try{
                const {data,error} = await supabase
                .from("category")
                .insert([{
                    serverId,
                    categoryName
                }])
    
                if(error){
                    console.log(error)
                    toast.dismiss();
                    setLogSenderTrigger(logSenderTrigger + 1)
                    setLogsErrorSender(error);
                    setNotificationMode("error");
                    setNotificationTrigger(notificationTrigger + 1)
                    toast.error("Kategori oluşturulurken bir hata oluştu!")
                    setProcessState("createProcessLeftBar")

                }
                else{
                    console.log(data);
                    toast.dismiss();
                    toast.success("Başarıyla kategori oluşturdunuz!")
                    setCloseState(closeState + 1)
                    setCategoryName("");
                    setLeftBarRefreshState(leftBarRefreshState + 1  )
                    setProcessState("createProcessLeftBar")
                }
            }
            catch(error){
                    console.log(error)
                    toast.dismiss();
                    setLogSenderTrigger(logSenderTrigger + 1)
                    setLogsErrorSender(error);
                    setNotificationMode("error");
                    setNotificationTrigger(notificationTrigger + 1)
                    toast.error("Kategori oluşturulurken bir hata oluştu!");
                    setProcessState("createProcessLeftBar")
            }
        }
    }

    return createPortal(
        <div className="fixed inset-0 bg-dark-transparent flex justify-center items-center z-[9999]">
            <SoundPlayer trigger={notificationTrigger} mode={notificationMode}/>
            <LogSender logs={logsErrorSender} mail={userData[0].email} category={"modal"} triggerOpen={logSenderTrigger}/>
            <div className="bg-theme-gray-2 p-4 rounded-xl flex flex-col">
                <div className="flex justify-between items-center mb-3">
                    <p className="invisible">a</p>
                    <Image src={Close} className="w-[35px] h-[35px] " alt="Kapat" onClick={() => setCloseState(closeState + 1)} />
                </div>
                {processState === "createProcessLeftBar" && (
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex justify-center items-center p-4 flex-col border-2 opacity-70 rounded-xl w-[350px] transition-all duration-300 hover:opacity-100 cursor-pointer" onClick={() => setProcessState("createProcessCategory")}>
                            <Image src={Category} width={75} height={75} alt="Category" />
                            <p className="text-font mt-3">Yeni bir kategori oluştur</p>
                        </div>
                        <div className="flex justify-center items-center p-4 flex-col border-2 opacity-70 rounded-xl w-[350px] transition-all duration-300 hover:opacity-100 cursor-pointer">
                            <Image src={TextChannel} width={75} height={75} alt="Text Channel" />
                            <p className="text-font mt-3">Yeni bir sohbet kanalı oluştur</p>
                        </div>
                    </div>
                )}
                {processState === "createProcessCategory" && (
                    <>
                        <p className="text-center title-font-bold text-2xl text-white">Bir kategori ismi girin</p>
                        <input type="text" value={categoryName} className="px-3 py-1 rounded-lg bg-input outline-0 mt-3" onChange={(e) => setCategoryName(e.target.value)} placeholder="Kategori ismi"/>
                        <button className="py-2 text-font bg-btn mt-3 rounded-lg" onClick={() => createCategory(serverData[0].id,categoryName)}>Oluştur</button>
                    </>
                )}
            </div>
        </div>,
        typeof window !== "undefined" ? document.body : null // SSR check
    )
}

export default ModalAll
