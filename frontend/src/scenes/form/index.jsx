import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Header from "../../components/Header";

const socket = io('http://localhost:5000');

function ChatPage() {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  
  const sendMessage = () => {
    socket.emit('newMessage', {
      userName: username,
      text: message,
    });

    setMessage('');
  };

  useEffect(() => {
    // Fetch previous messages from the server when the component mounts
    fetchExistingMessages();

    // Listen for messages from server
    socket.on('message', handleMessage);
    socket.on('updateMessage', handleUpdateMessage);
    socket.on('deleteMessage', handleDeleteMessage);

    // Clean up
    return () => {
      socket.off('message', handleMessage);
      socket.off('updateMessage', handleUpdateMessage);
      socket.off('deleteMessage', handleDeleteMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to fetch existing messages from server
  async function fetchExistingMessages() {
    try {
      const response = await fetch('http://localhost:5000/messages');
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching existing messages:', error);
    }
  }

  // Handle new message from server
  function handleMessage(receivedMessage) {
    setMessages(previousMessages => {
      // Check if the message already exists in state to avoid duplicates
      if (!previousMessages.some(msg => msg._id === receivedMessage._id)) {
        return [...previousMessages, receivedMessage];
      }
      return previousMessages;
    });
  }

  function handleUpdateMessage(updatedMessage) {
    setMessages(previousMessages =>
      previousMessages.map(msg =>
        msg._id === updatedMessage._id ? updatedMessage : msg
      )
    );
  }

  function handleDeleteMessage(deletedMessageId) {
    setMessages(previousMessages =>
      previousMessages.filter(msg => msg._id !== deletedMessageId)
    );
  }

  return (
    <Box m="20px">
      <Header title="CHAT PAGE" subtitle="Real-time Chat Application" />

      
          <form>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                marginLeft:'20px'
              }}
            >
              {/* Display the chat messages */}
              <Box 
              gridColumn="span 12"
              border="1px solid"
              sx={{
                height: '250px',
                width: '90%',
                overflow: 'auto',
                border: '1px solid #ccc',
                padding: '10px'

              }}>
                {messages.map(message => (
                  <div key={message._id} className="message">
                    <strong style={{color: '#ffff00'}}>{message.userName}:</strong> {message.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </Box>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                placeholder="Username"
                onChange={e => setUsername(e.target.value)}
                value={username}
                name="username"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                placeholder="Type your message here"
                value={message}
                onChange={e => setMessage(e.target.value)} 
                name="message"
                sx={{ gridColumn: "span 6" }}
              />
              <Button
                color="secondary"
                variant="contained"
                onClick={sendMessage}
                sx={{ gridColumn: "span 1", height: "97%" }}
              >
                Send
              </Button>
            </Box>
          </form>
    </Box>
  );
};
export default ChatPage;
