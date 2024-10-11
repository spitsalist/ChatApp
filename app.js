import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { setupSocket } from './handlers/socketHandlers.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  perMessageDeflate: false,
  maxHttpBufferSize: 1e8, // 100 MB
});

const port = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

server.listen(port, async () => {
  try {
    await connectDB()
    console.log(`Server is running on port: ${port}`);
    setupSocket(io);

  } catch (error) {
    console.log(`Internal Server Error 500: ${error}`);
  }
});