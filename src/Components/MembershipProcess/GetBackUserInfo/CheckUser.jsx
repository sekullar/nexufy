"use client"

import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from "@supabase/supabase-js";
import { useUserContext } from '@/Context/UserContext';

const CheckUser = () => {
    const router = useRouter();

    const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
    const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;

    const supabase = createClient(supabaseUrl,supabaseKey);


    useEffect(() => {
        getUserData();
    }, [router]);

    const { user,setUser,setUserNew,setTemporaryMailRegister} = useUserContext();
    console.log("auth", user);
    
    const getUserData = async () => {
        const { data: sessionData, error } = await supabase.auth.getSession();

        if (error || !sessionData.session) {
            console.error('Oturum alınamadı:', error?.message || 'Bilinmeyen hata');
            router.push('/login'); 
            return;
        }

        const user = sessionData.session.user;
        console.log('Kullanıcı Bilgileri:', user);
        userControl(user.email)
        setTemporaryMailRegister(user.email)
        setUser(user);

        if (user.email === 'sekusoftware@gmail.com') {
            router.push('/SekuSoftwareAdminPanel');
        } else {
            router.push('/Home');
        }
    }; 


    const userControl = async (email) => {
        try{
            const { data, error } = await supabase
            .from('users')       
            .select('email')     
            .eq('email', email); 

            
            if(error){
                console.log(error)
            }
            else{
                console.log(data);
                if(data.length != 0){
                    console.log("Bu kullanıcı var")
                    setUserNew(false);
                }
                else{
                    console.log("Bu kullanıcı hiç var olmadı")
                    setUserNew(true);
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    return(
        <>
        
        </>
    )
}

export default CheckUser