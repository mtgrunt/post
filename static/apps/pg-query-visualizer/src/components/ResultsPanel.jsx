export default function ResultsPanel({ result, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
          <h3 className="text-sm font-semibold text-gray-700">Results</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Executing query...</div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
          <h3 className="text-sm font-semibold text-gray-700">Results</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-400 text-sm">
            Execute a query to see results
          </div>
        </div>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-2 bg-red-50 border-b border-red-200">
          <h3 className="text-sm font-semibold text-red-700">Error</h3>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-800 font-mono text-sm">{result.error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (result.results.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
          <h3 className="text-sm font-semibold text-gray-700">Results</h3>
          <span className="text-xs text-gray-500">{result.executionTime}</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 text-sm">
            Query executed successfully (0 rows)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
        <h3 className="text-sm font-semibold text-gray-700">Results</h3>
        <div className="flex gap-3 text-xs text-gray-600">
          <span>{result.rowCount} {result.rowCount === 1 ? 'row' : 'rows'}</span>
          <span>{result.executionTime}</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {result.results.map((table, tableIndex) => (
          <div key={tableIndex} className="mb-4 last:mb-0">
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {table.columns.map((column, colIndex) => (
                      <th
                        key={colIndex}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.values.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap"
                        >
                          {cell === null ? (
                            <span className="text-gray-400 italic">NULL</span>
                          ) : (
                            String(cell)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
