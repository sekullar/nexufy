"use client";

import Image from "next/image"
import Close from "../../../../public/icons/closeServer.svg"
import { useUserContext } from "@/Context/UserContext"
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import LogSender  from "@/Tools/LogSender"
import Loading2 from "@/Tools/Loading2";
import { useInterfaceContext } from "@/Context/InterfaceContext";
import { useRouter } from "next/navigation";


const ServerSelect = ({serverSelectTriggerPar}) => {

    const {userData, user} = useUserContext();
    const [serverHave,setServerHave] = useState(false);
    const [searchTermInput,setSearchTermInput] = useState("");
    const [serverResult,setServerResult] = useState([]);

    const [noTermServer,setNoTermServer] = useState(false);

    const [logSenderTrigger,setLogSenderTrigger] = useState(0);
    const [logsErrorSender,setLogsErrorSender] = useState("");

    const [termResult,setTermResult] = useState([]);

    const [loadingJoin,setLoadingJoin] = useState(false);

    const [serverSelectTrigger,setServerSelectTrigger] = useState(0);

    const [loading,setLoading] = useState(true);

    const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
    const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;
     
    const supabase = createClient(supabaseUrl, supabaseKey);

    const {setServerData} = useInterfaceContext();

    const router = useRouter();
    
    const userMail = user?.email || ""; // Eğer user null ise, boş string ata

    useEffect(() => {
        getServer(); // Kullanıcı varsa sunucuları çek
    }, [user, userData]); // user değiştiğinde çalıştır

    useEffect(() => {
        serverSelectTriggerPar(serverSelectTrigger)
    }, [serverSelectTrigger])

    const getServer = async () => {
        setLoading(true);
        if(!userData[0].joinedServer || userData[0].joinedServer == null){
            setServerHave(false);
        }
        else{
            setServerHave(true);
            let joinedServers = userData[0].joinedServer;
            let serverIds = joinedServers.includes(",")? joinedServers.split(",").map(id => id.trim()) : [joinedServers];
            console.log(serverIds)
            try{
                if(joinedServers.includes(",")){
                    const {data,error} = await supabase
                    .from("servers")
                    .select("*")
                    .in("id", serverIds)
    
                    if(error){
                        console.log(error)  
                    }
                    if(data){
                        console.log(data)
                        setTermResult(data);
                    }
                }
                else{
                    const {data,error} = await supabase
                    .from("servers")
                    .select("*")
                    .eq("id", serverIds)
                    if(error){
                        console.log(error)  
                    }
                    if(data){
                        console.log(data)
                        setTermResult(data);
                    }
                }
                
            }
            catch(error){
                console.log(error);
            }
        }
        setLoading(false);
    }

    

    const JoinServer = async (serverId,idPar) => {
        console.log("runned",serverId,idPar)
        setLoadingJoin(true);
        try{
            const {data,error} = await supabase
            .from("users")
            .update({
                joinedServer: serverId
            })
            .eq("id",idPar)
            
            if(error){
                console.log(error)
            }
        }
        catch(error){
            console.log(error)
        }
    }

    const searchServers = async () => {
        setNoTermServer(false);
        if (!searchTermInput.trim()) {
            setNoTermServer(true);
            return;
        }
    
        try {
            const { data, error } = await supabase
                .from("servers")
                .select("*")
                .or(`serverName.ilike."%${searchTermInput}%",id.eq.${parseInt(searchTermInput) || 0}`);
    
            if (error) {
                console.error("Error fetching servers:", error);
                setNoTermServer(true);
            } else if (!data || data.length === 0) {
                console.log("Arama sonucu bulunamadı.");
                setNoTermServer(true);
            } else {
                console.log("Sonuçlar:", data);
                setTermResult(data);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setLogSenderTrigger(1);
            setLogsErrorSender(error);
        }
    };

    const lastSelectedServerIdUpdate = async (serverId,userId) => {
        try{
            const {data,error} = await supabase
            .from("users")
            .update({
                lastSelectedServerId: serverId
            })
            .eq("id",userId)
            if(error){
                console.log(error);
            }
            else{
                setServerSelectTrigger(serverSelectTrigger + 1);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    const getServerInfo = async (serverId) => {
        try{
            const {data,error} = await supabase
            .from("servers")
            .select("*")
            .eq("id",serverId) 

            if(error){
                console.log(error)
            }
            if(data){
                console.log(data);
                lastSelectedServerIdUpdate(serverId, userData[0].id);
                setServerData(data);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    return(
        <>
          <LogSender logs={logsErrorSender} mail={userMail} category={"searchServer"} triggerOpen={logSenderTrigger}/>
           
          <div className="bg-theme-gray-2 h-screen w-full p-5">
                <div className="flex justify-between items-center px-12">
                    <p className="title-font-bold text-4xl">Sunucu seç</p>
                    <Image src={Close} alt="Close" onClick={() => setServerSelectTrigger(serverSelectTrigger + 1)}  className="w-[55px]"/>
                </div>  
                {loading ? <div className="flex w-full h-spec-screen-2 items-center justify-center"><Loading2 /></div> :  <div className="flex mt-12">
                    {serverHave ? 
                    <>
                        <div className="flex flex-wrap overflow-auto w-3/4 px-12">
                            {termResult.map((server,key) => {
                                return(
                                    <div key={key}>
                                        <div className="flex items-center gap-3  rounded-lg w-[450px] mt-6">
                                            <div className="w-[70px] h-[70px] flex justify-center items-center rounded-full bg-theme-pink" onClick={() => getServerInfo(server.id)}>
                                                <Image width={50} height={50} src={server.serverImage} alt="Server Pıcture" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </> :
                    <>
                        <div className="flex flex-col px-12">
                            <p className="text-4xl title-font-bold mb-6">Henüz bir sunucuya girmemişsiniz!</p>
                            <div className="flex items-center">
                                <input type="text" className="bg-input outline-0 w-full p-4 rounded-lg text-font" onChange={(e) => setSearchTermInput(e.target.value)} placeholder="Sunucu ismi veya Sunucu ID'si ile ara"/>
                                <button className="bg-btn px-8 py-3 rounded-lg title-font-bold ms-5 outline-0" onClick={() => searchServers()}>Ara</button>
                            </div>
                            <div className="flex items-center flex-wrap gap-8">
                                {noTermServer ? 
                                <>
                                    <p className="text-lg mt-5 text-font opacity-70">Bu ID'ye veya isme sahip sunucu yok.</p>
                                </> : 
                                <>
                                    <div className="flex flex-wrap items-center">
                                        {termResult.map((server,key) => {
                                            return(
                                                <div key={key}>
                                                    <div className="flex items-center gap-3 bg-theme-gray-1 p-4 rounded-lg w-[450px] mt-6">
                                                        <div className="w-[70px] h-[70px] flex justify-center items-center rounded-full bg-theme-pink">
                                                            <Image width={50} height={50} src={server.serverImage} alt="Server Pıcture" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <p className="text-lg text-xl text-font-bold">{server.serverName}</p>
                                                            <p>{server.serverDesc}</p>
                                                        </div>
                                                        <button className="bg-theme-pink title-font-bold text-lg px-8 py-3 rounded-lg ms-auto outline-0" onClick={() => JoinServer(server.id,user.user.id)}>Katıl</button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </>}
                            </div>
                        </div>
                    </>}
                </div>}
               
          </div>
          
        </>
    )
}

export default ServerSelect