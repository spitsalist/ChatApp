import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { ChatContainer, ChatHeader, ChatWindow, LeaveButton, TextInput, SendButton } from './ChatStyles';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

function Chat() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [usersOnline, setUsersOnline] = useState(0);
  const [joined, setJoined] = useState(false);
  const socketRef = useRef();
  const [avatarFile, setAvatarFile] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const joinRoom = () => {
    if (name.trim() !== '' && room.trim() !== '') {
      if (avatarFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Avatar = reader.result.split(',')[1];
          socketRef.current.emit('joinRoom', { name, room, avatar: base64Avatar });
          setJoined(true);
        };
        reader.readAsDataURL(avatarFile);
      } else {
        socketRef.current.emit('joinRoom', { name, room });
        setJoined(true);
      }
    } else {
      alert('Please enter your name and room.');
    }
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit('leaveRoom');
      socketRef.current.disconnect();
    }
    setJoined(false);
    setMessages([]);
    setUsersOnline(0);
    setName('');
    setRoom('');
  };

  useEffect(() => {
    const newSocket = io.connect('http://localhost:4002');
    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (joined) {
      const socket = socketRef.current;

      socket.emit('joinRoom', { name, room });

      socket.on('messageHistory', (msgs) => {
        const processedMessages = msgs.map(msg => ({
          ...msg,
          file: msg.file ? `data:application/octet-stream;base64,${msg.file}` : null,
        }));
        setMessages(processedMessages);
      });

      socket.on('message', (data) => {
        if (data.message || data.gifUrl || data.file) {
          setMessages((prev) => [...prev, data]);
        }
      });

      socket.on('userUpdate', (userCount) => {
        setUsersOnline(userCount);
      });

      socket.on('fileReceived', ({ user, file, fileName, timestamp }) => {
        const fileURL = `data:application/octet-stream;base64,${file}`;
        setMessages((prev) => [...prev, { user, file: fileURL, fileName, timestamp }]);
      });

      return () => {
        socket.off('messageHistory');
        socket.off('message');
        socket.off('userUpdate');
        socket.off('fileReceived');
      };
    }
  }, [joined, name, room]);

  return (
    <ChatContainer>
      {!joined ? (
        <div style={{ padding: '20px' }}>
          <ChatHeader>
            <h2>Join Chat</h2>
          </ChatHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px 0' }}>
            <TextInput
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextInput
              type="text"
              placeholder="Room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            <SendButton onClick={joinRoom} style={{ width: '100%', borderRadius: '5px' }}>
              Join
            </SendButton>
          </div>
        </div>
      ) : (
        <>
          <ChatHeader>
            <div>
              <h2>Room: {room}</h2>
              <p>Users Online: {usersOnline}</p>
            </div>
            <LeaveButton onClick={leaveRoom}>
              Leave
            </LeaveButton>
          </ChatHeader>
          <ChatWindow>
            <MessageList messages={messages} currentUserName={name} />
          </ChatWindow>
          <ChatInput socket={socketRef.current} setMessages={setMessages} />
        </>
      )}
    </ChatContainer>
  );
}

export default Chat;
