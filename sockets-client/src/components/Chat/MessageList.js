import React, { useEffect, useRef } from 'react';
import { MessageContainer, MessageBubble, Avatar, Timestamp, MessageText } from './ChatStyles';

function MessageList({ messages, currentUserName }) {
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {messages.map((msg, i) => (
        <MessageContainer key={i} $isOwn={msg.user === currentUserName}>
          <Avatar
            src={msg.avatar ? `data:image/jpeg;base64,${msg.avatar}` : '/avatars/default.jpeg'}
            alt={`${msg.user}'s avatar`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/avatars/default.jpeg';
            }}
            $isOwn={msg.user === currentUserName}
          />
          <MessageBubble $isOwn={msg.user === currentUserName}>
            {msg.message && <MessageText>{msg.message}</MessageText>}
            {msg.file && (
              <div>
                <a href={msg.file} download={msg.fileName}>
                  Download file: {msg.fileName}
                </a>
              </div>
            )}
            <Timestamp $isOwn={msg.user === currentUserName}>{msg.timestamp}</Timestamp>
          </MessageBubble>
        </MessageContainer>
      ))}
      <div ref={chatEndRef} />
    </>
  );
}

export default MessageList;