import { useRef, useState, useEffect } from "react";
import io from "socket.io-client";
import Call from "../../../../public/icons/call.svg"
import Image from "next/image";
import { useInterfaceContext } from "@/Context/InterfaceContext";
import EndCall from "../../../../public/icons/end-call.svg"
import MicMute from "../../../../public/icons/microphonemute.svg"
import Loading2 from "@/Tools/Loading2";

export default function Home() {
  const [roomId, setRoomId] = useState("genel");
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({}); // Birden fazla peer için

  const {roomIdGlobalForCall,userCallConnected,setUserCallConnected,userCallLoading,setUserCallLoading} = useInterfaceContext();

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
    };

    peer.onsignalingstatechange = () => {
      console.log("📶 Signaling state:", peer.signalingState);
    };

    localStreamRef.current.getTracks().forEach((track) => {
      peer.addTrack(track, localStreamRef.current);
    });

    peersRef.current[userId] = peer;
    setUserCallLoading(false);
    return peer;
  };

  const joinRoom = async () => {
    setUserCallConnected(true);
    setUserCallLoading(true);
    socketRef.current = io("https://nexufy-socket-server.onrender.com", {
      path: "/api/signal",
    });

    socketRef.current.on("connect", async () => {
      console.log("✅ Socket'e bağlandı");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      localStreamRef.current = stream;

      socketRef.current.emit("join-room", roomIdGlobalForCall);
    });

    socketRef.current.on("all-users", (users) => {
      console.log("📥 Odaya katılanlar:", users);
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

    socketRef.current.on("user-joined", async (userId) => {
      console.log("🧍 Yeni kullanıcı geldi:", userId);
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
        }
      }
    });

    socketRef.current.on("user-left", (userId) => {
      console.log("👋 Kullanıcı ayrıldı:", userId);
      if (peersRef.current[userId]) {
        peersRef.current[userId].close();
        delete peersRef.current[userId];
      }
    });
  };

  const endCall = () => {
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
  

  return (
    <div className="flex flex-col justify-between h-full py-12 items-center">
      <h1 className="text-4xl title-font-bold">Oda: {roomIdGlobalForCall}</h1>
      {userCallConnected ? 
      <>
        {userCallLoading ? <Loading2 /> : 
         <div className="bg-theme-gray-3 rounded-2xl p-3 ">
            <button className="bg-theme-gray-2 rounded-full p-4 me-3"> <Image src={MicMute} className="w-[30px]" alt="Microphone Mute"/> </button>
            <button className="bg-red-600 transition-all duration-300 hover:bg-red-700 rounded-full p-4" onClick={() => endCall()}> <Image src={EndCall} className="w-[30px]" alt="End Call"/> </button>
          </div>}
      </> : 
      <button className="p-2 mt-4  text-white rounded-full bg-btn p-4 transition-all duration-300 hover:bg-btn-hover" onClick={joinRoom}>
        <Image src={Call}  alt="Call Button" className="w-[35px]"/>
      </button>}
    </div>
  );
}