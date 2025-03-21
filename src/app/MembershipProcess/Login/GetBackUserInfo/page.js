"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from "@supabase/supabase-js";
import Loading2 from '@/app/Tools/Loading2';


const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;

const supabase = createClient(supabaseUrl,supabaseKey);


const AuthCallback = () => {

    const getUserData = async () => {
        const { data: sessionData, error } = await supabase.auth.getSession();

        if (error || !sessionData.session) {
            console.error('Oturum alınamadı:', error?.message || 'Bilinmeyen hata');
            router.push('/login'); 
            return;
        }

        const user = sessionData.session.user;
        console.log('Kullanıcı Bilgileri:', user);

        if (user.email === 'sekusoftware@gmail.com') {
            router.push('/SekuSoftwareAdminPanel');
        } else {
            router.push('/Home');
        }
    }; 

    const router = useRouter();

    useEffect(() => {
        

        getUserData();
    }, [router]);

    return (
        <div className='flex h-screen w-full justify-center items-center'>
            <Loading2 />
        </div>
    );
};

export default AuthCallback;
