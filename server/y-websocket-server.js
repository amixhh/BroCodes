const WebSocket = require('ws');
const http = require('http');
const { setupWSConnection } = require('y-websocket/bin/utils');

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('okay');
});

// Enable permessage-deflate for compression
const wss = new WebSocket.Server({ 
  server,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      level: 7, // Adjust compression level (1-9)
    },
    zlibInflateOptions: {
      // See zlib defaults.
    },
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    threshold: 1024 // Only compress messages larger than 1KB.
  }
});

wss.on('connection', setupWSConnection);

server.listen(1234, () => {
  console.log('WebSocket server is running on port 1234');
});