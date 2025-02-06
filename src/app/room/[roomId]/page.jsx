'use client';

import Button from "@/components/button";
import Editor from "@/components/code-editor";
import UserAvatar from "@/components/user-avatar";
import { initializeSocket } from "@/socket";
import getRandomColor from "@/utils/random-color-generator";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
const EVENTS = require('@/socket-events/events.js');

const RoomPage = () => {
  const searchParams = useSearchParams();
  const currentUsername = searchParams.get('username');
  const { roomId } = useParams();

  const socketRef = useRef(null);
  const editorBlockRef = useRef(null);
  const codeRef = useRef(null);
  const router = useRouter();
  const [editors, setEditors] = useState([]);
  const [cursors, setCursors] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initializeSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later');
        router.push('/');
      }

      socketRef.current.emit(EVENTS.JOIN, {
        roomId,
        theme: getRandomColor(),
        username: currentUsername,
      });

      socketRef.current.on(
        EVENTS.JOINED, ({
          editors,
          socketId,
          user,
        }) => {
          if (user.username !== currentUsername) {
            toast.success(`${user.username} joined the room`);
          }
          if (user.username === currentUsername) {
            setUser(user);
          }
          setEditors(editors);
          socketRef.current.emit(EVENTS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        },
      );

      socketRef.current.on(
        EVENTS.DISCONNECTED, ({
          socketId,
          user,
        }) => {
          toast.success(`${user.username} left the room`);
          setEditors((prev) => {
            return prev.filter(
              (editor) => editor.socketId !== socketId
            );
          });

          setCursors((prevCursors) => {
            const updatedCursors = prevCursors.filter((cur) => cur.socketId !== socketId);
            return updatedCursors;
          });
        }
      );
    };

    init();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(EVENTS.JOINED);
      socketRef.current?.off(EVENTS.DISCONNECTED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
      toast.error('Failed to copy the Room ID');
      console.error(err);
    }
  }

  function leaveRoom() {
    router.push('/');
  }

  if (!currentUsername) {
    router.push('/');
  }

  return (
    <div className="flex flex-col md:flex-row bg-dark">
      <div      
        ref={editorBlockRef}
        className="flex flex-col gap-4 min-w-full md:min-w-74 pb-8"
      >
        <div className="p-5 bg-dark text-white">
          <h1 className="text-center font-bold text-2xl">BroCode!<br /> Playground</h1>
        </div>
        <div className="grow">
          <div className="flex flex-wrap md:grid md:grid-cols-2 gap-3 p-3">
            {editors.map((editor) => (
              <UserAvatar
                key={editor.socketId}
                user={editor.user}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-row md:flex-col justify-center items-center gap-5">
          <Button onClick={copyRoomId}>
            Copy Room ID
          </Button>
          <Button variant="secondary" onClick={leaveRoom}>
            Leave Room
          </Button>
        </div>
      </div>
      <div className="w-full md:grow">
        <Editor
          currentUsername={currentUsername}
          editorBlockRef={editorBlockRef}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
          roomId={roomId}
          socketRef={socketRef}
          user={user}
          cursors={cursors}
          setCursors={setCursors}
        />
      </div>
    </div>
  );
}

export default RoomPage; 