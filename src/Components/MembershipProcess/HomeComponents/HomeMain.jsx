"use client";

import Article from "./Article"
import Header from "./Header"
import LeftBar from "./LeftBar"
import { useUserContext } from "@/Context/UserContext";
import AddUsername from "./AddUsername";
import { useEffect, useState } from "react";
import ServerSelect from "./ServerSelect";
import { useRouter } from "next/navigation";
import Loading2 from "@/Tools/Loading2";
import { createClient } from "@supabase/supabase-js";
import { useInterfaceContext } from "@/Context/InterfaceContext";

const HomeMain = () => {

    const { userNew,userData,setUserNew} = useUserContext();

    const {setServerData,setArticleLoading,getBackUserNew} = useInterfaceContext();

    const [userLastSelectedServer,setUserLastSelectedServer] = useState([]);

    const [serverSelectModal,setServerSelectModal] = useState(true);
    
    const [triggerInner,setTriggerInner] = useState(0);
    const [triggerOuter,setTriggetOuter] = useState(0);

    const [loading,setLoading] = useState(true);

    const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
    const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;
         
    const supabase = createClient(supabaseUrl, supabaseKey);
    

    const router = useRouter();

    useEffect(() => {
        if(userData[0]?.lastSelectedServerId && userData[0]?.lastSelectedServerId != null){
            setUserLastSelectedServer(userData[0].lastSelectedServerId);
            setServerSelectModal(false);
        }
        else{
            setServerSelectModal(true);
        }
    }, [userData])

    useEffect(() => {
        if(triggerInner != 0){
            setServerSelectModal(false);
        }
    }, [triggerInner])

    useEffect(() => {
        if(triggerOuter != 0){
            setServerSelectModal(true)
        }
    }, [triggerOuter])

    useEffect(() => {
        if(getBackUserNew){
            setUserNew(false);
        }
    }, [getBackUserNew])

    
    useEffect(() => {
        console.log(userData)
        if(userData == "noAccess"){
            router.push("/")
        }
        else{
            if(userData[0]?.lastSelectedServerId){
                getServerInfo(userData[0]?.lastSelectedServerId);
            }
            else{
                router.push("/Home")
                setLoading(false)
            }
        }
    }, [])

    const getServerInfo = async (serverId) => {
        console.log(serverId)
        if(serverId){
            setLoading(true);
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
                    setServerData(data);
                    setLoading(false);
                    setArticleLoading(false);
                }
            }
            catch(error){
                console.log(error);
                setLoading(false);
            }
        }
        else{
            setLoading(false);
        }
    }

    return(
        <>
            {loading ? 
            <div className="flex h-screen w-full items-center justify-center">
                <Loading2 />
            </div> :  userNew ?
            <> 
                <AddUsername />
            </> : 
            <>
                {serverSelectModal ? <ServerSelect serverSelectTriggerPar={setTriggerInner}/> : 
                <>
                    <Header triggerOuterHeader={setTriggetOuter}/>
                    <div className="flex">
                        <LeftBar />
                        <Article />
                    </div>
                </>}
            </>}
        </>
    )
}

export default HomeMain