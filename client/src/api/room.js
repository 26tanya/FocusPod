import axios from 'axios';

export const createRoom = async ({ code, creator, mode, customDuration }) => {
  try {
    const res = await axios.post('/api/rooms/create', {
      code,
      creator, // full object: { id, name, email }
      mode,
      customDuration,
    });

    console.log('✅ Room created in DB:', res.data.room);
    return res.data.room;
  } catch (err) {
    console.error('❌ Error creating room:', err.response?.data || err.message);
    throw err;
  }
};
