import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

export default function Home({ innerTrigger }) {
  const socketRef = useRef();
  const peerRef = useRef();
  const localStreamRef = useRef();

  const [startCallTrigger,setStartCallTrigger] = useState(0);

  useEffect(() => {
    setStartCallTrigger(innerTrigger)
    startCall();
  }, [startCallTrigger,innerTrigger])

  useEffect(() => {
    // ✅ Socket bağlantısı başlat
    socketRef.current = io("https://nexufy-socket-server.onrender.com", {
      path: "/api/signal",
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Socket'e bağlandı.");
    });

    socketRef.current.on("offer", async (offer) => {
      console.log("🟡 Offer alındı:", offer);
      if (peerRef.current) return peerRef.current;
      if (!peerRef.current) await createPeer();

      await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      socketRef.current.emit("answer", answer);
    });

    socketRef.current.on("answer", async (answer) => {
      console.log("🟢 Answer alındı:", answer);
      if (peerRef.current) {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socketRef.current.on("candidate", async (candidate) => {
      console.log("❄️ Yeni ICE candidate alındı:", candidate);
      if (peerRef.current) {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Socket bağlantı hatası:", err);
    });
  }, []);

  const createPeer = async () => {
    peerRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("candidate", event.candidate);
      }
    };

    peerRef.current.ontrack = (event) => {
      console.log("📡 Track alındı");

      const remoteStream = event.streams[0];
      const audioElement = document.createElement("audio");
      audioElement.srcObject = remoteStream;
      audioElement.autoplay = true;
      audioElement.controls = true;
      document.body.appendChild(audioElement);
    };

    peerRef.current.oniceconnectionstatechange = () => {
      console.log("🔄 ICE Durumu:", peerRef.current.iceConnectionState);
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    localStreamRef.current = stream;

    stream.getTracks().forEach((track) => {
      peerRef.current.addTrack(track, stream);
    });
  };

  const startCall = async () => {
    if(startCallTrigger != 0){
      await createPeer();
      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);
      socketRef.current.emit("offer", offer);
      setStartCallTrigger(0);
    }
   
  };

  return (
    <div>
      <h1>🎙️ WebRTC Sesli Sohbet</h1>
      <button onClick={startCall}>🟢 Başla</button>
    </div>
  );
}
