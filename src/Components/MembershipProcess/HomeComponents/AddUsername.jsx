"use client";

import AnimationPlayer from "@/Tools/AnimationPlayer";
import Loading2 from "@/Tools/Loading2";
import SoundPlayer from "@/Tools/SoundPlayer";
import LogSender from "@/Tools/LogSender";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useUserContext } from "@/Context/UserContext";

const AddUsername = () => {

    const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
    const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const [usernamePar,setUsernamePar] = useState("");
    const [loading,setLoading] = useState(false);
    const [usernameAlreadyHave,setUsernameAlreadyHave] = useState(false); 

    const [notificationMode,setNotificationMode] = useState("");
    const [notificationTrigger,setNotificationTrigger] = useState(0);

    const [logSenderTrigger,setLogSenderTrigger] = useState(0);
    const [errorForLog,setErrorForLog] = useState("");

    const {temporaryMailRegister} = useUserContext();


    const checkUsername = async () => {
        if(!usernamePar){
            toast.error("Ne yani? Kullanıcı adını hiç bir şey yapmadan mı girmek istiyorsun? Önce bir kullanıcı adı girmen gerek!")
            setNotificationMode("error")
            setNotificationTrigger(notificationTrigger + 1);
            
        }
        else if(usernamePar.length < 4){
            toast.error("Bu ismi çok düşündün herhalde? Daha uzun karakterli olması gerek. Minimum 4 karakter.")
            setNotificationMode("error")
            setNotificationTrigger(notificationTrigger + 1);
        }
        else{
            setUsernameAlreadyHave(false);
            setLoading(true);
            try{
                const {data,error} = await supabase
                .from("users")
                .select("username")
                .eq("username", usernamePar)

                if(error){
                    console.error(error);
                    toast.error("Kullanıcı adı kontrolü yapamadık, lütfen daha sonra tekrar dener misin?")
                    setNotificationMode("error")
                    setNotificationTrigger(notificationTrigger + 1);
                    setLoading(false)
                }
                else{
                    console.log(data);
                    if(data.length == 1){
                        setLoading(false);
                        setUsernameAlreadyHave(true)
                    }
                    else{
                        createUserWithUsername();
                    }
                }
            }
            catch(error){

            }
        }
    }

    const createUserWithUsername = async () => {
        try{        
            const {data,error} = await supabase
            .from("users")
            .insert([{
                id: userId,
                username,
                email: temporaryMailRegister
            }])

            if(error){
                toast.dismiss("Kullanıcı adı kaydedilirken bir hata oluştu!");
                setNotificationMode("error")
                setNotificationTrigger(notificationTrigger + 1);
                setErrorForLog(error);
                setLogSenderTrigger(1);
                setLoading(false);
            }
            else{
                console.log(data);
                toast.dismiss();
                setLoading(false);
                toast.success("Kullanıcı adı başarıyla kaydedildi!")
            }
        }
        catch(error){
            toast.dismiss("Kullanıcı adı kaydedilirken bir hata oluştu!");
            setNotificationMode("error")
            setNotificationTrigger(notificationTrigger + 1);
            console.log(error);
            setErrorForLog(error);
            setLogSenderTrigger(1);
            setLoading(false);
        }   
    }

    return(
        <>  
            <LogSender logs={errorForLog} mail={`noUser//${temporaryMailRegister}`} category={"addUsername"} triggerOpen={logSenderTrigger}/>
            <SoundPlayer trigger={notificationTrigger} mode={notificationMode}/>
            <div className="w-full h-screen fixed z-50">
                        <div className="h-full w-full bg-global bg-cover">
                            <div className="bg-dark-transparent flex backdrop-blur-md justify-center items-center h-full">
                                <div className="w-[650px] h-[550px] flex flex-col justify-center items-center bg-theme-gray-1 p-8 py-12 rounded-lg">
                                    <div className="flex items-center relative">
                                        <div className="z-40">
                                            <AnimationPlayer animationName={"helloAni"} hPar={150} wPar={150}/>
                                        </div>
                                        <div className="absolute end-0 bottom-[0px] z-50">
                                            <AnimationPlayer  animationName={"soundAni"} hPar={75} wPar={75}/>
                                        </div>
                                        <div className="absolute top-0 start-[-10px] z-10 ">
                                            <AnimationPlayer animationName={"textingAni"} hPar={40} wPar={90} />
                                        </div>
                                    </div>
                                    <p className="title-font-bold text-4xl text-center">Devam etmeden önce <br /> kullanıcı adı belirlemen gerek</p>
                                    <p className="title-font text-xl">Devam edebilmek için bu eşsiz yola uygun ismini belirlemen lazım</p>
                                    <input type="text" onChange={(e) => setUsernamePar(e.target.value)} placeholder="Kullanıcı adın" className={`bg-input p-4 rounded-lg outline-0 transition-all duration-300 ${usernameAlreadyHave ? "border-2 border-red-500 mt-4" : " my-4"}`}/>
                                    <p className={`title-font text-lg text-red-500 mb-4 ${usernameAlreadyHave ? "block" : "hidden"}`}>Bu kullanıcı adı daha önce alınmış, başka bir tane seçmelisin.</p>
                                    {loading ? <Loading2 /> : 
                                        <button className="text-font-bold bg-theme-pink px-12 py-4 rounded-lg outline-0" onClick={() => checkUsername()}>BAŞLAYALIM!</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
        </>
    )
}

export default AddUsername