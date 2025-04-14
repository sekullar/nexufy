import { io } from 'socket.io-client'

let socket

export const initSocket = () => {
  if (!socket) {
    socket = io({
      path: '/api/socket_io',
    })

    socket.on('connect', () => {
      console.log('🟢 Bağlandı:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('🔴 Bağlantı kesildi')
    })
  }

  return socket
}

export const getSocket = () => socket
