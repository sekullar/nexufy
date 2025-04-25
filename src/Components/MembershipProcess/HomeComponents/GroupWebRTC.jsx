import { useRef, useState, useEffect } from "react";
import io from "socket.io-client";
import Call from "../../../../public/icons/call.svg"
import Image from "next/image";
import { useInterfaceContext } from "@/Context/InterfaceContext";
import EndCall from "../../../../public/icons/end-call.svg"
import MicMute from "../../../../public/icons/microphonemute.svg"
import Loading2 from "@/Tools/Loading2";
import SoundPlayer from "@/Tools/SoundPlayer";
import toast from "react-hot-toast";
import { createClient } from "@supabase/supabase-js";
import { useUserContext } from "@/Context/UserContext";
import User from "../../../../public/icons/user.svg"

export default function Home() {
  const [roomId, setRoomId] = useState("genel");
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({});

  const [notificationMode, setNotificationMode] = useState("");
  const [notificationTrigger, setNotificationTrigger] = useState(0);

  const { roomIdGlobalForCall, userCallConnected, setUserCallConnected, userCallLoading, setUserCallLoading, voiceRoomName,muteAll,setMuteAll,deafenAll,setDeafenAll,serverData,leftBarTrigger,leftBarSoundChannelTrigger,setMembersOnSoundChannelData,membersOnSoundChannelData} = useInterfaceContext();
  const {user,userData} = useUserContext();

  const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
  const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const userJoinDb = async () => {
    try {
      const { data, error } = await supabase
        .from("soundChannelInfo")
        .insert([{
          userId: user.id,
          username: userData[0].username,
          is_mute: muteAll,
          is_deafen: deafenAll,
          joinSoundChannelId: roomIdGlobalForCall,
          serverId: serverData[0].id,
          socket_id: socketRef.current.id
        }])

        if(error){
          console.log(error);
          return;
        }
        
    } catch (error) {
      console.log(error);
      return;
    }
  }

  const getUsersOnChannel = async () => {
    try{
      const {data,error} = await supabase
      .from("soundChannelInfo")
      .select("*")
      .match({
        joinSoundChannelId:roomIdGlobalForCall,
        serverId: serverData[0].id
      })
      
      if(error){
        console.log(error);
      }
      else{
        setMembersOnSoundChannelData(data);
        liveGetUsersOnChannel();
      }
    }
    catch(error){
      console.log(error)
    }
    
  }

  useEffect(() => {
    if(leftBarTrigger != 0){
      getUsersOnChannel();
    }
  }, [leftBarTrigger])

 

  const channelRef = useRef(null); // dinleme kanalını saklamak için

  useEffect(() => {
    console.log(membersOnSoundChannelData);
  }, [membersOnSoundChannelData])

  useEffect(() => {
    if (leftBarSoundChannelTrigger !== 0) {
      liveGetUsersOnChannel();
    }
  
    // component unmount olursa kanalı da sil
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        console.log("Kanal dinlemesi bırakıldı.")
        channelRef.current = null;
      }
    };
  }, [leftBarSoundChannelTrigger]);
  
  const liveGetUsersOnChannel = async () => {
    console.log("Kanal Dinleniyor...")
    try {
      // Kanal dinlemeyi temizle (önceki varsa)
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
  
      // 🔥 Önce geçmiş verileri çek
      const { data, error } = await supabase
        .from('soundChannelInfo')
        .select('*')
        .match({
          joinSoundChannelId: roomIdGlobalForCall,
          serverId: serverData[0].id,
        });
  
      if (error) {
        console.error('Fetch error:', error);
      } else {
        setMembersOnSoundChannelData(data);
      }
  
      // 🔥 Şimdi realtime kanal kur
      const newChannel = supabase
        .channel(`realtime:soundChannelInfo:${roomIdGlobalForCall}`)
  
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'soundChannelInfo' }, (payload) => {
          console.log('Yeni katılan:', payload.new);
          console.log("CHECKS:",payload.new.joinSoundChannelId,roomIdGlobalForCall)
          console.log("CHECKS 2:",payload.new.serverId,serverData[0].id)

  
          if (
            String(payload.new.joinSoundChannelId) === String(roomIdGlobalForCall) &&
            String(payload.new.serverId) === String(serverData[0].id)
          ) {
            setMembersOnSoundChannelData((prev) => [...prev, payload.new]);
          }
        })
  
        .on('postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'soundChannelInfo' },
          (payload) => {
            const oldRecord = payload.old;
            console.log("payload", payload);
        
            if (oldRecord?.id) {
              console.log("SİLİYOM REİS ID:", oldRecord.id);
              setMembersOnSoundChannelData(prev =>
                prev.filter(u => String(u.id) !== String(oldRecord.id))
              );
            } else {
              console.warn("oldRecord boş ya da id yok aq");
            }
          }
        )
        
  
        .subscribe();
  
      // 🔧 Kanalı ref’e ata ki bir daha erişebilelim

      channelRef.current = newChannel;
    } catch (error) {
      console.log('Realtime hatası:', error);
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled; 1
        setMuteAll(!audioTrack.enabled); 
        console.log("🎤 Mikrofon durumu değişti:", !audioTrack.enabled ? "Kapalı" : "Açık");
      } else {
        console.warn("🚨 Ses track'ı bulunamadı amk");
      }
    } else {
      console.warn("🚨 Stream yok aq");
    }
  };
  

  const createPeer = (userId, initiator = false) => {
    if (peersRef.current[userId]) {
      console.log("⚠️ Zaten peer var:", userId);
      return peersRef.current[userId];
    }

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("candidate", {
          target: userId,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      console.log("📡 Yeni track:", userId);
      const audio = document.createElement("audio");
      audio.srcObject = event.streams[0];
      audio.autoplay = true;
      audio.controls = true;
      document.body.appendChild(audio);
    };

    peer.onconnectionstatechange = () => {
      console.log("🔄 Conn state:", peer.connectionState);
      if (peer.connectionState == "disconnected" || peer.connectionState == "failed") {
        setNotificationMode("leaveChannel");
        setNotificationTrigger(Date.now());
      }
    };

    peer.onsignalingstatechange = () => {
      console.log("📶 Signaling state:", peer.signalingState);
    };

    localStreamRef.current.getTracks().forEach((track) => {
      peer.addTrack(track, localStreamRef.current);
    });

    peersRef.current[userId] = peer;
    return peer;
  };

  const joinRoom = async () => {
    setNotificationMode("joinChannel")
    setNotificationTrigger(Date.now());
    setUserCallConnected(true);
    setUserCallLoading(true);
    socketRef.current = io("https://nexufy-socket-server.onrender.com", {
      path: "/api/signal",
    });


    socketRef.current.on("connect", async () => {
      console.log("✅ Socket'e bağlandı");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        localStreamRef.current = stream;
        
        if (muteAll) {
          const audioTrack = localStreamRef.current.getAudioTracks()[0];
          if (audioTrack) {
            audioTrack.enabled = false;
            console.log("🎤 Mikrofon baştan kapalı başlatıldı çünkü muteAll aktifti pampa.");
          }
        }
    
        socketRef.current.emit("join-room", roomIdGlobalForCall);

        await userJoinDb();
    
      } catch (err) {
        console.error("❌ Media device hatası oldu aq:", err);
        toast.error("Mikrofon iznini alamıyoruz, mikrofona izin vermemiş olabilirsin.")
      }
    });

    socketRef.current.on("all-users", (users) => {
      console.log("📥 Odaya katılanlar:", users);
      setUserCallLoading(false);
      users.forEach(async (userId) => {
        const peer = createPeer(userId, true);
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        socketRef.current.emit("offer", {
          target: userId,
          offer,
        });
      });
    });
    
    if (muteAll) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = false;
        console.log("🎤 Mikrofon baştan kapalı başlatıldı çünkü muteAll aktifti pampa.");
      }
    }

    socketRef.current.on("user-joined", async (userId) => {
      console.log("🧍 Yeni kullanıcı geldi:", userId);
      setNotificationMode("joinChannel")
      setNotificationTrigger(Date.now());
      createPeer(userId, false);
    });

    socketRef.current.on("offer", async ({ from, offer }) => {
      console.log("📨 Offer alındı:", from);

      let peer = peersRef.current[from];
      if (!peer) peer = createPeer(from, false);

      if (peer.signalingState !== "stable") {
        console.log("🛑 Peer zaten bağlantıda:", from);
        return;
      }

      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socketRef.current.emit("answer", { target: from, answer });
    });

    socketRef.current.on("answer", async ({ from, answer }) => {
      console.log("📩 Answer geldi:", from);
      const peer = peersRef.current[from];
      if (peer.signalingState === "have-local-offer") {
        await peer.setRemoteDescription(new RTCSessionDescription(answer));
      } else {
        console.warn("⚠️ Geçersiz signalingState, answer uygulanamadı.");
        setNotificationMode("warn")
        setNotificationTrigger(Date.now());
      }
    });

    socketRef.current.on("candidate", async ({ from, candidate }) => {
      console.log("🧊 ICE geldi:", from);
      const peer = peersRef.current[from];
      if (peer) {
        try {
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("🚨 ICE candidate hatası:", err);
          toast.error("Buralarda bağlantı sorunları var. İnternetini kontrol et ve daha sonra tekrar dene")
          setNotificationMode("error")
          setNotificationTrigger(Date.now());
        }
      }
    });

    socketRef.current.on("user-left", (userId) => {
      console.log("👋 Kullanıcı ayrıldı:", userId);
      setNotificationMode("leaveChannel")
      setNotificationTrigger(Date.now());
      if (peersRef.current[userId]) {
        peersRef.current[userId].close();
        delete peersRef.current[userId];
      }
    });
  };

  const endCall = () => {
    setNotificationMode("leaveChannel")
    setNotificationTrigger(Date.now());
    Object.values(peersRef.current).forEach((peer) => {
      peer.close();
    });
    peersRef.current = {};

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    document.querySelectorAll("audio").forEach((audio) => {
      audio.pause();
      audio.remove();
    });
    setUserCallConnected(false);

    console.log("📞 Çağrı sonlandırıldı pampa");
  };

  useEffect(() => {
    const handleOffline = () => {
      console.log("🌐 İnternet bağlantısı kayboldu.");
      setNotificationMode("warn");
      setNotificationTrigger(Date.now());
      endCall();
    };

    const handleOnline = () => {
      console.log("🌐 İnternet bağlantısı geri geldi.");
      setNotificationMode("reconnect");
      setNotificationTrigger(Date.now());
      joinRoom();
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <div className="flex flex-col justify-between h-full py-12 items-center">
      <SoundPlayer trigger={notificationTrigger} mode={notificationMode}/>
      <h1 className="text-4xl title-font-bold">Oda: {voiceRoomName}</h1>
      <div className="overflow-auto flex items-center gap-4 max-h-[400px]">
        {membersOnSoundChannelData && membersOnSoundChannelData.map((userOnChannel,key) => {
          return(
            <div key={key}>
                <div className="flex flex-col items-center gap-3">
                  <Image src={User} className="w-[50px]" alt="User"/>
                  <p className="text-font text-2xl">{userOnChannel.username}</p>
                </div>
            </div>
          )
        })}  
      </div>
      {userCallConnected ? 
      <>
        {userCallLoading ? <Loading2 /> : 
         <div className="bg-theme-gray-3 rounded-2xl p-3 ">
            <button className={`${muteAll ? "bg-white" : "bg-theme-gray-2"} transition-all duration-300  rounded-full p-4 me-3`} onClick={() => toggleMute()}> <Image src={MicMute} className={`w-[30px] transition-all duration-300 ${muteAll ? "invert" : "notMute"}`} alt="Microphone Mute"/> </button>
            <button className="bg-red-600 transition-all duration-300 hover:bg-red-700 rounded-full p-4" onClick={() => endCall()}> <Image src={EndCall} className="w-[30px]" alt="End Call"/> </button>
          </div>}
      </> : 
      <button className="p-2 mt-4  text-white rounded-full bg-btn p-4 transition-all duration-300 hover:bg-btn-hover" onClick={joinRoom}>
        <Image src={Call}  alt="Call Button" className="w-[35px]"/>
      </button>}
    </div>
  );
}








// PAYLOAD.OLD SADECE İD VERİYOR İD BARINDIRDIĞI İÇİN SDAECE İDYE GÖRE SİLDİREBİLİRİZ


