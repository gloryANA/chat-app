const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server: SocketIOServer } = require('socket.io');

// Environment setup
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Prepare Next.js application
app.prepare().then(() => {
  // Create HTTP server
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname.startsWith('/api/')) {
      // Let Next.js handle API routes
      handle(req, res, parsedUrl);
    } else {
      // Default handler for other routes
      handle(req, res, parsedUrl);
    }
  });

  // Initialize Socket.IO
  const io = new SocketIOServer(server);

  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('message', (msg) => {
      io.emit('message', msg);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Start the server
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
