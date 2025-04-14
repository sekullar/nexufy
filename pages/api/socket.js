import { Server } from 'socket.io'

// Next.js özel config – bodyParser'ı kapatıyoruz çünkü Socket.IO raw HTTP kullanır
export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log('🔌 İlk kez Socket.IO başlatılıyor...')

    const io = new Server(res.socket.server, {
      path: '/api/socket_io',
      addTrailingSlash: false,
    })

    io.on('connection', (socket) => {
      console.log('✅ Socket bağlı: ', socket.id)

      // Odaya katılınca
      socket.on('join-room', (roomId, userId) => {
        console.log(`📥 ${userId} -> ${roomId} odasına katıldı`)
        socket.join(roomId)
        socket.to(roomId).emit('user-joined', userId)
      })

      // Signal gönderme
      socket.on('signal', ({ to, from, signal }) => {
        console.log(`📡 Signal: ${from} -> ${to}`)
        io.to(to).emit('signal', { from, signal })
      })

      // Odadan ayrılınca veya bağlantı kesilince
      socket.on('disconnect', () => {
        console.log('❌ Socket bağlantısı koptu: ', socket.id)
      })
    })

    res.socket.server.io = io
  } else {
    console.log('🔁 Socket.IO zaten başlatılmış')
  }

  res.end()
}
