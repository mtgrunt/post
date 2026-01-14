import { useState, useEffect } from 'react';
import SQLEditor from './components/SQLEditor';
import ResultsPanel from './components/ResultsPanel';
import SampleDatasets from './components/SampleDatasets';
import { sqlExecutor } from './utils/sqlExecutor';

function App() {
  const [queryResult, setQueryResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tableInfo, setTableInfo] = useState([]);
  const [currentQuery, setCurrentQuery] = useState('');

  useEffect(() => {
    // Initialize SQL.js on component mount
    sqlExecutor.initialize().catch(error => {
      console.error('Failed to initialize SQL executor:', error);
    });

    return () => {
      sqlExecutor.close();
    };
  }, []);

  const handleExecuteQuery = async (sql) => {
    setIsLoading(true);
    setCurrentQuery(sql);

    try {
      const result = await sqlExecutor.executeQuery(sql);
      setQueryResult(result);
    } catch (error) {
      setQueryResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDataset = async (schema, data) => {
    setIsLoading(true);
    setQueryResult(null);

    try {
      const result = await sqlExecutor.loadDataset(schema, data);

      if (result.success) {
        const tables = sqlExecutor.getTableInfo();
        setTableInfo(tables);
        setQueryResult({
          success: true,
          results: [],
          executionTime: '0ms',
          rowCount: 0,
          message: 'Dataset loaded successfully!'
        });
      } else {
        setQueryResult({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      setQueryResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuery = (query) => {
    setCurrentQuery(query);
    handleExecuteQuery(query);
  };

  const handleClear = () => {
    setQueryResult(null);
    setCurrentQuery('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-2xl font-bold">PostgreSQL Query Visualizer</h1>
        <p className="text-sm text-blue-100 mt-1">
          Interactive SQL playground with sample datasets
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor */}
        <div className="flex-1 flex flex-col border-r bg-white">
          <SQLEditor
            key={currentQuery}
            onExecute={handleExecuteQuery}
            onClear={handleClear}
            initialQuery={currentQuery}
          />
        </div>

        {/* Middle: Results */}
        <div className="flex-1 flex flex-col bg-white">
          <ResultsPanel result={queryResult} isLoading={isLoading} />
        </div>

        {/* Right: Datasets & Schema */}
        <div className="w-80 flex flex-col">
          <SampleDatasets
            onLoadDataset={handleLoadDataset}
            onSelectQuery={handleSelectQuery}
            tableInfo={tableInfo}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 border-t px-6 py-3 text-center text-xs text-gray-600">
        Built with React, Monaco Editor & sql.js | Part of{' '}
        <a
          href="https://mileswallace.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          mileswallace.com
        </a>
      </footer>
    </div>
  );
}

export default App;
