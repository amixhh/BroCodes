import React, { useEffect, useRef, useState } from 'react';
import AceEditor from 'react-ace';

// Import ace editor themes and language modes
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

const CodeEditor = ({ language, code, onChange }) => {
  const aceEditorRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState('400px');

  const getEditorMode = () => {
    switch (language) {
      case 'python3':
        return 'python';
      case 'cpp':
        return 'c_cpp';
      default:
        return language;
    }
  };

  useEffect(() => {
    const updateEditorHeight = () => {
      if (window.innerWidth < 768) {
        setEditorHeight('300px'); // Adjust height for small screens
      } else {
        setEditorHeight('400px');
      }
      if (aceEditorRef.current) {
        aceEditorRef.current.editor.resize();
      }
    };

    window.addEventListener('resize', updateEditorHeight);
    updateEditorHeight(); // Call on mount

    return () => window.removeEventListener('resize', updateEditorHeight);
  }, []);

  return (
    <AceEditor
      ref={aceEditorRef}
      mode={getEditorMode()}
      theme="monokai"
      onChange={onChange}
      value={code}
      name="code-editor"
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      }}
      onLoad={(editor) => {
        if (language === 'cpp') {
          editor.commands.addCommand({
            name: 'insertCPPTemplate',
            bindKey: { win: 'Ctrl-T', mac: 'Command-T' },
            exec: (editorInstance) => {
              const snippet = `#include <bits/stdc++.h>
using namespace std;
#define int long long
#define endl "\\n"

signed main(){
    
    ios_base::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int t;
    cin >> t;
    while(t--){
        
    }
    return 0;
}`;
              editorInstance.setValue(snippet);
            },
            readOnly: false,
          });
        }
      }}
      width="100%"
      height={editorHeight}
      className="rounded-md"
    />
  );
};

export default CodeEditor;