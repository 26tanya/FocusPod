const express = require('express');
const router = express.Router();
const Session = require('../models/SessionLog');

console.log('Progress routes loaded');
// 🕒 Total time studied today + session count
router.get('/today/:userId', async (req, res) => {
  const { userId } = req.params;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  try {
    const sessions = await Session.find({
      userId,
      date: { $gte: startOfDay },
    });

    const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
    const sessionCount = sessions.length;

    res.json({ totalMinutes, sessionCount });
  } catch (err) {
    console.error('Error fetching today’s progress:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 📊 Weekly chart data
router.get('/weekly/:userId', async (req, res) => {
  const { userId } = req.params;
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 6);
  oneWeekAgo.setHours(0, 0, 0, 0);

  try {
    const sessions = await Session.find({
      userId,
      date: { $gte: oneWeekAgo },
    });

    const dailyTotals = {};

    sessions.forEach((session) => {
      const dateKey = session.date.toISOString().split('T')[0]; // YYYY-MM-DD
      dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + session.duration;
    });

    res.json({ dailyTotals });
  } catch (err) {
    console.error('Error fetching weekly progress:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ➕ Log a session
router.post('/log', async (req, res) => {
  const { userId, duration } = req.body;

  try {
    const newSession = new Session({ userId, duration });
    await newSession.save();
    res.status(201).json({ message: 'Session logged successfully' });
  } catch (err) {
    console.error('Error saving session log:', err);
    res.status(500).json({ error: 'Failed to save session log' });
  }
});

module.exports = router;
