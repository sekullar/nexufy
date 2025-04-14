import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const GroupWebRTC = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
  const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Odadaki herkes için peer bağlantılarını tutacağız: { [userId]: RTCPeerConnection }
  const [peerConnections, setPeerConnections] = useState({});
  const [localStream, setLocalStream] = useState(null);
  const localAudioRef = useRef(null);
  const [roomId] = useState('group-room-1');  // sabit oda, daha sonra dinamik yap
  const [currentUser] = useState('userA');  // örn; userA, userB, userC vs.
  const remoteAudioContainerRef = useRef(null);

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
    ],
  };

  // Supabase realtime verisiyle sinyal mesajlarını dinleyip al
  useEffect(() => {
    const channel = supabase.channel('realtime-signaling')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'signaling',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const { type, data, sender, recipient } = payload.new;

          // Eğer mesaj kendimizden geldiyse veya eğer belirtilmişse ve bizim recipient değilsek atla
          if (sender === currentUser || (recipient && recipient !== currentUser)) return;

          if (type === 'offer') {
            handleOffer(data, sender);
          } else if (type === 'answer') {
            handleAnswer(data, sender);
          } else if (type === 'candidate') {
            handleCandidate(data, sender);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [peerConnections, roomId, currentUser, localStream]);

  // Signaling mesajını Supabase üzerinden gönderme
  const sendSignal = async (recipient, type, data) => {
    try {
      await supabase
        .from('signaling')
        .insert([{ room_id: roomId, sender: currentUser, recipient, type, data }]);
      console.log('Signal gönderildi:', { recipient, type, data });
    } catch (error) {
      console.error('Signal gönderme hatası:', error);
    }
  };

  // Yeni bir peer connection oluştur
  const createPeerConnection = (otherUserId) => {
    const pc = new RTCPeerConnection(iceServers);

    // Yerel stream varsa ekle
    if (localStream) {
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    } else {
      console.error('Yerel stream bulunamadı.');
    }

    // ICE adayı gönderimi
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Yeni ICE adayı:', event.candidate);
        sendSignal(otherUserId, 'candidate', event.candidate);
      }
    };

    // Uzak sesi almak
    pc.ontrack = (event) => {
      let audioEl = document.getElementById(`remote-audio-${otherUserId}`);
      if (!audioEl) {
        audioEl = document.createElement('audio');
        audioEl.id = `remote-audio-${otherUserId}`;
        audioEl.autoplay = true;
        audioEl.controls = true;
        if (remoteAudioContainerRef.current) {
          remoteAudioContainerRef.current.appendChild(audioEl);
        }
      }
      console.log('Uzak stream alındı:', event.streams[0]);
      audioEl.srcObject = event.streams[0];
    };

    return pc;
  };

  // Offer geldiğinde
  const handleOffer = async (offer, senderId) => {
    // Eğer zaten bir peerConnection yoksa oluştur
    let pc = peerConnections[senderId];
    if (!pc) {
      pc = createPeerConnection(senderId);
      setPeerConnections((prev) => ({ ...prev, [senderId]: pc }));
    }
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    sendSignal(senderId, 'answer', answer);
  };

  // Answer geldiğinde
  const handleAnswer = async (answer, senderId) => {
    const pc = peerConnections[senderId];
    if (pc) {
      await pc.setRemoteDescription(answer);
    }
  };

  // ICE adayı geldiğinde
  const handleCandidate = async (candidate, senderId) => {
    const pc = peerConnections[senderId];
    if (pc) {
      try {
        await pc.addIceCandidate(candidate);
      } catch (err) {
        console.error('ICE adayı eklenirken hata:', err);
      }
    }
  };

  // Grup çağrısını başlat
  const startGroupCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });  // sadece ses için istek
      setLocalStream(stream);
      if(localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }
  
      // Diğer kullanıcıları burada işle
      const otherUsers = ["userB", "userC"];
      otherUsers.forEach(async (otherUserId) => {
        const pc = createPeerConnection(otherUserId);
        setPeerConnections(prev => ({ ...prev, [otherUserId]: pc }));
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendSignal(otherUserId, "offer", offer);
      });
    } catch (err) {
      console.error("Medyayı alırken hata:", err);
      alert("Mikrofon erişimi reddedildi veya cihazda mikrofon bulunamadı.");
    }
  };
  
  // Çağrıyı bitir
  const endCall = () => {
    Object.values(peerConnections).forEach((pc) => pc.close());
    setPeerConnections({});
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setLocalStream(null);
  };

  return (
    <div>
      <h2>Grup Sesli Çağrı (Oda: {roomId})</h2>
      <button onClick={startGroupCall}>Grup Çağrısını Başlat</button>
      <button onClick={endCall}>Çağrıyı Bitir</button>

      <div>
        <h3>Yerel Ses</h3>
        <audio ref={localAudioRef} autoPlay muted></audio>
      </div>
      <div ref={remoteAudioContainerRef}>
        <h3>Uzak Sesler</h3>
        {/* Uzak sesler otomatik eklenir */}
      </div>
    </div>
  );
};

export default GroupWebRTC;
