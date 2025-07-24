'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';

const FixDatabaseTablesPage: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const checkAndFixTables = async () => {
    setIsRunning(true);
    addResult('=== فحص وإصلاح الجداول ===');

    // Check which tables exist
    const tablesToCheck = [
      'equipment',
      'animal_listings', 
      'land_listings',
      'nurseries',
      'vegetables',
      'labor',
      'analysis',
      'delivery',
      'categories',
      'profiles',
      'messages'
    ];

    addResult('فحص الجداول الموجودة...');
    
    for (const table of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          if (error.message.includes('does not exist')) {
            addResult(`❌ جدول ${table}: غير موجود`);
          } else {
            addResult(`⚠️ جدول ${table}: خطأ - ${error.message}`);
          }
        } else {
          addResult(`✅ جدول ${table}: موجود`);
        }
      } catch (err) {
        addResult(`❌ جدول ${table}: خطأ في الفحص`);
      }
    }

    addResult('');
    addResult('=== ملخص المشاكل ===');
    
    // Check which tables are missing
    const missingTables = [];
    if (!results.some(r => r.includes('✅ جدول nurseries: موجود'))) {
      missingTables.push('nurseries');
    }
    if (!results.some(r => r.includes('✅ جدول labor: موجود'))) {
      missingTables.push('labor');
    }
    if (!results.some(r => r.includes('✅ جدول analysis: موجود'))) {
      missingTables.push('analysis');
    }
    if (!results.some(r => r.includes('✅ جدول delivery: موجود'))) {
      missingTables.push('delivery');
    }
    
    if (missingTables.length === 0) {
      addResult('✅ جميع الجداول موجودة!');
    } else {
      addResult(`❌ الجداول المفقودة: ${missingTables.join(', ')}`);
      addResult('✅ الحل: يجب إنشاء الجداول المفقودة في قاعدة البيانات');
      addResult('');
      addResult('=== SQL لإنشاء الجداول المفقودة ===');
      
      if (missingTables.includes('labor')) {
        addResult(`
-- Create labor table
CREATE TABLE IF NOT EXISTS public.labor (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'DZD',
  labor_type TEXT CHECK (labor_type IN ('harvesting', 'planting', 'irrigation', 'maintenance', 'transport', 'other')),
  experience_years INTEGER,
  availability TEXT CHECK (availability IN ('full_time', 'part_time', 'seasonal', 'on_demand')),
  location TEXT NOT NULL,
  coordinates JSONB,
  images TEXT[],
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  skills TEXT[],
  certifications TEXT[]
);

-- Enable RLS for labor
ALTER TABLE public.labor ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for labor
CREATE POLICY "Users can view all labor" ON public.labor FOR SELECT USING (true);
CREATE POLICY "Users can insert their own labor" ON public.labor FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own labor" ON public.labor FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own labor" ON public.labor FOR DELETE USING (auth.uid() = user_id);
        `);
      }
      
      if (missingTables.includes('analysis')) {
        addResult(`
-- Create analysis table
CREATE TABLE IF NOT EXISTS public.analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'DZD',
  analysis_type TEXT CHECK (analysis_type IN ('soil', 'water', 'plant', 'pest', 'quality', 'other')),
  turnaround_days INTEGER,
  location TEXT NOT NULL,
  coordinates JSONB,
  images TEXT[],
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  certifications TEXT[],
  equipment TEXT[]
);

-- Enable RLS for analysis
ALTER TABLE public.analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analysis
CREATE POLICY "Users can view all analysis" ON public.analysis FOR SELECT USING (true);
CREATE POLICY "Users can insert their own analysis" ON public.analysis FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own analysis" ON public.analysis FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own analysis" ON public.analysis FOR DELETE USING (auth.uid() = user_id);
        `);
      }
      
      if (missingTables.includes('delivery')) {
        addResult(`
-- Create delivery table
CREATE TABLE IF NOT EXISTS public.delivery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'DZD',
  delivery_type TEXT CHECK (delivery_type IN ('local', 'regional', 'national', 'international')),
  vehicle_type TEXT CHECK (vehicle_type IN ('truck', 'van', 'refrigerated', 'specialized', 'other')),
  max_distance INTEGER,
  location TEXT NOT NULL,
  coordinates JSONB,
  images TEXT[],
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  insurance BOOLEAN DEFAULT false,
  tracking BOOLEAN DEFAULT false
);

-- Enable RLS for delivery
ALTER TABLE public.delivery ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for delivery
CREATE POLICY "Users can view all delivery" ON public.delivery FOR SELECT USING (true);
CREATE POLICY "Users can insert their own delivery" ON public.delivery FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own delivery" ON public.delivery FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own delivery" ON public.delivery FOR DELETE USING (auth.uid() = user_id);
        `);
      }
    }

    addResult('=== انتهى الفحص ===');
    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="text-3xl font-bold mb-6">🔧 إصلاح قاعدة البيانات</h1>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffc107',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <strong>🔍 المشكلة:</strong> جدول nurseries غير موجود في قاعدة البيانات، مما يسبب فشل صفحة المشاتل.
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={checkAndFixTables}
          disabled={isRunning}
          style={{
            padding: '12px 24px',
            backgroundColor: isRunning ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            marginRight: '10px',
            fontSize: '16px'
          }}
        >
          {isRunning ? 'جاري الفحص...' : 'فحص الجداول'}
        </button>

        <button 
          onClick={clearResults}
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
          مسح النتائج
        </button>
      </div>

      {/* Results */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        maxHeight: '600px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '14px',
        whiteSpace: 'pre-wrap'
      }}>
        <strong>📝 نتائج الفحص:</strong>
        {results.length === 0 ? (
          <div style={{ color: '#6c757d', marginTop: '10px' }}>
            انقر على "فحص الجداول" لبدء الفحص...
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

      {/* Instructions */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#e8f5e8', 
        border: '1px solid #4caf50',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <strong>📋 التعليمات:</strong>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>قم بتشغيل "فحص الجداول" أعلاه</li>
          <li>انسخ SQL المقدم في النتائج</li>
          <li>اذهب إلى لوحة تحكم Supabase</li>
          <li>افتح SQL Editor</li>
          <li>الصق SQL وقم بتنفيذه</li>
          <li>عد إلى التطبيق واختبر صفحة المشاتل</li>
        </ol>
      </div>
    </div>
  );
};

export default FixDatabaseTablesPage; 