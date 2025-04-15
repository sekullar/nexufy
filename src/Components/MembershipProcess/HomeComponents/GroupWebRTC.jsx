import { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function Home() {
  const socketRef = useRef();
  const peerRef = useRef();
  const localStreamRef = useRef();

  useEffect(() => {
    // Socket bağlantısı başlat
    socketRef.current = io("http://localhost:3000", {
      path: "/api/signal",
    });

    // Sunucuya bağlandığında log bas
    socketRef.current.on("connect", () => {
      console.log("✅ Socket'e bağlandı.");
    });

    // Offer alındığında...
    socketRef.current.on("offer", async (offer) => {
      if (!peerRef.current) await createPeer();

      await peerRef.current.setRemoteDescription(offer);
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      socketRef.current.emit("answer", answer);
    });

    // Answer alındığında...
    socketRef.current.on("answer", (answer) => {
      peerRef.current.setRemoteDescription(answer);
    });

    // Candidate alındığında...
    socketRef.current.on("candidate", (candidate) => {
      peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }, []);

  const createPeer = async () => {
    peerRef.current = new RTCPeerConnection();

    peerRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("candidate", event.candidate);
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    localStreamRef.current = stream;

    stream.getTracks().forEach((track) => {
      peerRef.current.addTrack(track, stream);
    });
  };

  const startCall = async () => {
    await createPeer();

    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);
    socketRef.current.emit("offer", offer);
  };

  return (
    <div>
      <h1>WebRTC Sesli Sohbet</h1>
      <button onClick={startCall}>Başla</button>
    </div>
  );
}
