"use client"; 

import { useEffect } from "react"
import "../app/css/Loading.css"
import Loading2 from "./Tools/Loading2"
import { useRouter } from 'next/navigation';


const Blank = () => {

    const router = useRouter();

    useEffect(() => {
        setInterval(() => {
            router.push("/MembershipProcess/Login"); 
        }, 5000)
    }, [])

    return(
        <>
            <div className="flex justify-center flex-col items-center h-screen w-full relative">
                <div className="relative "> 
                    <p className="animated-text n-letter z-50 text-7xl logo-font z-10 leading-[80px]">N</p>
                    <p className="absolute right-0 exufy-ani top-0 z-10 animated-text text-7xl logo-font leading-[80px] ">exufy</p>
                </div>
                <Loading2 />
            </div>
        </>
    )
}

export default Blank