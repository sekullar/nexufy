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
import AddSoundImage from "../../public/icons/addSoundChannel.svg"
import {Select, SelectSection, SelectItem} from "@heroui/select";


const ModalAll = ({ processPar, openTrigger, closeTrigger, processOuter }) => {

    const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
    const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;
    
    const supabase = createClient(supabaseUrl,supabaseKey);

    const [closeState, setCloseState] = useState(0);

    const [logSenderTrigger,setLogSenderTrigger] = useState(0);
    const [logsErrorSender,setLogsErrorSender] = useState("");

    const [categoryName,setCategoryName] = useState("");
    const [channelName,setChannelName] = useState("");
    

    const {userData} = useUserContext();
    const {serverData,setLeftBarRefreshState,leftBarRefreshState,modalValueNames,modalValueTrigger,modalValueId} = useInterfaceContext();

    const [notificationMode,setNotificationMode] = useState("");
    const [notificationTrigger,setNotificationTrigger] = useState(0);

    const [processState,setProcessState] = useState("");

    const [categoryData,setCategoryData] = useState([{id:"loading",categoryName:"Yükleniyor..."}]);
    const [selectedCategory,setSelectedCategory] = useState("");
    const [newChannelName,setNewChannelName] = useState("");    

    useEffect(() => {
        console.log("checkbydefault",processState)
        if(processState == "textChannelEdit"){
            console.log("çalıştı oe", modalValueNames)
            setChannelName(modalValueNames)
        }
        else if(processState == "categoryEdit"){
            setCategoryName(modalValueNames)
        }
    }, [modalValueNames,modalValueTrigger,processState])
    
    useEffect(() => {
        setProcessState(processPar)
        processOuter(processPar)
    }, [processPar])

    useEffect(() => {
        if(processState == "createTextChannel" || processState == "createSoundChannel"){
            getCategory();
        }
        console.log("PROCCES", processState);
        processOuter(processState);
    }, [processState])

    useEffect(() => {
        console.log(categoryData)
    }, [categoryData])

    useEffect(() => {
        console.log(selectedCategory)
    }, [selectedCategory])

    useEffect(() => {
        setProcessState("createProcessLeftBar");
        closeTrigger(closeState)
        setNewChannelName("");
    }, [closeState])

    if (!openTrigger) return null;

    const getCategory = async () => {
        try{
            const {data,error} = await supabase
            .from("category")
            .select("*")
            .eq("serverId",serverData[0].id)

            if(error){
                console.log(error);
            }
            else{
                console.log(data)
                const categories = data.map((item) => ({
                    id: item.id,
                    categoryName: item.categoryName,
                }));
                setCategoryData(categories);
            }
        }
        catch(error){
            console.log(error);
        }
    }

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

    const updateCategory = async () => {
        try{
            const {data,error} = await supabase
            .from("category")
            .update({ categoryName: categoryName })
            .eq("id",modalValueId)

            if(error){
                console.log(error); 
            }
            else{
                setLeftBarRefreshState(leftBarRefreshState + 1)
                toast.success("Kategori kaydedildi");
                setCloseState(closeState + 1)
            }
        }
        catch(error){
            console.log(error);
        }
    } 

    const deleteCategory = async () => {
        try{
            const {data,error} = await supabase
            .from("category")
            .delete()
            .eq("id",modalValueId)

            if(error){
                console.log(error);
            }
            else{
                toast.success("Kategori silindi")
                setLeftBarRefreshState(leftBarRefreshState + 1)
                setCloseState(closeState + 1)
            }
        }
        catch(error){
            console.log(error);

        }
    }


    const createTextChannel = async () => {
        if(selectedCategory.id == "loading"){
            toast.error("Sakin ol şampiyon! Kanallar henüz yüklenmedi, kanalların yüklenmesini beklemelisin.")
        }
        else if(!selectedCategory){
            toast.error("Metin kanalları bir kategoriye bağlı olmak zorunda! Hiç değilse şimdilik.")
        }
        else if(newChannelName == ""){
            toast.error("Bir metin kanalı kuracaksın ve ismi olmayacak mı? Hmm... Bence bir isim koymalısın.")
        }
        else{
            toast.loading("Yükleniyor...")
        try{
            const {data,error} = await supabase
            .from("text_channels")
            .insert([{
                serverId: serverData[0].id,
                textChannelName: newChannelName,
                categoryId: selectedCategory
            }])

            if(error){
                console.log(error); 
                toast.dismiss();
                toast.error("Metin kanalı oluşturulmadı");
            }
            else{
                setCloseState(closeState + 1)
                setLeftBarRefreshState(leftBarRefreshState + 1)
                setProcessState("createProcessLeftBar")
                console.log(data);
                toast.dismiss();
                toast.success("Metin kanalı oluşturuldu!")
            }
        }
        catch(error){
            console.log(error);
        }
        }
    }

    const updateTextChannel = async () => {
        try{
            const {data,error} = await supabase
            .from("text_channels")
            .update({ textChannelName: channelName })
            .eq("id",modalValueId)

            if(error){
                console.log(error); 
            }
            else{
                setLeftBarRefreshState(leftBarRefreshState + 1)
                toast.success("Kategori kaydedildi");
                setCloseState(closeState + 1)
            }
        }
        catch(error){
            console.log(error);
        }
    } 

    const createSoundChannel = async () => {
        if(selectedCategory == "loading"){
            toast.error("Sakin ol şampiyon! Kanallar henüz yüklenmedi, kanalların yüklenmesini beklemelisin.")
        }
        else if(!selectedCategory){
            toast.error("Ses kanalları bir kategoriye bağlı olmak zorunda! Hiç değilse şimdilik.")
        }
        else if(newChannelName == ""){
            toast.error("Bir ses kanalı kuracaksın ve ismi olmayacak mı? Hmm... Bence bir isim koymalısın.")
        }
        else{
            toast.loading("Yükleniyor...")
        try{
            const {data,error} = await supabase
            .from("sound_channels")
            .insert([{
                serverId: serverData[0].id,
                channelName: newChannelName,
                categoryId: selectedCategory
            }])

            if(error){
                console.log(error); 
                toast.dismiss();
                toast.error("Ses kanalı oluşturulamadı");
            }
            else{
                setCloseState(closeState + 1)
                setLeftBarRefreshState(leftBarRefreshState + 1)
                setProcessState("createProcessLeftBar")
                console.log(data);
                toast.dismiss();
                toast.success("Ses kanalı oluşturuldu!")
            }
        }
        catch(error){
            console.log(error);
        }
        }
    }

    return createPortal(
        <div className="fixed inset-0 bg-dark-transparent flex justify-center items-center z-50">
            <SoundPlayer trigger={notificationTrigger} mode={notificationMode}/>
            <LogSender logs={logsErrorSender} mail={userData[0].email} category={"modal"} triggerOpen={logSenderTrigger}/>
            <div className="bg-theme-gray-2 p-4 rounded-xl flex flex-col">
                <div className="flex justify-between items-center mb-3">
                    <p className="invisible">a</p>
                    <Image src={Close} className="w-[35px] h-[35px] " alt="Kapat" onClick={() => {setCloseState(closeState + 1);}} />
                </div>
                {processState === "createProcessLeftBar" && (
                    <div className="flex items-center gap-3 mt-4 max-w-[744px] flex-wrap">
                        <div className="flex justify-center items-center p-4 flex-col border-2 opacity-70 rounded-xl w-[350px] transition-all duration-300 hover:opacity-100 cursor-pointer" onClick={() => setProcessState("createProcessCategory")}>
                            <Image src={Category} width={75} height={75} alt="Category" />
                            <p className="text-font mt-3">Yeni bir kategori oluştur</p>
                        </div>
                        <div className="flex justify-center items-center p-4 flex-col border-2 opacity-70 rounded-xl w-[350px] transition-all duration-300 hover:opacity-100 cursor-pointer" onClick={() => setProcessState("createTextChannel")}>
                            <Image src={TextChannel} width={75} height={75} alt="Text Channel" />
                            <p className="text-font mt-3">Yeni bir metin kanalı oluştur</p>
                        </div>
                        <div className="flex justify-center items-center p-4 flex-col border-2 opacity-70 rounded-xl w-[350px] transition-all duration-300 hover:opacity-100 cursor-pointer" onClick={() => setProcessState("createSoundChannel")}>
                            <Image src={AddSoundImage} width={75} height={75} alt="Text Channel" />
                            <p className="text-font mt-3">Yeni bir ses kanalı oluştur</p>
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
                {processState === "categoryEdit" && (
                    <>
                        <div className="flex flex-col">
                            <input type="text" value={categoryName} className="py-2 px-4 rounded-lg bg-theme-gray-3 outline-0 transition-all duration-300 focus:border-btn" onChange={(e) => setCategoryName(e.target.value)}/>
                            <button className="bg-btn rounded-lg py-2 px-8 title-font-bold mt-5 outline-0" onClick={() => updateCategory()}>Kaydet</button>
                            <button className="bg-red-600 hover:bg-red-700 tranistion-all duration-300 rounded-lg py-2 px-8 title-font-bold mt-3 outline-0" onClick={() => deleteCategory()}>Kategoriyi sil</button>
                        </div>
                    </>
                )}
                {processState === "textChannelEdit" && (
                    <>
                        <div className="flex flex-col">
                            <input type="text" value={channelName} className="py-2 px-4 rounded-lg bg-theme-gray-3 outline-0 transition-all duration-300 focus:border-btn" onChange={(e) => setChannelName(e.target.value)}/>
                            <button className="bg-btn rounded-lg py-2 px-8 title-font-bold mt-5 outline-0" onClick={() => updateTextChannel()}>Kaydet</button>
                            <button className="bg-red-600 hover:bg-red-700 tranistion-all duration-300 rounded-lg py-2 px-8 title-font-bold mt-3 outline-0" onClick={() => deleteCategory()}>Kanalı sil</button>
                        </div>
                    </>
                )}
                {processState === "createTextChannel" && (
                    <>
                        <div className="flex flex-col">
                            <div className="flex flex-col">
                                <p className="text-font mb-3">Metin kanalının ismi:</p>
                                <input type="text" value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)} className="px-4 py-2 bg-input rounded-lg outline-0" placeholder="Metin kanalının ismi"/>
                            </div>
                            <div className="flex flex-col mt-4 createTextChannelSelectBackground">
                                <p className="text-font mb-3">Metin kanalının kategorisi:</p>
                                <Select>
                                    {categoryData.map((item) => (
                                        <SelectItem key={item.id} value={item} onClick={() => setSelectedCategory(item.id)}>
                                        {item.categoryName}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <button className="mt-6 text-font-bold bg-btn rounded-lg text-lg py-2 outline-0" onClick={() => createTextChannel()}>Oluştur</button>
                        </div>
                    </>
                )}
                {processState === "createSoundChannel" && (
                    <>
                        <div className="flex flex-col">
                            <div className="flex flex-col">
                                <p className="text-font mb-3">Ses kanalının ismi:</p>
                                <input type="text" value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)} className="px-4 py-2 bg-input rounded-lg outline-0" placeholder="Ses kanalının ismi"/>
                            </div>
                            <div className="flex flex-col mt-4 createTextChannelSelectBackground">
                                <p className="text-font mb-3">Ses kanalının kategorisi:</p>
                                <Select>
                                    {categoryData.map((item) => (
                                        <SelectItem key={item.id} value={item} onClick={() => setSelectedCategory(item.id)}>
                                        {item.categoryName}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <button className="mt-6 text-font-bold bg-btn rounded-lg text-lg py-2 outline-0" onClick={() => createSoundChannel()}>Oluştur</button>
                        </div>
                    </>
                )}
            </div>
        </div>,
        typeof window !== "undefined" ? document.body : null // SSR check
    )
}

export default ModalAll



// CREATE SOUND CHANNEL FUNC KISMI HAFİF YARIM KALDI ŞU ANKİ HALİYLE ÇALIŞIR GİBİ TAHMİNİ