"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Walp from "../../public/images/mainWalp.jpg"
import { useRouter } from 'next/navigation';
import Loading2 from "../Tools/Loading2";
import { createClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import RandomText from "../Tools/RandomText";
import { useUserContext } from "@/Context/UserContext";

const Blank = () => {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoaded2, setIsLoaded2] = useState(false);
    const [siteOk, setSiteOk] = useState("waiting");
    const [sessionAlreadyHave, setSessionAlreadyHave] = useState(null);

    const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
    const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const {setUserData,setUser} = useUserContext();

    useEffect(() => {
        setUserData("wait")
        if (typeof window !== 'undefined') {
            const accessToken = localStorage.getItem('access_token');
            const expiresAt = localStorage.getItem('expires_at');
            const refreshToken = localStorage.getItem('refresh_token');

            if (accessToken && expiresAt) {
                const currentTime = Math.floor(Date.now() / 1000);
                if (currentTime < parseInt(expiresAt, 10)) {
                    validateToken(accessToken)
                }
            }
        }

        checkSiteActive();
    }, []);

    const validateToken = async (token) => {
        const { data, error } = await supabase.auth.getUser(token);

        if (error) {
            console.log("Token doğrulama hatası:", error);
            logout(); 
        } else if (data) {
            console.log("Token doğrulandı:", data);
            getUserData(data.user.email)
            setUser(data);
        }
    };

    const getUserData = async (mail) => {
        const {data,error} = await supabase
        .from("users")
        .select("*")
        .eq("email",mail)

        if(error){
            console.log(error);
            logout();
        }       
        else{
            console.log("Bütün kullanıcı dataları burada", data)
            setUserData(data);
            setSessionAlreadyHave(true); 
        }
    }

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("refresh_token");
        setSessionAlreadyHave(false);
        toast.error("Oturumun sona erdi. Lütfen tekrar giriş yapın.");
    };

    useEffect(() => {
        console.log(isLoaded, isLoaded2, siteOk);

        if (isLoaded && isLoaded2 && siteOk) {
            sessionStorage.setItem("preloadedImage", Walp.src);

            setTimeout(() => {
                if (sessionAlreadyHave) {
                    router.push("/Home");
                } else {
                    router.push("/MembershipProcess/Login");
                }
            }, 2000);
        }

        if (!siteOk) {
            router.push("/System/ServiceUnavailable");
        }
    }, [isLoaded, isLoaded2, siteOk,sessionAlreadyHave]);

    const checkSiteActive = async () => {
        try {
            const { data, error } = await supabase
                .from("site_active")
                .select("active");

            if (error) {
                console.log(error);
                toast.error(
                    "Nexufy'da şuan ters giden bir şeyler var. Sorun bizden kaynaklanıyor, lütfen bir süre sonra tekrar deneyin."
                );
            } else {
                console.log(data[0].active);
                if (!data[0].active) {
                    setSiteOk(false);
                    setIsLoaded2(true);
                } else {
                    setSiteOk(true);
                    setIsLoaded2(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="flex justify-center flex-col items-center h-screen w-full relative">
                <div className="relative mb-8">
                    <p className="animated-text text-theme-pink animate-nMove n-letter z-50 text-7xl logo-font z-10 leading-[80px]">N</p>
                    <p className="absolute right-[-89px] text-theme-pink animate-exufy ms-5 top-0 z-10 animated-text text-7xl logo-font leading-[80px]">exufy</p>
                </div>
                <div className="opening-ani">
                    <Loading2 />
                </div>
                <Image
                    src={Walp}
                    alt="Preload Image"
                    width={1}
                    height={1}
                    className="unvisible"
                    onLoadingComplete={() => setIsLoaded(true)}
                />

                <div className="flex justify-center bottom-0 absolute">
                    <p className="text-xl text-font-bold text-theme-pink mb-8"><RandomText /></p>
                </div>
            </div>
        </>
    );
};

export default Blank;
