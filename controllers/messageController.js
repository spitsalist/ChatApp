import { Message } from '../models/message.js';

export const sendMessage = async (io, socket, data, userDetails) => {
  const { message, gifUrl } = data;
  const user = userDetails[socket.id];
  if (user && user.room) {
    const room = user.room;
    const msg = new Message({
      user: user.name,
      message,
      gifUrl,
      avatar: user.avatar,
      room,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    try {
      await msg.save();
      io.to(room).emit('message', msg);
      console.log(`Message from ${user.name} in room ${room}: ${message}`);
    } catch (error) {
      console.error('Error saving message:', error.message);
      socket.emit('error', { message: 'Cannot send the message.' });
    }
  } else {
    console.error('sendMessage: User or room not found.');
    socket.emit('error', { message: 'Cannot send the message.' });
  }
};