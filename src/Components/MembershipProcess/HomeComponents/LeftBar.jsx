import Annon from "../../../../public/icons/announcement.svg"
import Message from "../../../../public/icons/message.svg"
import Sound from "../../../../public/icons/headphone.svg"
import Settings from "../../../../public/icons/settings.svg"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useInterfaceContext } from "@/Context/InterfaceContext"
import { createClient } from "@supabase/supabase-js"
import {Accordion, AccordionItem} from "@heroui/accordion";

const LeftBar = () => {

    const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
    const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;
         
    const supabase = createClient(supabaseUrl, supabaseKey);
    const [messages, setMessages] = useState([]);


    const [sideBarActive,setSideBarActive] = useState(true);

    const {serverData,setArticleValue,setMessageHistory,setArticleLoading,setLastSelectedTextChannel} = useInterfaceContext();

    const [loading,setLoading] = useState(false);

    const [channelData,setChannelData] = useState([]);

    const getChannels = async (serverId) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("text_channels")
                .select("*")
                .eq("serverId", serverId);
    
            if (error) {
                console.log(error);
                return;
            }
    
            const groupedChannels = data.reduce((acc, channel) => {
                const { categoryName } = channel;
    
                if (!acc[categoryName]) {
                    acc[categoryName] = {
                        categoryName,
                        channels: []
                    };
                }
    
                acc[categoryName].channels.push({
                    id: channel.id, 
                    name: channel.textChannelName,
                    ...channel 
                });
    
                return acc;
            }, {});
    
            const formattedData = Object.values(groupedChannels);
            setChannelData(formattedData);
    
            console.log(formattedData);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchMessages = async (serverId,textChId) => {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("serverId", serverId)
            .eq("textChannelId", textChId)
            .order("created_at", { ascending: true }); // Eski mesajlar önce gelsin

        if (error) {
            console.log("Geçmiş mesajları çekerken hata:", error);
            return;
        }
        else{
            listenMessages(serverId,textChId);
            console.log(data);
            setArticleLoading(false);
            setMessageHistory(data); // İlk mesajları state'e yaz

        }

    };
    
    const listenMessages = async (serverId, textChId) => {
    
        supabase
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
                    setMessageHistory((prev) => [...prev, payload.new]); 
                }
            )
            .subscribe();
    };

    const startChat = (serverId,textChId) => {
        setLastSelectedTextChannel(textChId);
        setArticleLoading("true");
        setArticleValue("chat");
        fetchMessages(serverId,textChId);
    }

    useEffect(() => {
        if(sideBarActive){
            getChannels(serverData[0].id);
        }
    }, [sideBarActive])

  

    return(
        <>
            <div className="flex h-spec-screen bg-theme-gray-1">
                <div className="flex flex-col justify-between bg-theme-gray-1 h-spec-screen p-2"> 
                    <div className="flex flex-col gap-12 mt-12">
                        <Image src={Annon} alt="Announcement" className="w-[50px]"/>
                        <Image src={Message} alt="Message" onClick={() => setSideBarActive(!sideBarActive)} className="w-[50px]"/>
                        <Image src={Sound} alt="Sound" className="w-[50px]"/>
                    </div>
                    <Image src={Settings} alt="Settings" className="w-[50px]"/>
                </div>
                <div className={`bg-theme-gray-1 flex-col w-[300px] ${sideBarActive ? "flex" : "hidden"}`}>
                    <div className="flex flex-col gap-7 p-4 accordion-start">
                        <Accordion selectionMode="multiple">
                            {channelData.map((category) => (
                                <AccordionItem key={category.categoryName} aria-label={category.categoryName} className="transition-all text-lg text-font-bold duration-300 [&[data-state=open]_.icon]:rotate-180" title={category.categoryName}>
                                     <ul>
                                        {category.channels.map((channel) => (
                                            <li key={channel.id} className="text-font text-base cursor-pointer mt-2" onClick={() => startChat(serverData[0].id,channel.id)}>
                                                {channel.name}
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LeftBar