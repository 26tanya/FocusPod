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
const timerState = {}; // Track timer state per room

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

// ✅ Basic test route
app.get('/', (req, res) => res.send('🎯 FocusPod API Running'));

// ✅ SOCKET.IO - Group Room & Timer Support
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('join-room', (roomCode) => {
    socket.join(roomCode);
    console.log(`🟢 ${socket.id} joined room: ${roomCode}`);

    if (!usersInRooms[roomCode]) {
      usersInRooms[roomCode] = [];
    }

    if (!usersInRooms[roomCode].includes(socket.id)) {
      usersInRooms[roomCode].push(socket.id);
    }

    io.to(roomCode).emit('room-users', usersInRooms[roomCode]);
  });

  // ✅ Start Timer (New or Resume)
  socket.on('start-timer', (roomCode) => {
    if (!timerState[roomCode]) {
      // First time start
      timerState[roomCode] = {
        startTime: Date.now(),
        elapsedBeforePause: 0,
        isRunning: true,
      };
    } else {
      if (!timerState[roomCode].isRunning) {
        // Resume from pause
        timerState[roomCode].startTime = Date.now() - timerState[roomCode].elapsedBeforePause;
        timerState[roomCode].isRunning = true;
      }
      // If already running, do nothing or send current state again
    }

    io.to(roomCode).emit('start-timer', {
      startTime: timerState[roomCode].startTime,
    });
  });

  // ✅ Pause Timer
  socket.on('pause-timer', (roomCode) => {
    if (timerState[roomCode] && timerState[roomCode].isRunning) {
      timerState[roomCode].elapsedBeforePause = Date.now() - timerState[roomCode].startTime;
      timerState[roomCode].isRunning = false;
    }

    io.to(roomCode).emit('pause-timer');
  });

  // ✅ Reset Timer
  socket.on('reset-timer', (roomCode) => {
    timerState[roomCode] = {
      startTime: 0,
      elapsedBeforePause: 0,
      isRunning: false,
    };

    io.to(roomCode).emit('reset-timer');
  });

  // ✅ Optional: Stop timer event (custom, similar to pause)
  socket.on('stop-timer', (roomCode) => {
    if (timerState[roomCode]) {
      timerState[roomCode].isRunning = false;
    }
    io.to(roomCode).emit('stop-timer');
  });

  // ✅ Chat Messages
  socket.on('chat-message', ({ roomCode, message, sender }) => {
    console.log('📩 Chat message received:', { roomCode, message, sender });

    const chatData = {
      sender,
      message,
      timestamp: new Date().toISOString(),
    };

    io.to(roomCode).emit('chat-message', chatData);
  });

  // ✅ Handle Disconnection
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);

    for (const room in usersInRooms) {
      usersInRooms[room] = usersInRooms[room].filter(id => id !== socket.id);
      io.to(room).emit('room-users', usersInRooms[room]);
    }
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
