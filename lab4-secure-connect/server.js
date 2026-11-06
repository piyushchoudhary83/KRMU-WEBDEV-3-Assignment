require('dotenv').config();

const path = require('path');
const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');
const registerChat = require('./sockets/chat');
require('./events/listeners'); // registers EventEmitter listeners

if (!process.env.JWT_SECRET) {
  console.error('[server] JWT_SECRET is missing in .env');
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server); // same server, same origin

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.use('/api', (req, res) => res.status(404).json({ message: 'Route not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

registerChat(io);

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  server.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`));
})();