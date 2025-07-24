'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseData } from '@/hooks/useSupabase';
import Link from 'next/link';

interface MarketplaceTest {
  id: string;
  name: string;
  link: string;
  emoji: string;
  color: string;
  getFunction: () => Promise<any>;
  status: 'pending' | 'success' | 'error';
  count: number;
  error?: string;
}

const TestAllMarketplacesPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { 
    getEquipment, 
    getAnimals, 
    getLand, 
    getNurseries, 
    getVegetables,
    getLabor,
    getAnalysis,
    getDelivery,
    getCategories
  } = useSupabaseData();
  
  const [tests, setTests] = useState<MarketplaceTest[]>([
    {
      id: 'equipment',
      name: 'المعدات الزراعية',
      link: '/equipment',
      emoji: '🚜',
      color: 'bg-blue-500',
      getFunction: getEquipment,
      status: 'pending',
      count: 0
    },
    {
      id: 'animals',
      name: 'الحيوانات',
      link: '/animals',
      emoji: '🐄',
      color: 'bg-orange-500',
      getFunction: getAnimals,
      status: 'pending',
      count: 0
    },
    {
      id: 'land',
      name: 'الأراضي الزراعية',
      link: '/land',
      emoji: '🌾',
      color: 'bg-emerald-500',
      getFunction: getLand,
      status: 'pending',
      count: 0
    },
    {
      id: 'nurseries',
      name: 'المشاتل والشتلات',
      link: '/nurseries',
      emoji: '🌱',
      color: 'bg-green-500',
      getFunction: getNurseries,
      status: 'pending',
      count: 0
    },
    {
      id: 'vegetables',
      name: 'الخضروات والفواكه',
      link: '/VAR/marketplace',
      emoji: '🍅',
      color: 'bg-red-500',
      getFunction: getVegetables,
      status: 'pending',
      count: 0
    },
    {
      id: 'labor',
      name: 'العمالة الزراعية',
      link: '/labor',
      emoji: '👨‍🌾',
      color: 'bg-yellow-500',
      getFunction: getLabor,
      status: 'pending',
      count: 0
    },
    {
      id: 'analysis',
      name: 'خدمات التحليل',
      link: '/analysis',
      emoji: '🔬',
      color: 'bg-purple-500',
      getFunction: getAnalysis,
      status: 'pending',
      count: 0
    },
    {
      id: 'delivery',
      name: 'خدمات التوصيل',
      link: '/delivery',
      emoji: '🚚',
      color: 'bg-indigo-500',
      getFunction: getDelivery,
      status: 'pending',
      count: 0
    },
    {
      id: 'categories',
      name: 'الفئات',
      link: '/categories',
      emoji: '📂',
      color: 'bg-gray-500',
      getFunction: getCategories,
      status: 'pending',
      count: 0
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    addResult('=== بدء اختبار جميع الأسواق ===');
    
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      addResult(`اختبار ${test.name}...`);
      
      try {
        const data = await test.getFunction();
        const count = Array.isArray(data) ? data.length : 0;
        
        setTests(prev => prev.map(t => 
          t.id === test.id 
            ? { ...t, status: 'success', count }
            : t
        ));
        
        addResult(`✅ ${test.name}: ${count} عنصر`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
        
        setTests(prev => prev.map(t => 
          t.id === test.id 
            ? { ...t, status: 'error', error: errorMessage }
            : t
        ));
        
        addResult(`❌ ${test.name}: ${errorMessage}`);
      }
    }
    
    addResult('=== انتهى اختبار جميع الأسواق ===');
    setIsRunning(false);
  };

  const resetTests = () => {
    setTests(prev => prev.map(test => ({
      ...test,
      status: 'pending',
      count: 0,
      error: undefined
    })));
    setResults([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="text-3xl font-bold mb-6">🧪 اختبار جميع الأسواق</h1>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#e3f2fd', 
        border: '1px solid #2196f3',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <strong>📋 معلومات الاختبار:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>سيتم اختبار جميع أقسام السوق</li>
          <li>سيتم التحقق من الاتصال بقاعدة البيانات</li>
          <li>سيتم عرض عدد العناصر في كل قسم</li>
          <li>سيتم عرض أي أخطاء تحدث</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runAllTests}
          disabled={isRunning}
          style={{
            padding: '12px 24px',
            backgroundColor: isRunning ? '#ccc' : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            marginRight: '10px',
            fontSize: '16px'
          }}
        >
          {isRunning ? 'جاري الاختبار...' : 'تشغيل جميع الاختبارات'}
        </button>

        <button 
          onClick={resetTests}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          إعادة تعيين
        </button>
      </div>

      {/* Marketplace Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {tests.map((test) => (
          <div key={test.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '2rem', marginRight: '10px' }}>{test.emoji}</span>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0' }}>
                  {test.name}
                </h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginTop: '5px'
                }}>
                  <span>{getStatusIcon(test.status)}</span>
                  <span className={getStatusColor(test.status)}>
                    {test.status === 'pending' && 'في الانتظار'}
                    {test.status === 'success' && 'نجح'}
                    {test.status === 'error' && 'فشل'}
                  </span>
                </div>
              </div>
            </div>

            {test.status === 'success' && (
              <div style={{ 
                padding: '10px', 
                backgroundColor: '#e8f5e8', 
                borderRadius: '4px',
                marginBottom: '10px'
              }}>
                <strong>عدد العناصر:</strong> {test.count}
              </div>
            )}

            {test.status === 'error' && test.error && (
              <div style={{ 
                padding: '10px', 
                backgroundColor: '#ffeaea', 
                borderRadius: '4px',
                marginBottom: '10px',
                color: '#d32f2f'
              }}>
                <strong>خطأ:</strong> {test.error}
              </div>
            )}

            <Link href={test.link} style={{
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: test.color,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              زيارة السوق
            </Link>
          </div>
        ))}
      </div>

      {/* Results Log */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        maxHeight: '300px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        <strong>📝 سجل النتائج:</strong>
        {results.length === 0 ? (
          <div style={{ color: '#6c757d', marginTop: '10px' }}>
            انقر على "تشغيل جميع الاختبارات" لبدء الاختبار...
          </div>
        ) : (
          <div style={{ marginTop: '10px' }}>
            {results.map((result, index) => (
              <div key={index} style={{ marginBottom: '5px' }}>
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {tests.some(t => t.status !== 'pending') && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e8f5e8', 
          border: '1px solid #4caf50',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <strong>📊 ملخص النتائج:</strong>
          <div style={{ marginTop: '10px' }}>
            <div>✅ نجح: {tests.filter(t => t.status === 'success').length}</div>
            <div>❌ فشل: {tests.filter(t => t.status === 'error').length}</div>
            <div>⏳ في الانتظار: {tests.filter(t => t.status === 'pending').length}</div>
            <div>📦 إجمالي العناصر: {tests.reduce((sum, t) => sum + t.count, 0)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestAllMarketplacesPage; 