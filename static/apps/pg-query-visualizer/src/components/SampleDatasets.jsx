import { useState } from 'react';
import datasets from '../data/sampleDatasets';

export default function SampleDatasets({ onLoadDataset, onSelectQuery, tableInfo }) {
  const [selectedDataset, setSelectedDataset] = useState('ecommerce');
  const [showSchema, setShowSchema] = useState(true);
  const [showQueries, setShowQueries] = useState(true);

  const currentDataset = datasets[selectedDataset];

  const handleLoadDataset = () => {
    const dataset = datasets[selectedDataset];
    onLoadDataset(dataset.schema, dataset.data);
  };

  const handleDatasetChange = (e) => {
    setSelectedDataset(e.target.value);
  };

  return (
    <div className="flex flex-col h-full bg-white border-l">
      <div className="px-4 py-3 border-b bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Sample Datasets</h3>

        <select
          value={selectedDataset}
          onChange={handleDatasetChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        >
          {Object.entries(datasets).map(([key, dataset]) => (
            <option key={key} value={key}>
              {dataset.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleLoadDataset}
          className="w-full px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md transition font-medium"
        >
          Load Dataset
        </button>

        <p className="mt-2 text-xs text-gray-600">
          {currentDataset.description}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Schema Section */}
        <div className="border-b">
          <button
            onClick={() => setShowSchema(!showSchema)}
            className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
          >
            <span>Schema</span>
            <span className="text-gray-400">{showSchema ? '▼' : '▶'}</span>
          </button>

          {showSchema && tableInfo && tableInfo.length > 0 && (
            <div className="px-4 py-2 space-y-3">
              {tableInfo.map((table, index) => (
                <div key={index} className="text-xs">
                  <div className="font-semibold text-gray-800 mb-1">
                    {table.name}
                  </div>
                  <div className="ml-2 space-y-1">
                    {table.columns.map((col, colIndex) => (
                      <div key={colIndex} className="text-gray-600 font-mono">
                        {col.name}
                        <span className="text-gray-400 ml-1">
                          {col.type}
                          {col.primaryKey && ' PK'}
                          {col.notNull && !col.primaryKey && ' NOT NULL'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {showSchema && (!tableInfo || tableInfo.length === 0) && (
            <div className="px-4 py-3 text-xs text-gray-500 italic">
              Load a dataset to see schema
            </div>
          )}
        </div>

        {/* Example Queries Section */}
        <div>
          <button
            onClick={() => setShowQueries(!showQueries)}
            className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
          >
            <span>Example Queries</span>
            <span className="text-gray-400">{showQueries ? '▼' : '▶'}</span>
          </button>

          {showQueries && (
            <div className="px-4 py-2 space-y-2">
              {currentDataset.exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => onSelectQuery(example.query)}
                  className="w-full text-left px-3 py-2 text-xs bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded transition"
                >
                  <div className="font-medium text-gray-800 mb-1">
                    {example.title}
                  </div>
                  <div className="text-gray-600 font-mono text-xs truncate">
                    {example.query.split('\n')[0]}...
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
