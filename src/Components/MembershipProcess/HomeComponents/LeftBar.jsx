import Annon from "../../../../public/icons/announcement.svg"
import Message from "../../../../public/icons/message.svg"
import Sound from "../../../../public/icons/headphone.svg"
import Settings from "../../../../public/icons/settings.svg"
import Plus from "../../../../public/icons/plus.svg"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useInterfaceContext } from "@/Context/InterfaceContext"
import { createClient } from "@supabase/supabase-js"
import { Accordion, AccordionItem } from "@heroui/accordion"
import ModalAll from "@/Tools/ModalAll"
import Loading2 from "@/Tools/Loading2"
import Edit from "../../../../public/icons/edit3.svg"

const LeftBar = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
    const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;
    const supabase = createClient(supabaseUrl, supabaseKey);
    

    const [messages, setMessages] = useState([]);
    const [sideBarActive, setSideBarActive] = useState(false);
    const {serverData, setArticleValue, setMessageHistory, setArticleLoading, setLastSelectedTextChannel,setHeaderChannelName,setRoomIdGlobalForCall,setVoiceRoomName,leftBarRefreshState,setModalValueNames,setModalValueTrigger,setModalValueId,setLeftBarTrigger} = useInterfaceContext();
    const [loading, setLoading] = useState(false);
    const [channelData, setChannelData] = useState([]);
    const [createModal,setCreateModal] = useState(false);
    const [categoryData,setCategoryData] = useState([]);
    const [closeInner,setCloseInner] = useState(0);
    const [channelType,setChannelType] = useState("");
    const [channelLoading,setChannelLoading] = useState(false);
    const [modalType,setModalType] = useState("createProcessLeftBar")

    useEffect(() => {
        if(closeInner != 0){
            setCreateModal(false);
        }
    }, [closeInner])

    useEffect(() => {
        if(leftBarRefreshState != 0){
            if(channelType == "text"){
                getTextChannels(serverData[0].id)
            }
            else if(channelType == "sound"){
                getSoundChannels(serverData[0].id);
            }
        }
    }, [leftBarRefreshState])

    const getTextChannels = async (serverId) => {
        setChannelLoading(true);
        setLoading(true);
    
        try {
            const { data: channels, error: channelError } = await supabase
                .from("text_channels")
                .select("*")
                .eq("serverId", serverId);
    
            if (channelError) {
                console.log(channelError);
                setLoading(false);
                return;
            }
    
            const { data: categories, error: categoryError } = await supabase
                .from("category")
                .select("*")
                .eq("serverId", serverId);
    
            if (categoryError) {
                console.log(categoryError);
                setLoading(false);
                return;
            }
    
            const categoryMap = {};
            categories.forEach(cat => {
                categoryMap[String(cat.id)] = {
                    id: cat.id,
                    categoryName: cat.categoryName
                };
            });
    
            const grouped = {};
    
            Object.values(categoryMap).forEach(({ id, categoryName }) => {
                grouped[id] = {
                    id,
                    categoryName,
                    channels: []
                };
            });
    
            channels.forEach(channel => {
                const key = String(channel.categoryId);
                const categoryInfo = categoryMap[key] || { id: null, categoryName: "Bilinmeyen Kategori" };
    
                if (!grouped[categoryInfo.id || "unknown"]) {
                    grouped[categoryInfo.id || "unknown"] = {
                        id: categoryInfo.id,
                        categoryName: categoryInfo.categoryName,
                        channels: []
                    };
                }
    
                grouped[categoryInfo.id || "unknown"].channels.push(channel);
            });
    
            const formattedData = Object.values(grouped);
    
            console.log("formattedData:", formattedData);
            setChannelData(formattedData);
            setChannelLoading(false);
            setLoading(false);
    
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    
    
    const getSoundChannels = async (serverId) => {
        setChannelLoading(true)
        setLoading(true);
        try {
            const { data: channels, error: channelError } = await supabase
                .from("sound_channels")
                .select("*")
                .eq("serverId", serverId);
    
            if (channelError) {
                console.log(channelError);
                setLoading(false);
                return;
            }
    
            const { data: categories, error: categoryError } = await supabase
                .from("category")
                .select("*")
                .eq("serverId", serverId);
    
            if (categoryError) {
                console.log(categoryError);
                setLoading(false);
                return;
            }

            const categoryMap = {};
            categories.forEach(cat => {
                categoryMap[String(cat.id)] = cat.categoryName;
            });
    
            const grouped = {};
            Object.values(categoryMap).forEach(categoryName => {
                grouped[categoryName] = [];
            });
    
            channels.forEach(channel => {
                const key = String(channel.categoryId);
                const categoryName = categoryMap[key] || "Bilinmeyen Kategori";
    
                if (!grouped[categoryName]) {
                    grouped[categoryName] = [];
                }
    
                grouped[categoryName].push(channel);
            });
    
            const formattedData = Object.entries(grouped).map(([categoryName, channels]) => ({
                categoryName,
                channels
            }));
    
            console.log("formattedData:", formattedData);
            setChannelData(formattedData);
            setChannelLoading(false)
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const fetchMessages = async (serverId, textChId) => {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("serverId", serverId)
            .eq("textChannelId", textChId)
            .order("created_at", { ascending: true }); 

        if (error) {
            console.log("Geçmiş mesajları çekerken hata:", error);
            return;
        }
        setArticleLoading(false);
        setMessageHistory(data); 
    };

    const listenMessages = (serverId, textChId) => {
        const channel = supabase
            .channel(`messages`)
            .on(
                'postgres_changes',
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    match: { serverId: serverId, textChannelId: textChId }
                },
                (payload) => {
                    console.log('Yeni Mesaj:', payload.new);
                    setMessageHistory((prev) => {
                        if (!prev.find(msg => msg.id === payload.new.id)) {
                            return [...prev, payload.new];
                        }
                        return prev;
                    });
                }
            )
            .subscribe();

        return channel;
    };

    const startChat = (serverId, textChId) => {
        
        setLastSelectedTextChannel(textChId);
        setArticleLoading("true");
        setArticleValue("chat");
        fetchMessages(serverId, textChId);
    };

    const startSoundChat = () => {
        setArticleValue("sound")
    }

    const startCommunication = (serverId,textChId) => {
        if(channelType == "text"){
            startChat(serverId,textChId)
        }
        else if(channelType == "sound"){
            startSoundChat();
        }
    }

    useEffect(() => {
        if (sideBarActive) {
            if(channelType == "text"){
                getTextChannels(serverData[0].id);
            }
            else if(channelType == "sound"){
                getSoundChannels(serverData[0].id);
            }
        }
    }, [sideBarActive,channelType]);

    useEffect(() => {
        if (serverData.length > 0) {
            listenMessages(serverData[0].id, serverData[0].textChannelId);
        }
    }, [serverData]);

    const clickLeftBar = (process) => {
        if (channelType === process) {
            setSideBarActive(!sideBarActive);
        } else {
            setChannelType(process);
            setSideBarActive(true);
        }
    };
    

    return (
        <>  
        <div id="check">
            <ModalAll processPar={modalType} openTrigger={createModal} closeTrigger={setCloseInner}/>
            <div className="flex h-spec-screen bg-theme-gray-1">
                <div className="flex flex-col justify-between bg-theme-gray-1 h-spec-screen p-2 w-[65px]">
                    <div className="flex flex-col gap-12 mt-12">
                        <Image src={Annon} alt="Announcement" className="w-[50px]" />
                        <Image src={Message} alt="Message" onClick={() => clickLeftBar("text")} className="w-[50px]" />
                        <Image src={Sound} alt="Sound" onClick={() => clickLeftBar("sound")} className="w-[50px]" />
                    </div>
                    <Image src={Settings} alt="Settings" className="w-[50px]" />
                </div>
                <div id="check2" className={`bg-theme-gray-1  flex-col w-[350px] ${sideBarActive ? "flex" : "hidden"}`}>
                    <div className="flex flex-col gap-3 p-4 accordion-start">
                        <div className="flex justify-between border border-white opacity-70 px-3 py-1 rounded-xl cursor-pointer" onClick={() => {setModalType("createProcessLeftBar"); setCreateModal(!createModal); }}>
                            <p className="text-white title-font">Oluştur</p>
                            <Image src={Plus} width={20} height={20} alt="Plus"/>
                        </div>
                        {channelLoading ? 
                        <>
                            <div className="flex justify-center items-center h-full w-full">
                                <Loading2 />
                            </div>
                        </>:
                            <Accordion selectionMode="multiple">
                                {channelData.map((category) => (
                                    <AccordionItem 
                                        key={category.categoryName} 
                                        aria-label={category.categoryName} 
                                        className="transition-all text-lg text-font-bold duration-300 [&[data-state=open]_.icon]:rotate-180"
                                        title={
                                            <div className="flex items-center justify-between group w-full">
                                                <span>{category.categoryName}</span>
                                                <Image 
                                                    src={Edit} 
                                                    alt="Edit" 
                                                    className="w-[19px] h-[19px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                                    onClick={(e) => {e.stopPropagation(); setModalValueNames(category.categoryName); setModalValueId(category.id); setModalValueTrigger(Date.now()); setModalType("categoryEdit"); setCreateModal(!createModal);}}/>
                                            </div>}>
                                        <ul>
                                            {category.channels.map((channel) => (
                                                <li key={channel.id} className="group relative flex items-center justify-between text-font text-base cursor-pointer mt-2 px-2 py-1 hover:bg-theme-gray-3 rounded-md transition-all" onClick={() => {startCommunication(serverData[0].id, channel.id); setHeaderChannelName(channelType == "text" ? channel.textChannelName : channelType == "sound" ? channel.channelName : ""); setRoomIdGlobalForCall(channel.id); setVoiceRoomName(channelType == "text" ? channel.textChannelName : channelType == "sound" ? channel.channelName : ""); setLeftBarTrigger(Date.now());}}>
                                                    <span>
                                                        {channelType == "text" ? channel.textChannelName : channelType == "sound" ? channel.channelName : ""}
                                                    </span>
                                                    <Image src={Edit} alt="Edit"  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={(e) => {e.stopPropagation(); setModalType(channelType == "text" ? "textChannelEdit" : channelType == "sound" ? "soundChannelEdit" : ""); setCreateModal(!createModal);}}/>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        }
                    </div>
                </div>
            </div>
        </div>
            
        </>
    );
};

export default LeftBar;
