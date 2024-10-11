import React, { useState } from 'react';
import { FaPaperPlane, FaSmile, FaPaperclip, FaTimes, FaFile } from 'react-icons/fa';
import { MdGif } from 'react-icons/md';
import EmojiPicker from 'emoji-picker-react';

import GifPicker from './GifPicker';
import { InputContainer, TextInput, SendButton, FileButton, FileLabel, SelectedFileContainer, RemoveFileButton, GifPickerContainer } from './ChatStyles';

function ChatInput({ socket }) {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const sendMessage = async () => {
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const dataURL = fileReader.result;
        const base64File = dataURL.split(',')[1];

        if (socket) {
          socket.emit('sendFile', {
            file: base64File,
            fileName: selectedFile.name,
          });
        }
        setSelectedFile(null);
      };

      fileReader.readAsDataURL(selectedFile);
    }

    if (message.trim()) {
      socket.emit('sendMessage', { message });
      setMessage('');
    }

    setShowEmojiPicker(false);
    setShowGifPicker(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'txt', 'rtx'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

      if (!allowedExtensions.includes(fileExtension)) {
        setErrorMessage('Unsupported file type.');
        return;
      } else if (file.size > MAX_FILE_SIZE) {
        setErrorMessage('File size exceeds the 10MB limit.');
        return;
      } else {
        setErrorMessage('');
      }

      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleEmojiClick = (emojiData, event) => {
    if (emojiData && emojiData.emoji) {
      setMessage((prevMessage) => prevMessage + emojiData.emoji);
    }
  };

  return (
    <InputContainer>
      <FileButton type="file" id="file-input" onChange={handleFileChange} />
      <FileLabel htmlFor="file-input">
        <FaPaperclip />
      </FileLabel>

      {selectedFile && (
        <SelectedFileContainer>
          {selectedFile.type.startsWith('image/') ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected"
              style={{ width: '50px', height: '50px', marginRight: '10px', objectFit: 'cover' }}
            />
          ) : (
            <FaFile style={{ marginRight: '5px' }} />
          )}
          <span>{selectedFile.name}</span>
          <RemoveFileButton onClick={removeSelectedFile}>
            <FaTimes />
          </RemoveFileButton>
        </SelectedFileContainer>
      )}

      {errorMessage && (
        <div style={{ color: 'red', marginLeft: '10px' }}>
          {errorMessage}
        </div>
      )}

      <TextInput
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />

      <SendButton onClick={sendMessage}>
        <FaPaperPlane />
      </SendButton>
      <SendButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        <FaSmile />
      </SendButton>
      <SendButton onClick={() => setShowGifPicker(!showGifPicker)}>
        <MdGif />
      </SendButton>

      {showEmojiPicker && (
  <div style={{ position: 'absolute', bottom: '60px', right: '20px' }}>
  <EmojiPicker onEmojiClick={handleEmojiClick} />
</div>      )}
{showGifPicker && (
  <GifPickerContainer>
    <GifPicker socket={socket} setShowGifPicker={setShowGifPicker} />
  </GifPickerContainer>
)}
    </InputContainer>
  );
}

export default ChatInput;