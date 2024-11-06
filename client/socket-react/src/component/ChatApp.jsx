import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      socket.emit('message', messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-lg'>
        <h1 className='text-2xl font-semibold text-center text-gray-800 mb-4'>
          Chat App
        </h1>

        <div className='mb-4 h-64 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200'>
          {messages.length === 0 ? (
            <p className='text-center text-gray-400'>No messages yet</p>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className='p-2 my-1 bg-blue-100 text-blue-900 rounded-lg'
              >
                {message}
              </div>
            ))
          )}
        </div>

        <div className='flex items-center space-x-2'>
          <input
            type='text'
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder='Type your message...'
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            onClick={sendMessage}
            className='bg-slate-400 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none'
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
