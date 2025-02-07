import React, { useState } from 'react';
import { executeCode } from '../../services/code-execution.service';

const CodeExecutor = ({ language, code }) => {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    try {
      const result = await executeCode(code, language);
      setOutput(result.output);
    } catch (error) {
      setOutput('Error executing code: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <button
        onClick={runCode}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? 'Running...' : 'Run Code'}
      </button>
      
      {output && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h3 className="font-bold mb-2">Output:</h3>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeExecutor;