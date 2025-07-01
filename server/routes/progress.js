const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Session = require('../models/SessionLog');

const ObjectId = mongoose.Types.ObjectId;

console.log('📈 Progress routes loaded');

// 📆 Heatmap activity calendar (last 6 months)
router.get('/calendar/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  try {
    const sessions = await Session.aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
          date: { $gte: sixMonthsAgo },
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json(sessions);
  } catch (err) {
    console.error('❌ Error fetching heatmap calendar:', err);
    res.status(500).json({ error: 'Failed to fetch calendar data' });
  }
});

// 🕒 Total time studied today + session count
router.get('/today/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

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
    console.error('❌ Error fetching today’s progress:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 📊 Weekly chart data
router.get('/weekly/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

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
    console.error('❌ Error fetching weekly progress:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ➕ Log a session
router.post('/log', async (req, res) => {
  const { userId, duration } = req.body;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const newSession = new Session({ userId, duration });
    await newSession.save();
    res.status(201).json({ message: 'Session logged successfully' });
  } catch (err) {
    console.error('❌ Error saving session log:', err);
    res.status(500).json({ error: 'Failed to save session log' });
  }
});

module.exports = router;
