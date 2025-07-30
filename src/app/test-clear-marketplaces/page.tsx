'use client';

import { useState } from 'react';

export default function TestClearMarketplaces() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const clearAllMarketplaces = async () => {
    if (!confirm('⚠️ Are you sure you want to clear ALL marketplace data? This action cannot be undone!')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/clear-all-marketplaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to clear marketplaces');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧹 Clear All Marketplaces
          </h1>
          
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              This will clear all marketplace data including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Equipment listings</li>
              <li>Land listings</li>
              <li>Agricultural products</li>
              <li>Messages</li>
              <li>Favorites</li>
              <li>Reviews</li>
              <li>Export deals</li>
              <li>Nurseries</li>
              <li>Vegetables</li>
              <li>Animals</li>
              <li>Labor</li>
              <li>Delivery</li>
              <li>Experts</li>
            </ul>
            <p className="text-red-600 font-semibold mt-4">
              ⚠️ User profiles and categories will be preserved.
            </p>
          </div>

          <button
            onClick={clearAllMarketplaces}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {isLoading ? '🧹 Clearing...' : '🧹 Clear All Marketplaces'}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-semibold mb-2">❌ Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-green-800 font-semibold mb-2">✅ Success</h3>
                <p className="text-green-700">{result.message}</p>
                <p className="text-green-600 text-sm mt-2">
                  Timestamp: {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">📊 Results:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(result.results || {}).map(([table, status]) => (
                    <div key={table} className="text-sm">
                      <span className="font-medium">{table}:</span>{' '}
                      <span className={status.includes('Error') ? 'text-red-600' : 'text-green-600'}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">🔍 Verification:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(result.verification || {}).map(([table, count]) => (
                    <div key={table} className="text-sm">
                      <span className="font-medium">{table}:</span>{' '}
                      <span className={count === -1 ? 'text-red-600' : count === 0 ? 'text-green-600' : 'text-orange-600'}>
                        {count === -1 ? 'Error' : `${count} records`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 