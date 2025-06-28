const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Create Room
router.post('/create', async (req, res) => {
  const { code, creator, mode, customDuration } = req.body;

  try {
    const existing = await Room.findOne({ code });
    if (existing) return res.status(400).json({ error: 'Room code already exists' });

    const room = new Room({
      code,
      creator,
      mode,
      customDuration: mode === 'custom' ? customDuration : 25,
    });

    await room.save();
    res.status(201).json({ message: 'Room created', room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while creating room' });
  }
});

module.exports = router;
