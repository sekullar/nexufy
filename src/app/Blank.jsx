"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Walp from "./images/mainWalp.jpg"
import { useRouter } from 'next/navigation';
import Loading2 from "./Tools/Loading2";
import { createClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import RandomText from "./Tools/RandomText";

const Blank = () => {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoaded2,setIsLoaded2] = useState(false);
    const [siteOk,setSiteOk] = useState("waiting");

    const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
    const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;


    const supabase = createClient(supabaseUrl,supabaseKey);

    useEffect(() => {
        checkSiteActive();
        console.log(isLoaded,isLoaded2,siteOk)
        if (isLoaded && isLoaded2 && siteOk) {
            sessionStorage.setItem("preloadedImage", Walp.src);
    
            setTimeout(() => {
                router.push("/MembershipProcess/Login");
            }, 2000);
        }
        if(!siteOk){
            router.push("/System/ServiceUnavailable")
        }
    }, [isLoaded,isLoaded2,siteOk]);

    
    

    const checkSiteActive = async () => {
        try{  
            const {data,error} = await supabase
            .from("site_active")
            .select("active")

            if(error){
                console.log(error);
                toast.error("Nexufy'da şuan ters giden bir şeyler var. Sorun bizden kaynaklanıyor, lütfen bir süre sonra tekrar deneyin.")
            }
            else{
                console.log(data[0].active);
                if(!data[0].active){
                    setSiteOk(false);
                    setIsLoaded2(true);
                }
                else{
                    setSiteOk(true);
                    setIsLoaded2(true);
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    
    

    return (
        <>
            <div className="flex justify-center flex-col items-center h-screen w-full relative">
                <div className="relative">
                    <p className="animated-text n-letter z-50 text-7xl logo-font z-10 leading-[80px]">N</p>
                    <p className="absolute right-0 exufy-ani top-0 z-10 animated-text text-7xl logo-font leading-[80px]">exufy</p>
                </div>
                <Loading2 />
                <Image 
                    src={Walp} 
                    alt="Preload Image"
                    width={1}
                    height={1}
                    className="unvisible"
                    onLoadingComplete={() => setIsLoaded(true)}
                />

                <div className="flex justify-center bottom-0 absolute">
                    <p className="text-xl text-font-bold color-theme-pink mb-8"><RandomText /></p>
                </div>
            </div>
        </>
    );
}

export default Blank;
