const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  creator: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
  },
  mode: {
    type: String,
    enum: ['pomodoro', 'custom'],
    default: 'custom',
  },
  customDuration: {
    type: Number, // in minutes
    default: 25,
  },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
