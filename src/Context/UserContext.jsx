"use client"; 

import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);                                           // Kullanıcının Google giriş bilgileri
    const [userNew, setUserNew] = useState(null);
    const [temporaryMailRegister,setTemporaryMailRegister] = useState(null);
    const [userData, setUserData] = useState("noAccess");                             // Kullanıcının veritabanındaki bilgileri


    const context = {
        user,
        userData,
        setUserData,
        setUser,
        userNew,
        setUserNew,
        temporaryMailRegister,
        setTemporaryMailRegister
    }

    return (
        <UserContext.Provider value={context}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => { 
    const context = useContext(UserContext);
    return context;
};
