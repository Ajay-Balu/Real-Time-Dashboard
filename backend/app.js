const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketio = require('socket.io');
const sortedData =require('./models/data')

const app = express();
app.use(cors()); 

mongoose.connect('mongodb://localhost:27017/dataset');
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
  populateDatabase();
});

async function populateDatabase() {
  try {
    await Data.deleteMany({});
    await Data.insertMany(sortedData);
    console.log('Database populated successfully');
  } catch (err) {
    console.error('Error populating database', err);
  }
}

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

const messageSchema = mongoose.Schema({
  key: { type: String, default: Date.now },
  userName: { type: String, required: true },
  text: { type: String, required: true }
});
const Message = mongoose.model('Message', messageSchema);

const dataSchema = new mongoose.Schema({
  Date: String,
  State: String,
  TotalSamples: Number,
  Negative: Number,
  Positive: Number
});

const Data = mongoose.model('Data', dataSchema);



const server = app.listen(5000, () => {
  console.log('Listening on port 5000');
});
const io = socketio(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket) => {
  emitExistingMessages(socket);

  socket.on('newMessage', async msg => {
    const message = new Message({
      userName: msg.userName,
      text: msg.text,
      key: msg.key 
    });
  
    await message.save();
  
    io.emit('message', msg);
  });

  const changeStream = Message.watch();
  changeStream.on('change', async change => {
    if (change.operationType === 'insert') {
      const newMessage = change.fullDocument;
      io.emit('message', newMessage);
    } else if (change.operationType === 'update') {
      const updatedMessage = change.fullDocument;
      io.emit('updateMessage', updatedMessage);
    } else if (change.operationType === 'delete') {
      const deletedMessageId = change.documentKey._id;
      io.emit('deleteMessage', deletedMessageId);
    }
  });

  const emitData = async () => {
    try {
      const data = await Data.find();
      if (data.length > 0) {
        socket.emit('data', data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  emitData();
  // socket.on('disconnect', () => {
    
  //   console.log('Client disconnected');
  // });
});

app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

async function emitExistingMessages(socket) {
  try {
    const messages = await Message.find();
    socket.emit('initialMessages', messages);
  } catch (error) {
    console.error('Error emitting existing messages:', error);
  }
}
