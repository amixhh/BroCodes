# BroCode - Real-Time Collaborative Code Editor

**BroCode** is a real-time collaborative code editor built with **Next.js**, **CodeMirror**, and **Socket.io**, integrating **Yjs** (a CRDT for seamless synchronization) and the **JDoodle API** for multi-language code execution.

## 🚀 Features
- 📝 **Real-time collaborative editing** with WebSockets
- 🌍 **Multi-language code execution** via JDoodle API
- 🔄 **Conflict-free synchronization** using Yjs (CRDT)
- ⚡ **WebSocket-powered live updates** with Socket.io

---

## 📺 Live Demo
🔗 [Execution Video](#) *(Replace with actual video link)*

---

## 🛠 Tech Stack
- **Frontend:** Next.js, CodeMirror
- **Backend:** Node.js, Express, Socket.io, Yjs WebSocket Server
- **Execution:** JDoodle API for secure, multi-language code execution

---

## 🔧 Installation Guide

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/BroCode.git
cd brocode
```
### 2️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add the following variables:
```sh
NEXT_PUBLIC_JDOODLE_CLIENT_ID=your_client_id
NEXT_PUBLIC_JDOODLE_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:1234
```
### 3️⃣ Start the WebSocket Server
```sh
node server/y-websocket.js
```
### 4️⃣ Start the Backend Server
```sh
node server/index.js
```
### 5️⃣ Start the Next.js Frontend
```sh
npm install 
npm run dev
```
The application should now be running at **[http://localhost:3000](http://localhost:3000)**.

