import React, { useState, useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { CodemirrorBinding } from 'y-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/material-darker.css';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import './code-editor.styles.css';
import { executeCode } from '../../services/code-execution.service';

const EVENTS = require('../../socket-events/events');

const Editor = ({
  socketRef,
  roomId,
  onCodeChange,
  user,
  cursors,
  setCursors,
  language
}) => {
  const editorRef = useRef(null);
  const yDocRef = useRef(null);
  const wsProviderRef = useRef(null);
  const bindingRef = useRef(null);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState(null);

  const getMode = (language) => {
    switch (language) {
      case 'cpp':
        return 'text/x-c++src';
      case 'python3':
        return 'python';
      case 'java':
        return 'text/x-java';
      case 'nodejs':
        return 'javascript';
      default:
        return 'javascript';
    }
  };

  useEffect(() => {
    async function init() {
      yDocRef.current = new Y.Doc();
      wsProviderRef.current = new WebsocketProvider(
        'ws://localhost:1234',
        roomId,
        yDocRef.current
      );

      editorRef.current = Codemirror.fromTextArea(
        document.getElementById('realtime-code-editor'),
        {
          autoCloseBrackets: true,
          autoCloseTags: true,
          lineNumbers: true,
          lineWrapping: true,
          mode: getMode(language),
          tabSize: 2,
          theme: 'material-darker'
        }
      );

      const yText = yDocRef.current.getText('codemirror');
      bindingRef.current = new CodemirrorBinding(
        yText,
        editorRef.current,
        wsProviderRef.current.awareness
      );

      editorRef.current.on('change', (instance) => {
        const code = instance.getValue();
        onCodeChange(code);
      });
    }
    init();

    return () => {
      bindingRef.current?.destroy();
      wsProviderRef.current?.destroy();
      yDocRef.current?.destroy();
    };
  }, [language]);

  const handleExecuteCode = async () => {
    setIsExecuting(true);
    setError(null);
    try {
      const code = editorRef.current.getValue();
      const result = await executeCode(code, language);
      setOutput(result.output);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="editor-container">
      <div className="code-editor-scrollable">
        <textarea id="realtime-code-editor" />
        {cursors.map(({ socketId, cursorCoords, u }) =>
          u.username !== user?.username && (
            <div
              key={socketId}
              style={{
                position: 'absolute',
                top: `${cursorCoords.top + 29}px`,
                left: `${cursorCoords.left + 30}px`
              }}
            >
              <div className="custom-caret" style={{ backgroundColor: u.theme }}>
                <div
                  className="custom-caret-head"
                  style={{ backgroundColor: u.theme }}
                />
              </div>
              <div className="cursor-badge" style={{ backgroundColor: u.theme }}>
                {u.username}
              </div>
            </div>
          )
        )}
      </div>
      <div className="execution-panel">
        <button onClick={handleExecuteCode} disabled={isExecuting}>
          {isExecuting ? 'Executing...' : 'Run Code'}
        </button>
        {error && <div className="error-message">{error}</div>}
        {output && (
          <div className="output-panel">
            <h3>Output:</h3>
            <pre>{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;