"use client"; 

import { createContext, useContext, useState } from 'react';

const InterfaceContext = createContext(null);

export const InterfaceProvider = ({ children }) => {

    const [selectedServerId,setSelectedServerId] = useState(null);
    const [serverData,setServerData] = useState([]);
    const [articleValue,setArticleValue] = useState("starter");
    const [messageHistory,setMessageHistory] = useState([]); 
    const [articleLoading,setArticleLoading] = useState(false);
    const [lastSelectedTextChannel,setLastSelectedTextChannel] = useState("");


    const context = {
        selectedServerId,
        setSelectedServerId,
        serverData,
        setServerData,
        articleValue,
        setArticleValue,
        messageHistory, 
        setMessageHistory,
        articleLoading,
        setArticleLoading,
        lastSelectedTextChannel,
        setLastSelectedTextChannel
    }

    return (
        <InterfaceContext.Provider value={context}>
            {children}
        </InterfaceContext.Provider>
    );
};

export const useInterfaceContext = () => { 
    const context = useContext(InterfaceContext);
    return context;
};
