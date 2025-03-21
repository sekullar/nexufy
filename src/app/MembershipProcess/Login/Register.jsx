import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import GoogleIcon from "../../images/google.png"
import toast from "react-hot-toast";

const Register = ({registerParam}) => {

    const [register,setRegister] = useState();

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

    useEffect(() => {
        registerParam(register)
    }, [register])

    return(
        <>
            <div className="bg-login h-screen w-full flex justify-center">
                <div className="flex flex-col justify-center">
                    <div className="flex justify-center items-center bg-theme-gray-1 p-3 rounded-lg w-[320px]">
                        <p className="logo-font text-3xl">Nexufy</p>
                        <p className="text-font text-xl">'a hoşgeldin!</p>
                    </div>
                    <div className="flex flex-col bg-theme-gray-1 rounded-lg mt-4 items-center py-7 pt-3">
                        <div className="flex flex-col  bg-theme-gray-1 p-3 w-[320px] rounded-lg">
                            <div className="flex flex-col gap-2 mx-auto">
                                <p className="text-font">Kullanıcı Adı:</p>
                                <input type="text" className="bg-input rounded-lg p-3 w-[250px]" placeholder="Kullanıcı Adı"/>
                            </div>
                        </div>
                        <div className="flex flex-col mt-3 bg-theme-gray-1 p-3 w-[320px] rounded-lg">
                            <div className="flex flex-col gap-2 mx-auto">
                                <p className="text-font">Kullanıcı Adı:</p>
                                <input type="text" className="bg-input rounded-lg p-3 w-[250px]" placeholder="Kullanıcı Adı"/>
                            </div>
                        </div>
                        <div className="flex flex-col mt-3 bg-theme-gray-1 p-3 w-[320px] rounded-lg">
                            <div className="flex flex-col gap-2 mx-auto">
                                <p className="text-font">Kullanıcı Adı:</p>
                                <input type="text" className="bg-input rounded-lg p-3 w-[250px]" placeholder="Kullanıcı Adı"/>
                            </div>
                        </div>
                        <div className="flex flex-col mt-3 bg-theme-gray-1 p-3 w-[320px] rounded-lg">
                            <div className="flex flex-col gap-2 mx-auto">
                                <p className="text-font">Kullanıcı Adı:</p>
                                <input type="text" className="bg-input rounded-lg p-3 w-[250px]" placeholder="Kullanıcı Adı"/>
                            </div>
                        </div>
                        <div className="flex items-center cursor-pointer gap-3 bg-input  rounded-lg p-3 px-8" onClick={() => googleLogin()}>
                            <Image src={GoogleIcon} className="w-[25px]" alt="Google" />
                            <p className="text-font-bold">Google ile kayıt ol</p>
                        </div>
                        <button className="bg-btn px-8 py-2 rounded-lg text-xl text-font-bold mt-4">Kayıt Ol</button>
                        <p className="color-theme-pink text-font-bold text-lg mt-4" onClick={() => setRegister(true)}>Hesabın zaten var mı?</p>
                    </div>
                </div>
            </div>
        </>
    )
} 

export default Register