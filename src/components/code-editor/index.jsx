import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/material-darker.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import './code-editor.styles.css';
const EVENTS = require('@/socket-events/events');  // Removed .ts extension

const Editor = ({ socketRef, roomId, onCodeChange, user, cursors, setCursors }) => {  // Removed type annotations
  const editorRef = useRef(null);  // Removed type annotation

  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById('realtime-code-editor'),  // Removed type casting
        {
          autoCloseBrackets: true,
          autoCloseTags: true,
          lineNumbers: true,
          lineWrapping: true,
          mode: { name: 'javascript', json: true },
          tabSize: 2,
          theme: 'material-darker',
        }
      );

      editorRef.current.on('change', (instance, changes) => {  // Removed type annotations
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== 'setValue') {
          socketRef.current.emit(EVENTS.CODE_CHANGE, {
            code,
            roomId,
          });
        }
      });

      editorRef.current.on('cursorActivity', (instance) => {  // Removed type annotation
        const cursor = editorRef.current.getCursor();
        const cursorCoords = instance.cursorCoords(true, 'local');
        socketRef.current.emit(EVENTS.CURSOR_POSITION_CHANGE, {
          cursor,
          cursorCoords,
          roomId,
        });
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(EVENTS.CODE_CHANGE, ({ code }) => {  // Removed type annotation
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current?.off(EVENTS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(EVENTS.CURSOR_POSITION_CHANGE, ({
        cursor,
        cursorCoords,
        socketId,
        user: u,
      }) => {  // Removed type annotation
        const currentCursor = editorRef.current.getCursor();
        editorRef.current.setCursor(currentCursor);
        setCursors((prevCursors) => {  // Removed type annotation
          const updatedCursors = prevCursors.filter((cur) => cur.socketId !== socketId);
          updatedCursors.push({ socketId, cursor, cursorCoords, u });
          return updatedCursors;
        });
      });
    }

    return () => {
      socketRef.current?.off(EVENTS.CURSOR_POSITION_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <div style={{
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <textarea id="realtime-code-editor" />
      {cursors.map(({ socketId, cursorCoords, u }) => (  // Removed type annotation
        u.username !== user.username && (
          <div
            key={socketId}
            style={{
              position: 'absolute',
              top: `${cursorCoords.top + 29}px`,
              left: `${cursorCoords.left + 30}px`,
            }}
          >
            <div className="custom-caret" style={{ backgroundColor: u.theme }}>
              <div className="custom-caret-head" style={{ backgroundColor: u.theme }} />
            </div>
            <div className="cursor-badge" style={{ backgroundColor: u.theme }}>
              {u.username}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default Editor;