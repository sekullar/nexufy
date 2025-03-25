import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import GoogleIcon from "../../images/google.png"
import toast from "react-hot-toast"
import LogSender from "@/app/Tools/LogSender";

const Register = ({registerParam}) => {

    const [register,setRegister] = useState();

    const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
    const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;

    const supabase = createClient(supabaseUrl,supabaseKey);

    const [username,setUsername] = useState("");
    const [mail,setMail] = useState("");
    const [password,setPassword] = useState("");
    const [passwordCheck,setPasswordCheck] = useState("");
    const [errorForLog,setErrorForLog] = useState("");

    const [megaUserId,setMegaUserId] = useState("");
    const [logSenderTrigger,setLogSenderTrigger] = useState(0);


    const googleLogin = async () => {
        toast.loading("Yükleniyor...")
        const {error,data} = await supabase.auth.signInWithOAuth({
            provider:"google",
            options:{
                redirectTo: `${window.location.origin}/MembershipProcess/Login/GetBackUserInfo`
            }
        });

        if(error){
            console.log(error);
            toast.dismiss();
            toast.error("Kayıt olunurken bir hata oluştu!")
        }
        else{
            console.log(data);
            
        }

    }

    const registerUser = async () => {
        if(password != passwordCheck){
            toast.error("Şifreler eşleşmiyor")
            return
        }
        else if(!username || !mail || !password || !passwordCheck){
            toast.error("Bütün bilgileri doldurduğuna emin misin?")
            return
        }
        else{
            toast.loading("Yükleniyor...")
            try{
                const {data,error} = await supabase.auth.signUp({
                    email:mail,
                    password
                })  
                
                if(error){
                    toast.dismiss();
                    toast.error("Lütfen tüm bilgileri eksiksiz doldurun")
                    setErrorForLog(error);
                    setLogSenderTrigger(1);
                }
                else{
                    console.log(data);
                    await saveUser(data.user.id); 

                }
            }
            catch(error){
                toast.dismiss();
                toast.error("Kayıt olunurken bir hata oluştu!")
                setErrorForLog(error);
                setLogSenderTrigger(1);
            }
        }   
    }
    
    const saveUser = async (userId) =>{
        console.log("ANASINI KARISINI SİKTİĞİMİN USER ID Sİ BURDA BURDA SİKİŞ DÖNÜYOR",megaUserId);
        try{        
            const {data,error} = await supabase
            .from("users")
            .insert([{
                id: userId,
                username,
                email:mail
            }])

            if(error){
                toast.dismiss("Kayıt olunurken bir hata oluştu!");
                setErrorForLog(error);
                setLogSenderTrigger(1);
            }
            else{
                toast.dismiss();
                setRegister(true);
                toast.success("Başarıyla kayıt oldunuz! Lütfen yeniden giriş yapın.")
            }
        }
        catch(error){
            setErrorForLog(error);
            setLogSenderTrigger(1);
        }   
    }

    useEffect(() => {
        registerParam(register)
    }, [register])

    return(
        <>  
            <LogSender logs={errorForLog} mail={`noUser//${mail}`} category={"register"} triggerOpen={logSenderTrigger}/>
            <div className="bg-login h-screen w-full flex justify-center">
                <div className="flex flex-col justify-center">
                    <div className="flex justify-center items-center bg-theme-gray-1 p-3 rounded-lg w-[320px]">
                        <p className="logo-font text-3xl">Nexufy</p>
                        <p className="text-font text-xl">'a hoşgeldin!</p>
                    </div>
                    <div className="flex flex-col bg-theme-gray-1 rounded-lg mt-4 items-center py-7 pt-3">
                        
                        <div className="flex flex-col mt-3 bg-theme-gray-1 p-3 w-[320px] rounded-lg">
                            <div className="flex flex-col gap-2 mx-auto">
                                <p className="text-font">Kullanıcı Adı:</p>
                                <input type="text" onChange={(e) => setUsername(e.target.value)} className="bg-input rounded-lg p-3 w-[250px]" placeholder="Kullanıcı Adı"/>
                            </div>
                        </div>
                        <div className="flex flex-col  bg-theme-gray-1 p-3 w-[320px] rounded-lg">
                            <div className="flex flex-col gap-2 mx-auto">
                                <p className="text-font">E-Posta:</p>
                                <input type="mail" onChange={(e) => setMail(e.target.value)} className="bg-input rounded-lg p-3 w-[250px]" placeholder="E-Posta"/>
                            </div>
                        </div>
                        <div className="flex flex-col mt-3 bg-theme-gray-1 p-3 w-[320px] rounded-lg">
                            <div className="flex flex-col gap-2 mx-auto">
                                <p className="text-font">Şifre</p>
                                <input type="password" onChange={(e) => setPassword(e.target.value)} className="bg-input rounded-lg p-3 w-[250px]" placeholder="Kullanıcı Adı"/>
                            </div>
                        </div>
                        <div className="flex flex-col mt-3 bg-theme-gray-1 p-3 w-[320px] rounded-lg">
                            <div className="flex flex-col gap-2 mx-auto">
                                <p className="text-font">Tekrar şifrenizi girin:</p>
                                <input type="password" onChange={(e) => setPasswordCheck(e.target.value)} className="bg-input rounded-lg p-3 w-[250px]" placeholder="Şifre tekrar"/>
                            </div>
                        </div>
                        <div className="flex items-center cursor-pointer gap-3 bg-input  rounded-lg p-3 px-8" onClick={() => googleLogin()}>
                            <Image src={GoogleIcon} className="w-[25px]" alt="Google" />
                            <p className="text-font-bold">Google ile kayıt ol</p>
                        </div>
                        <button className="bg-btn px-8 py-2 rounded-lg text-xl text-font-bold mt-4" onClick={() => registerUser()}>Kayıt Ol</button>
                        <p className="color-theme-pink text-font-bold text-lg mt-4" onClick={() => setRegister(true)}>Hesabın zaten var mı?</p>
                    </div>
                </div>
            </div>

        </>
    )
} 

export default Register