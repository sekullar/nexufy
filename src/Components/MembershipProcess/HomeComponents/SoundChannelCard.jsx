import { useState, useEffect, useRef } from 'react';

const WebRTC = () => {
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const remoteAudioRef = useRef(null);
  const localAudioRef = useRef(null);

  // STUN sunucusu
  const iceServers = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302', // Google'ın STUN sunucusu
      },
    ],
  };

  // Kullanıcıdan ses almak
  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);

      const peerConn = new RTCPeerConnection(iceServers);
      stream.getTracks().forEach(track => peerConn.addTrack(track, stream));

      // Remote stream'i almak için
      peerConn.ontrack = event => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
      };

      // ICE Candidate'ları alıyoruz
      peerConn.onicecandidate = event => {
        if (event.candidate) {
          console.log('New ICE candidate:', event.candidate);
        }
      };

      const offer = await peerConn.createOffer();
      await peerConn.setLocalDescription(offer);

      // Burada signaling işlemi yapman gerekiyor (Supabase veya WebSockets kullanabilirsin)
      // Örneğin: signalingChannel.send(offer);

      setPeerConnection(peerConn);

      // Local stream'i oynat
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }

      setIsCallStarted(true);
    } catch (err) {
      console.error('Kullanıcı medyasını alırken hata:', err);
    }
  };

  const endCall = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setIsCallStarted(false);
  };

  return (
    <div>
      <h2>WebRTC Sesli Sohbet</h2>
      {!isCallStarted ? (
        <button onClick={startCall}>Aramaya Başla</button>
      ) : (
        <button onClick={endCall}>Aramayı Bitir</button>
      )}
      <div>
        <h3>Yerel Ses</h3>
        <audio ref={localAudioRef} autoPlay muted></audio>
      </div>
      <div>
        <h3>Uzak Ses</h3>
        <audio ref={remoteAudioRef} autoPlay></audio>
      </div>
    </div>
  );
};

export default WebRTC;
