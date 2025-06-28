const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

const usersInRooms = {};
const timerState = {};
const roomDurations = {};
const rooms = {}; // ✅ Keep at top

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// ✅ Middlewares
app.use(cors());
app.use(express.json());

app.use(session({
  secret: 'focuspod_secret_key',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const roomRoutes = require('./routes/room');
app.use('/api/rooms', roomRoutes);

// ✅ Basic test route
app.get('/', (req, res) => res.send('🎯 FocusPod API Running'));

// ✅ SOCKET.IO
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('join-room', ({ roomCode, name, mode = 'pomodoro', duration = 1500, isCreator = false }) => {
    socket.join(roomCode);
    console.log(`🟢 ${name} (${socket.id}) joined room: ${roomCode}`);

    // ✅ Save creator on first join
    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        creatorId: socket.id,
        mode,
        duration: Number(duration),
      };
      console.log(`🌟 ${socket.id} is now creator of room: ${roomCode}`);
    }

    if (!usersInRooms[roomCode]) usersInRooms[roomCode] = [];

    const alreadyJoined = usersInRooms[roomCode].some(user => user.id === socket.id);
    if (!alreadyJoined) {
      usersInRooms[roomCode].push({ id: socket.id, name: name || 'Anon' });
    }

    io.to(roomCode).emit('room-users', usersInRooms[roomCode]);
    io.to(roomCode).emit('room-config', rooms[roomCode]);
  });

  // ✅ Chat
  socket.on('chat-message', ({ roomCode, message, sender }) => {
    const chatData = {
      sender,
      message,
      timestamp: new Date().toISOString(),
    };
    io.to(roomCode).emit('chat-message', chatData);
  });

  socket.on('typing', ({ roomCode, sender }) => {
    socket.to(roomCode).emit('typing', { sender });
  });

  // ✅ Timer: Only creator can control
  socket.on('start-timer', (roomCode) => {
    if (socket.id !== rooms[roomCode]?.creatorId) return;

    if (!timerState[roomCode]) {
      timerState[roomCode] = {
        startTime: Date.now(),
        elapsedBeforePause: 0,
        isRunning: true,
      };
    } else if (!timerState[roomCode].isRunning) {
      timerState[roomCode].startTime = Date.now() - timerState[roomCode].elapsedBeforePause;
      timerState[roomCode].isRunning = true;
    }

    io.to(roomCode).emit('start-timer', {
      startTime: timerState[roomCode].startTime,
    });
  });

  socket.on('pause-timer', (roomCode) => {
    if (socket.id !== rooms[roomCode]?.creatorId) return;

    if (timerState[roomCode]?.isRunning) {
      timerState[roomCode].elapsedBeforePause = Date.now() - timerState[roomCode].startTime;
      timerState[roomCode].isRunning = false;
    }

    io.to(roomCode).emit('pause-timer');
  });

  socket.on('reset-timer', (roomCode) => {
    if (socket.id !== rooms[roomCode]?.creatorId) return;

    timerState[roomCode] = {
      startTime: 0,
      elapsedBeforePause: 0,
      isRunning: false,
    };

    io.to(roomCode).emit('reset-timer');
  });

  socket.on('stop-timer', (roomCode) => {
    if (socket.id !== rooms[roomCode]?.creatorId) return;

    if (timerState[roomCode]) {
      timerState[roomCode].isRunning = false;
    }

    io.to(roomCode).emit('stop-timer');
  });

  // ✅ Set duration (optional feature if needed for custom changes)
  socket.on('set-duration', ({ roomCode, duration }) => {
    roomDurations[roomCode] = duration;
    io.to(roomCode).emit('set-duration', duration);
  });

  socket.on('get-duration', (roomCode) => {
    if (roomDurations[roomCode]) {
      socket.emit('send-duration', roomDurations[roomCode]);
    }
  });

  // ✅ Handle disconnect
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);

    for (const room in usersInRooms) {
      usersInRooms[room] = usersInRooms[room].filter(user => user.id !== socket.id);
      io.to(room).emit('room-users', usersInRooms[room]);

      // If the creator leaves, delete room (optional)
      if (rooms[room]?.creatorId === socket.id) {
        delete rooms[room];
        delete timerState[room];
        delete roomDurations[room];
        console.log(`🗑️ Room ${room} deleted (creator left)`);
      }
    }
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
