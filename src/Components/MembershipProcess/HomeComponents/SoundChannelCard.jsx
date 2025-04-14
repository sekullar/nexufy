import { useState } from 'react'
import { initSocket, getSocket } from '@/lib/socket'
import { createPeer } from '@/lib/peer'

export default function SoundChannelCard({ channelId, userId }) {
  const [joined, setJoined] = useState(false)

  const handleJoin = async () => {
    if (joined) return

    const socket = initSocket()

    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

    const peer = createPeer(true, mediaStream, (signal) => {
      socket.emit('signal', {
        to: channelId, // burayı userId ile eşleyeceğiz sonra
        from: userId,
        signal,
      })
    }, (remoteStream) => {
      const audio = document.createElement('audio')
      audio.srcObject = remoteStream
      audio.autoplay = true
      document.body.appendChild(audio)
    })

    socket.emit('join-room', channelId, userId)

    socket.on('user-joined', (otherUserId) => {
      console.log(`Yeni biri katıldı: ${otherUserId}`)
      // karşı taraf peer açar (initiator: false)
    })

    socket.on('signal', ({ from, signal }) => {
      console.log(`Signal alındı: ${from}`)
      peer.signal(signal)
    })

    setJoined(true)
  }

  return (
    <div onClick={handleJoin} className="cursor-pointer p-2 bg-gray-800 rounded">
      {joined ? '🎤 Bağlısın' : '🔈 Bağlan'} - Kanal {channelId}
    </div>
  )
}
