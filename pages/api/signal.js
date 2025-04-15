import { Server } from 'socket.io';

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log('🧠 Socket.IO başlatılıyor...');

    const io = new Server(res.socket.server, {
      path: "/api/socketio",
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("✅ Yeni bağlantı");

      socket.on("offer", (data) => {
        socket.broadcast.emit("offer", data);
      });

      socket.on("answer", (data) => {
        socket.broadcast.emit("answer", data);
      });

      socket.on("candidate", (data) => {
        socket.broadcast.emit("candidate", data);
      });

      socket.on("disconnect", () => {
        console.log("❌ Kullanıcı ayrıldı");
      });
    });
  } else {
    console.log('⚠️ Socket.IO zaten çalışıyor.');
  }

  res.end();
}
