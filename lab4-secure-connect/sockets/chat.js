const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ROOM = 'general';

// The JWT lives in an HTTP-only cookie, which the browser also sends with the Socket.IO handshake.
function parseCookies(header = '') {
  return header.split(';').reduce((acc, part) => {
    const idx = part.indexOf('=');
    if (idx > -1) {
      acc[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
    }
    return acc;
  }, {});
}

module.exports = function registerChat(io) {
  // Authenticate every socket from the `token` cookie before it connects
  io.use(async (socket, next) => {
    try {
      const { token } = parseCookies(socket.handshake.headers.cookie);
      if (!token) return next(new Error('No token provided'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('username');
      if (!user) return next(new Error('User not found'));

      socket.user = { id: user.id, username: user.username };
      next();
    } catch (err) {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.join(ROOM);
    console.log(`${socket.id} joined room ${ROOM}`);

    socket.on('chatMessage', (msg) => {
      const text = typeof msg === 'string' ? msg.trim() : '';
      if (!text || text.length > 500) return;

      console.log(`[${ROOM}] ${socket.user.username}: ${text}`);

      io.to(ROOM).emit('chatMessage', {
        username: socket.user.username,
        message: text,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};