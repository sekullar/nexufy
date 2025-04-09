import { useInterfaceContext } from "@/Context/InterfaceContext"
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Send from "../../../../public/icons/send.svg"
import User from "../../../../public/icons/user.svg"
import Loading2 from "@/Tools/Loading2";
import { useUserContext } from "@/Context/UserContext";
import { createClient } from "@supabase/supabase-js";

const Article = ({chatInner}) => {

    const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
    const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;
             
    const supabase = createClient(supabaseUrl, supabaseKey);

    const bottomRef = useRef(null);

    const {serverData,articleValue,messageHistory,articleLoading,lastSelectedTextChannel} = useInterfaceContext();
    const {userData} = useUserContext();

    const [messageVal,setMessageVal] = useState("");

    const SendMessage = async (messageContent,userId,serverId,textChannelId,senderName) => {
        try{
            const { data, error } = await supabase
            .from("messages")
            .insert([
                {
                    message: messageContent,
                    senderId: userId,
                    serverId: serverId,
                    textChannelId: textChannelId,
                    sender: senderName,
                    created_at: new Date().toISOString(), 
                }
            ]);

            if (error) {
                console.error("Mesaj gönderilemedi amk:", error);
            } else {
                console.log("Mesaj gönderildi:", data);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messageHistory]); 

      const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            e.preventDefault();
            if (!messageVal.trim()) return;
            const currentMessage = messageVal;
            setMessageVal("");
            SendMessage(currentMessage, userData[0].id, serverData[0].id, lastSelectedTextChannel, userData[0].username);
        }
    }
    

    return(
        <>
            {articleLoading ? 
            <div className="h-spec-screen bg-theme-gray-2 w-full flex justify-center items-center">
                <Loading2 />
            </div> : 
            <div className="h-spec-screen bg-theme-gray-2 w-full flex justify-center items-center">
                {articleValue == "starter" ? 
                <>
                    <div className="flex flex-col items-center">
                        <Image src={serverData[0].serverImage} width={100} height={100}  alt="Server Logo"/>
                        <p className="text-font opacity-80 text-2xl mt-10">{serverData[0].longText}</p>
                    </div>
                </> : ""}
                {articleValue == "chat" ? 
                <>
                    <div className="flex flex-col justify-between w-full">
                        <div className="h-spec-screen-3 p-5 overflow-auto">
                            {messageHistory && messageHistory.map((message,key) => {
                                return(
                                    <div  key={key} className="flex gap-3 mb-7">
                                        <div className="bg-black px-4 rounded-xl flex items-center">
                                            <Image width={25} height={25} className="" src={User} alt="User"/>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-lg title-font-bold">{message.sender}</p>
                                            <p>{message.message}</p>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={bottomRef}></div>  
                        </div>
                        <div className="flex items-center px-4">
                            <input type="text" value={messageVal} onKeyDown={handleKeyDown} onChange={(e) => setMessageVal(e.target.value)} className="bg-theme-gray-1 outline-0 px-8 p-4 text-font rounded-full w-full"  placeholder="Mesaj girin"/>
                            <button className="bg-btn flex items-center justify-center h-[56px] w-[86px] rounded-lg ms-4" onClick={() => { if (!messageVal.trim()) return; const currentMessage = messageVal; setMessageVal(""); SendMessage(currentMessage, userData[0].id, serverData[0].id, lastSelectedTextChannel, userData[0].username);}}>
                                <Image className="w-[35px]" src={Send} alt="Send button"/>
                            </button>
                        </div>
                    </div>
                </> : ""}
            </div> 
            }
           
        </>
    )
}

export default Article