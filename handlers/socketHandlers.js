import { Message } from '../models/message.js';

const userDetails = {};

export function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('joinRoom', async ({ name, room, avatar }) => {
      if (!name || !room) {
        socket.emit('error', { message: 'Name and room are required to join.' });
        return;
      }
      socket.join(room);
      userDetails[socket.id] = { name, room, avatar };

      const joinMessage = {
        user: `${name}`,
        message: `${name} has joined the room.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      io.to(room).emit('message', joinMessage);

      const usersInRoom = Array.from(io.sockets.adapter.rooms.get(room) || []).length;
      io.to(room).emit('userUpdate', usersInRoom);

      try {
        const messages = await Message.find({ room }).sort({ createdAt: 1 });
        const messagesWithBase64 = messages.map((msg) => ({
          ...msg.toObject(),
          file: msg.file ? msg.file.toString('base64') : null,
        }));
        socket.emit('messageHistory', messagesWithBase64);
      } catch (err) {
        console.error('Error fetching message history:', err.message);
      }
    });

    socket.on('sendMessage', async ({ message, gifUrl }) => {
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
    });

    socket.on('sendFile', async ({ file, fileName }) => {
      const user = userDetails[socket.id];
      if (user && user.room && file && fileName) {
        const room = user.room;
        try {
          const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.txt', '.rtf'];
          const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
          if (!allowedExtensions.includes(extension)) {
            throw new Error('Unsupported file type.');
          }

          const msg = new Message({
            user: user.name,
            file,
            fileName,
            room,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });

          await msg.save();

          io.to(room).emit('fileReceived', msg);
          console.log(`File from ${user.name} in room ${room}: ${fileName}`);
        } catch (error) {
          console.error('Error handling sendFile:', error.message);
          socket.emit('error', { message: error.message });
        }
      } else {
        console.error('sendFile: Missing data.', {
          user,
          room: user ? user.room : null,
          file: !!file,
          fileName,
        });
        socket.emit('error', { message: 'Failed to send file.' });
      }
    });

    socket.on('disconnect', () => {
      const user = userDetails[socket.id];
      if (user) {
        const { name, room } = user;
        socket.leave(room);
        delete userDetails[socket.id];
        console.log(`User disconnected: ${name} from room ${room}`);

        const leaveMessage = {
          user: `${name}`,
          message: `${name} has left the chat.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        io.to(room).emit('message', leaveMessage);

        const usersInRoom = Array.from(io.sockets.adapter.rooms.get(room) || []).length;
        io.to(room).emit('userUpdate', usersInRoom);
      } else {
        console.log('User disconnected:', socket.id);
      }
    });
  });
}