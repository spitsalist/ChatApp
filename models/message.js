import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, 'Name required.'],
  },
  message: {
    type: String,
    trim: true,
  },
  gifUrl: {
    type: String,
  },
  avatar: {
    type: String
  },
  file: {
    type: Buffer, 
  },
  fileName: {
    type: String,
  },
  room: {
    type: String,
    required: [true, 'Room required.'],
  },
  timestamp: {
    type: String, 
    required: true,
  },
}, {
  timestamps: true,
});

export const Message = mongoose.model('Message', MessageSchema);

export default Message;