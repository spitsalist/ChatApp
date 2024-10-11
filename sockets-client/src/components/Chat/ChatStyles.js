
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  // max-width: 800px;
  margin: 0 auto;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: #ece5dd;

  @media (max-width: 600px) {
    max-width: 100%;
    padding: 10px;
  }
`;

export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; 
  padding: 10px 20px;
  width: 100%;
  background-color: #075e54;
  color: white;

  h2 {
    margin: 0;
    font-size: 20px;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #d9fdd3;
  }
`;

export const ChatWindow = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #ece5dd;
  overflow-y: auto;
`;

export const MessageContainer = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 15px;
  flex-direction: ${(props) => (props.$isOwn ? 'row-reverse' : 'row')};
  animation: ${fadeIn} 0.3s ease-in-out;
`;

export const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin: ${(props) => (props.$isOwn ? '0 0 0 10px' : '0 15px 0 0')};
`;

export const MessageBubble = styled.div`
  max-width: 95%;
  padding: 10px 15px;
  border-radius: 10px;
  background-color: ${(props) => (props.$isOwn ? '#dcf8c6' : '#fff')};
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    ${(props) => (props.$isOwn ? 'right: -10px;' : 'left: -9px;')}
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 10px solid transparent;
    border-${(props) => (props.$isOwn ? 'left' : 'right')}: 15px solid ${(props) => (props.$isOwn ? '#dcf8c6' : '#ffffff')};
  }
`;

export const MessageText = styled.p`
  margin: 0;
  font-size: 16px;
  color: #303030;
`;

export const Timestamp = styled.span`
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  text-align: ${(props) => (props.$isOwn ? 'right' : 'left')};
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 20px;
  background-color: #f0f0f0;
  // border-radius: 150px;
  position: relative; 
`;

export const TextInput = styled.input`
  flex: 1;
  padding: 10px 15px 10px 30px;
  border: none;
  border-radius: 10px;
  height: 35px;
  background-color: #ffffff;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: #999;
  }
`;

export const SendButton = styled.button`
  background-color: #075e54;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #128c7e;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const LeaveButton = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 50px; 
  
  &:hover {
    background-color: #c9302c;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const FileButton = styled.input`
  display: none;
`;

export const FileLabel = styled.label`
  position: absolute;
  right: 190px; 
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #333;
  font-size: 18px;

  &:hover {
    color: #075e54;
  }
`;

export const GifPickerContainer = styled.div`
  position: absolute;
  bottom: 70px;
  right: 20px;
  width: 350px;
  height: 350px;
  z-index: 1000;
  background-color: #ffffff;
  padding: 10px;
  padding-right: 25px;
  border: 1px solid #bdc3c7;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow-y: auto;
`;

export const SelectedFileContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f1f0f0;
  border-radius: 5px;
  padding: 5px;
  margin-left: 10px;
`;

export const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: #ff5c5c;
  margin-left: 5px;
  cursor: pointer;
  font-size: 1.2em;

  &:hover {
    color: #ff1c1c;
  }
`;