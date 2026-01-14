import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function SQLEditor({ onExecute, onClear, initialQuery }) {
  const [sql, setSql] = useState(initialQuery || '-- Write your SQL query here\n-- Load a dataset from the right panel to get started\nSELECT * FROM users LIMIT 10;');

  useEffect(() => {
    if (initialQuery) {
      setSql(initialQuery);
    }
  }, [initialQuery]);

  const handleExecute = () => {
    if (sql.trim()) {
      onExecute(sql);
    }
  };

  const handleClear = () => {
    setSql('');
    if (onClear) {
      onClear();
    }
  };

  const handleEditorChange = (value) => {
    setSql(value || '');
  };

  const handleKeyDown = (e) => {
    // Execute query on Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
        <h3 className="text-sm font-semibold text-gray-700">SQL Editor</h3>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition"
          >
            Clear
          </button>
          <button
            onClick={handleExecute}
            className="px-4 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition font-medium"
          >
            Execute (⌘↵)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden" onKeyDown={handleKeyDown}>
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={sql}
          onChange={handleEditorChange}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}
