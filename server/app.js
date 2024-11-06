import express from 'express';
// Socket.IO is an event-driven library for real-time web applications. It enables real-time, bi-directional communication between web clients and servers. It consists of two components: a client, and a server. Both components have a nearly identical API.
// Bidirectional and low-latency communication for every platform
// Server- its a Class from socket.io
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const secretKeyJWT = 'navas123456789';
const port = 8000;

const app = express();
const server = createServer(app);
// io: A new Socket.IO server instance attached to the HTTP server.
// cors middleware is configured for both Express and Socket.IO.
// const io = new Server(server)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/login', (req, res) => {
  const token = jwt.sign({ _id: '12345' }, secretKeyJWT);
  //The cookie is configured to be httpOnly (accessible only by the server), secure (sent only over HTTPS), and sameSite: 'none' (allow cross-site requests).

  res
    .cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' })
    .json({
      message: 'Login Success',
    });
});
// io.use defines middleware that runs before any Socket.IO connection is established.
// Inside the middleware, cookieParser is used to parse cookies from the incoming request.
// io.use((socket, next) => {
//   cookieParser()(socket.request, socket.request.res, (err) => {
//     if (err) return next(err);

//     const token = socket.request.cookies.token;
//     if (!token) return next(new Error('Authentication Error'));
//     // If the token is valid, the middleware allows the connection to proceed.
//     const decoded = jwt.verify(token, secretKeyJWT);
//     next();
//   });
// });

// In Socket.IO, io.on() is used to listen for events at the server level. It takes two arguments:

// Event Name: This is the name of the event to listen for.
// Callback Function: This function is executed when the event is emitted.
// The provided callback function receives a single argument, socket,
// which represents the newly connected client's socket object.
io.on('connection', (socket) => {
  console.log('User Connected', socket.id);

  // Handle events from the client
  // socket.on('chat message', (msg) => {
  //   console.log('Received message:', msg);
  //   io.emit('chat message', msg); // Broadcast to all clients
  // });

  // socket.on('message', ({ room, message }) => {
  //   console.log({ room, message });
  //   socket.to(room).emit('message', message);
  // });

  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', message);
  });

  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Socket.IO Events:

// connection: This event is fired when a new client connects to the server. The connected socket ID is logged.

// message: This event receives a message object containing room and message properties. The server logs the message details and broadcasts the message to all clients in the specified room using socket.to(room).emit('receive-message', message).

// join-room: This event allows a client to join a specific room. The client joins the specified room using socket.join(room).

// disconnect: This event gets triggered when a client disconnects. The socket ID is logged.



//In summary, this code snippet handles user connections, message sending within rooms, user joining rooms, and disconnections in a Socket.IO server application. It facilitates real-time communication by allowing clients to join rooms and receive messages broadcasted within those rooms.



// Here's a table summarizing the built-in events:

// Event Name	Emitted By	Description
// 'connection'	Server	When a new client connects
// 'disconnect'	Server	When a client disconnects
// 'connect'	Client	When the client connects to the server
// 'disconnect'	Client	When the client disconnects from the server
