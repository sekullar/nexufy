import Image from "next/image"
import Logo from "../../../public/icons/logo.svg"
import GoogleIcon from "../../../public/images/google.png"
import { useEffect, useState, useContext } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast";
import LogSender from "@/Tools/LogSender"
import { useUserContext } from "@/Context/UserContext"
import { useRouter } from "next/navigation"

const Login = ({ loginSendParam }) => {

    const router = useRouter();

    const [loginSend, setLoginSend] = useState(true);
    const [imageSrc, setImageSrc] = useState("");

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const [logSenderTrigger,setLogSenderTrigger] = useState(0);
    const [logsErrorSender,setLogsErrorSender] = useState("");

    const {user,setUser} = useUserContext();

    useEffect(() => {
        loginSendParam(loginSend);

        const preloadedImage = sessionStorage.getItem("preloadedImage");
        if (preloadedImage) {
            setImageSrc(preloadedImage);
        }
    }, [loginSend]);
1
    const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
    const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const loginUser = async () => {
        if(!email || !password){
            toast.error("Tüm bilgileri doldurduğuna emin misin?")
            return
        }
        else{
            toast.loading("Yükleniyor...")
            try{
                const {data,error} = await supabase.auth.signInWithPassword({
                    email,
                    password
                })

                if(error){
                    toast.dismiss();
                    toast.error("E-Postanız veya şifreniz yanlış")
                }
                else{
                    toast.dismiss();
                    toast.success("Giriş yapıldı! Hoşgeldiniz!")
                    console.log(data);
                    setUser(data.user);
                    router.push("/Home")
                }
            }
            catch(error){
                setLogSenderTrigger(1);
                setLogsErrorSender(error);
            }   
            }
    }

    const googleLogin = async () => {
        toast.loading("Yükleniyor...")
        const { error, data } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/MembershipProcess/Login/GetBackUserInfo`
            }
        });

        if (error) {
            console.log(error);
            toast.dismiss();
            toast.error("Kayıt olunurken bir hata oluştu!")
        } else {
            console.log(data);
        }
    }

    return (
        <>
            <LogSender logs={logsErrorSender} mail={email} category={"Login"} triggerOpen={logSenderTrigger}/>
            <div className="h-screen bg-login w-full relative">
                {imageSrc && (
                    <Image 
                        src={imageSrc} 
                        alt="Preloaded Background" 
                        layout="fill" 
                        objectFit="cover"
                        className="absolute top-0 left-0 z-0"
                    />
                )}
                <div className="h-full min-w-[600px] bg-theme-gray-1 absolute z-50 top-0">
                    <div className="flex flex-col w-full items-center justify-around h-full">
                        <div className="flex flex-col items-center">
                            <Image className="w-[130px]" src={Logo} alt="Nexora Logo" />
                            <p className="title-font-bold text-white mt-6 text-4xl">Tekrar hoşgeldin!</p>
                            <div className="flex flex-col gap-3 mt-6">
                                <p className="text-font text-xl">E-Posta:</p>
                                <input value={email} type="mail" onChange={(e) => setEmail(e.target.value)} className="bg-input p-2 px-4 rounded-xl outline-0" placeholder="E-Posta" />
                            </div>
                            <div className="flex flex-col gap-3 mt-6">
                                <p className="text-font text-xl">Şifre:</p>
                                <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} className="bg-input p-2 px-4 rounded-xl outline-0" placeholder="Şifre" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center cursor-pointer justify-center gap-4 bg-input rounded-lg p-3 px-8 mb-4" onClick={() => googleLogin()}>
                                <Image src={GoogleIcon} className="w-[25px]" alt="Google" />
                                <p className="text-font-bold">Google ile giriş yap</p>
                            </div>
                            <button className="bg-btn text-2xl rounded-lg text-font-bold py-4" onClick={() => loginUser()}>Giriş yap</button>
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

export default Login;
