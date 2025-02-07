/* eslint-disable */
const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const EVENTS = require('../src/socket-events/events.js'); // Changed .ts to .js

// Import necessary modules for code execution
const { exec } = require('child_process');
const fs = require('fs').promises;

// Add middleware to parse JSON bodies for POST requests (like our execute endpoint)
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);

const users = {};

// Takes a room id and returns an array of users in that room
const getAllUsersInRoom = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
    return {
      socketId,
        theme: users[socketId].theme,
        username: users[socketId].username,
    };
  });
};

// --- Code Execution Endpoint ---
// This endpoint accepts a language and code in the request body,
// writes the code to a temporary file, compiles/executes it, then sends back the output.
app.post('/api/execute', async (req, res) => {
  const { language, code } = req.body;
  const filename = `temp_${Date.now()}`;

  try {
    switch (language) {
      case 'cpp':
        // Write C++ code to a temporary file and then compile and run it.
        await fs.writeFile(`${filename}.cpp`, code);
        exec(`g++ ${filename}.cpp -o ${filename} && ./${filename}`, (error, stdout, stderr) => {
          if (error) {
            res.json({ output: stderr });
          } else {
            res.json({ output: stdout });
          }
          // Clean up temporary files
          exec(`rm ${filename}.cpp ${filename}`);
        });
        break;

      case 'python3':
        // Write Python code to a temporary file and then execute it.
        await fs.writeFile(`${filename}.py`, code);
        exec(`python3 ${filename}.py`, (error, stdout, stderr) => {
          if (error) {
            res.json({ output: stderr });
          } else {
            res.json({ output: stdout });
          }
          // Clean up temporary file
          exec(`rm ${filename}.py`);
        });
        break;

      // Add additional language cases as needed.
      default:
        res.json({ output: 'Language not supported.' });
    }
  } catch (error) {
    res.status(500).json({ output: 'Error executing code' });
  }
});

// --- Socket.io Setup ---
io.on('connection', (currentSocket) => {
  currentSocket.on(EVENTS.JOIN, ({ roomId, theme, username }) => {
    users[currentSocket.id] = { theme, username };
    currentSocket.join(roomId);
    
    // Use the updated helper to get editors with username directly.
    const editors = getAllUsersInRoom(roomId);

    editors.forEach((editor) => {
      io.to(editor.socketId).emit(EVENTS.JOINED, {
        editors,             // Now editors contain objects with { socketId, username, theme }
        socketId: currentSocket.id,
        // You can include `name` as an alias if you prefer:
        name: users[currentSocket.id].username,
      });
    });
  });

  currentSocket.on(EVENTS.CODE_CHANGE, ({ roomId, code }) => {
    currentSocket.in(roomId).emit(EVENTS.CODE_CHANGE, { code });
  });

  currentSocket.on(EVENTS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(EVENTS.CODE_CHANGE, { code });
  });

  currentSocket.on(EVENTS.CURSOR_POSITION_CHANGE, ({ cursor, cursorCoords, roomId }) => {
    const user = users[currentSocket.id];
    currentSocket.in(roomId).emit(EVENTS.CURSOR_POSITION_CHANGE, {
      cursor,
      cursorCoords,
      socketId: currentSocket.id,
      user,
    });
  });

  currentSocket.on('disconnecting', () => {
    const rooms = Array.from(currentSocket.rooms);
    rooms.forEach((roomId) => {
      currentSocket.in(roomId).emit(EVENTS.DISCONNECTED, {
        socketId: currentSocket.id,
        user: users[currentSocket.id],
      });
    });

    delete users[currentSocket.id];
    currentSocket.leave();
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));