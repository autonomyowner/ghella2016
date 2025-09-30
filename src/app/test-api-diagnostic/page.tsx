// Restricted to non-production environments
'use client';
if (process.env.NEXT_PUBLIC_APP_ENV === 'production') {
  throw new Error('This route is disabled in production.');
}

import React, { useState } from 'react';

interface DiagnosticError {
  message: string;
  code: string;
  details?: string;
  hint?: string;
}

interface TableDiagnostic {
  exists: boolean;
  error: DiagnosticError | null;
  rowCount: number;
}

interface RLSDiagnostic {
  select: boolean;
  insert: boolean;
  update: boolean;
  delete: boolean;
  error: DiagnosticError | null;
}

interface Diagnostics {
  timestamp: string;
  connection: {
    status: 'testing' | 'success' | 'failed';
    error: DiagnosticError | null;
    responseTime: number;
  };
  tables: Record<string, TableDiagnostic>;
  rls: Record<string, RLSDiagnostic>;
  permissions: Record<string, any>;
  recommendations: string[];
  summary?: {
    connectionWorking: boolean;
    tablesWorking: number;
    totalTables: number;
    successRate: number;
  };
}

const APIDiagnosticPage: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostic = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/test-supabase-connection');
      const data = await response.json();
      
      if (response.ok) {
        setDiagnostics(data);
      } else {
        setError(data.message || 'خطأ في الاتصال بالخادم');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ غير معروف');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'failed': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🔧 اختبار API التشخيص</h1>
          <p className="text-gray-600 text-lg">اختبار شامل لاتصال Supabase عبر API</p>
        </div>

        {/* Control Button */}
        <div className="text-center mb-8">
          <button 
            onClick={runDiagnostic}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? '🔄 جاري الاختبار...' : '🚀 تشغيل اختبار API'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800">❌ خطأ</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Results */}
        {diagnostics && (
          <div className="space-y-6">
            {/* Connection Status */}
            <div className={`p-6 rounded-lg border ${
              diagnostics.connection.status === 'success' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="text-xl font-bold mb-4">🔌 حالة الاتصال</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">الحالة:</span>
                  <span className={`ml-2 ${getStatusColor(diagnostics.connection.status)}`}>
                    {getStatusIcon(diagnostics.connection.status)} {diagnostics.connection.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium">وقت الاستجابة:</span>
                  <span className="ml-2">{diagnostics.connection.responseTime}ms</span>
                </div>
                {diagnostics.connection.error && (
                  <div className="col-span-2">
                    <span className="font-medium">الخطأ:</span>
                    <div className="mt-1 p-2 bg-red-100 rounded text-sm">
                      <div><strong>الرسالة:</strong> {diagnostics.connection.error.message}</div>
                      <div><strong>الكود:</strong> {diagnostics.connection.error.code}</div>
                      {diagnostics.connection.error.details && (
                        <div><strong>التفاصيل:</strong> {diagnostics.connection.error.details}</div>
                      )}
                      {diagnostics.connection.error.hint && (
                        <div><strong>التلميح:</strong> {diagnostics.connection.error.hint}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tables Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">📊 حالة الجداول</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(diagnostics.tables).map(([tableName, table]) => (
                  <div key={tableName} className={`p-4 rounded-lg border ${
                    table.exists ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{tableName}</h4>
                      <span className={table.exists ? 'text-green-600' : 'text-red-600'}>
                        {table.exists ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <div>عدد الصفوف: {table.rowCount}</div>
                      {table.error && (
                        <div className="mt-2 p-2 bg-red-100 rounded text-xs">
                          <div><strong>الخطأ:</strong> {table.error.message}</div>
                          <div><strong>الكود:</strong> {table.error.code}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RLS Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">🔐 سياسات RLS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(diagnostics.rls).map(([tableName, rls]) => (
                  <div key={tableName} className="p-4 rounded-lg border bg-gray-50">
                    <h4 className="font-semibold mb-2">{tableName}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className={`flex items-center gap-1 ${rls.select ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{rls.select ? '✅' : '❌'}</span>
                        <span>قراءة</span>
                      </div>
                      <div className={`flex items-center gap-1 ${rls.insert ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{rls.insert ? '✅' : '❌'}</span>
                        <span>إدراج</span>
                      </div>
                      <div className={`flex items-center gap-1 ${rls.update ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{rls.update ? '✅' : '❌'}</span>
                        <span>تحديث</span>
                      </div>
                      <div className={`flex items-center gap-1 ${rls.delete ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{rls.delete ? '✅' : '❌'}</span>
                        <span>حذف</span>
                      </div>
                    </div>
                    {rls.error && (
                      <div className="mt-2 p-2 bg-red-100 rounded text-xs">
                        <div><strong>الخطأ:</strong> {rls.error.message}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            {diagnostics.summary && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">📈 ملخص النتائج</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {diagnostics.summary.connectionWorking ? '✅' : '❌'}
                    </div>
                    <div className="text-sm text-blue-700">الاتصال</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {diagnostics.summary.tablesWorking}
                    </div>
                    <div className="text-sm text-green-700">جداول تعمل</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {diagnostics.summary.totalTables}
                    </div>
                    <div className="text-sm text-yellow-700">إجمالي الجداول</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {diagnostics.summary.successRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-purple-700">معدل النجاح</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {diagnostics.recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">💡 التوصيات</h3>
                <ul className="space-y-2">
                  {diagnostics.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600">💡</span>
                      <span className="text-gray-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Raw Data */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">📄 البيانات الخام</h3>
              <details>
                <summary className="cursor-pointer text-blue-600 font-medium">عرض البيانات الخام</summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(diagnostics, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default APIDiagnosticPage; 