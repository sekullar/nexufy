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
    const [googleId,setGoogleId] = useState("");
    const [googleMail,setGoogleMail] = useState("");
    const [getBackUserNew,setGetBackUserNew] = useState(false);
    const [headerChannelName,setHeaderChannelName] = useState("");
    const [roomIdGlobalForCall,setRoomIdGlobalForCall] = useState("");                                  // Son bağlanılan ses kanalını ID baz alır, anlık ID çekebilir. Left bar tetikler.
    const [userCallConnected,setUserCallConnected] = useState(false);
    const [userCallLoading,setUserCallLoading] = useState(false);
    const [voiceRoomName,setVoiceRoomName] = useState("");                                                              
    const [leftBarRefreshState,setLeftBarRefreshState] = useState(0);                                   // Ana menüde sol bardaki işlenen fonksiyonlar için kanal yenilemesi yapar
    const [modalValueNames,setModalValueNames] = useState("");                                          // Modalda düzenleme için isim taşıma
    const [modalValueTrigger,setModalValueTrigger] = useState(0);                                       // Modalda düzenleme için tetikleme
    const [modalValueId,setModalValueId] = useState("");                                                // Modalda düzenleme için ID taşıma
    const [muteAll,setMuteAll] = useState(false);                                                       // Global mute 
    const [deafenAll,setDeafenAll] = useState(false);                                                   // Global deafen
    const [leftBarTrigger,setLeftBarTrigger] = useState(0)                                              // Soldaki menüye tıklandığında tetikleme başlatır
    const [leftBarSoundChannelTrigger,setLeftBarSoundChannelTrigger] = useState(0)                      // Soldaki menüye, tıklandığında ses tetiklemesi
    const [membersOnSoundChannelData,setMembersOnSoundChannelData] = useState([]);                      // Ses kanalındaki üyeleri gösterir
    const [modalValueType,setModalValueType] = useState("");
    const [ping,setPing] = useState(0);





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
        setLastSelectedTextChannel,
        googleId,
        setGoogleId,
        getBackUserNew,
        setGetBackUserNew,
        googleMail,
        setGoogleMail,
        headerChannelName,
        setHeaderChannelName,
        roomIdGlobalForCall,
        setRoomIdGlobalForCall,
        userCallConnected,
        setUserCallConnected,
        userCallLoading,
        setUserCallLoading,
        voiceRoomName,
        setVoiceRoomName,
        leftBarRefreshState,
        setLeftBarRefreshState,
        modalValueNames,
        setModalValueNames,
        modalValueTrigger,
        setModalValueTrigger,
        modalValueId,
        setModalValueId,
        muteAll,
        setMuteAll,
        deafenAll,
        setDeafenAll,
        leftBarTrigger,
        setLeftBarTrigger,
        leftBarSoundChannelTrigger,
        setLeftBarSoundChannelTrigger,
        membersOnSoundChannelData,
        setMembersOnSoundChannelData,
        modalValueType,
        setModalValueType,
        ping,
        setPing

        
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
