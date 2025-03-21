import "../../css/Login.css"
import "../../css/Main.css"
import Image from "next/image"
import Logo from "../../images/logo.svg"
import GoogleIcon from "../../images/google.png"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast";


const Login = ({loginSendParam}) => {

    const [loginSend,setLoginSend] = useState(true);

    useEffect(() => {
        loginSendParam(loginSend)
    }, [loginSend])


    const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
    const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;

    const supabase = createClient(supabaseUrl,supabaseKey);

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

    return(
        <>
            <div className="h-screen bg-login w-full relative">
                <div className="h-full min-w-[600px] bg-theme-gray-1 absolute z-50 top-0">
                    <div className="flex flex-col w-full items-center justify-around h-full">
                        <div className="flex flex-col items-center">
                            <Image className="w-[130px]" src={Logo} alt="Nexora Logo"/>
                            <p className="title-font-bold text-white mt-6 text-4xl">Tekrar hoşgeldin!</p>
                            <div className="flex flex-col gap-3 mt-6">
                                <p className="text-font text-xl">E-Posta:</p>
                                <input type="mail" className="bg-input p-2 px-4 rounded-xl outline-0" placeholder="E-Posta" />
                            </div>
                            <div className="flex flex-col gap-3 mt-6">
                                <p className="text-font text-xl">Şifre:</p>
                                <input type="password" className="bg-input p-2 px-4 rounded-xl outline-0" placeholder="Şifre" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center cursor-pointer justify-center gap-4 bg-input  rounded-lg p-3 px-8 mb-4" onClick={() => googleLogin()}>
                                <Image src={GoogleIcon} className="w-[25px]" alt="Google" />
                                <p className="text-font-bold">Google ile giriş yap</p>
                            </div>
                            <button className="bg-btn text-2xl rounded-lg text-font-bold py-4">Giriş yap</button>
                            <div className="flex flex-col items-center mt-8 gap-3">
                                <p href="#" className="color-theme-pink text-font-bold cursor-pointer" onClick={() => setLoginSend(false)}>Hesap Oluştur</p>
                                <p href="#" className="color-theme-pink text-font-bold cursor-pointer">Giriş yaparken sorun mu yaşıyorsun?</p>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </>
    )
}

export default Login