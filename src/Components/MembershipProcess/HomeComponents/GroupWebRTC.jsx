import { useRef, useState, useEffect } from "react";
import io from "socket.io-client";

export default function Home() {
  const [roomId, setRoomId] = useState("genel");
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({}); // Birden fazla peer olacak

  const createPeer = (userId, initiator = false) => {
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

    localStreamRef.current.getTracks().forEach((track) => {
      peer.addTrack(track, localStreamRef.current);
    });

    peersRef.current[userId] = peer;

    return peer;
  };

  const joinRoom = async () => {
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

      socketRef.current.emit("join-room", roomId);
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
      const peer = createPeer(from, false);
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socketRef.current.emit("answer", { target: from, answer });
    });

    socketRef.current.on("answer", async ({ from, answer }) => {
      console.log("📩 Answer geldi:", from);
      const peer = peersRef.current[from];
      await peer.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socketRef.current.on("candidate", async ({ from, candidate }) => {
      console.log("🧊 ICE geldi:", from);
      const peer = peersRef.current[from];
      if (peer) {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
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

  return (
    <div>
      <h1>🎙️ Oda: {roomId}</h1>
      <button onClick={joinRoom}>🔊 Odaya Katıl</button>
    </div>
  );
}
