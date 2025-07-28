'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseData } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase/supabaseClient';
import Link from 'next/link';

interface DiagnosticResult {
  id: string;
  name: string;
  emoji: string;
  color: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  tests: DiagnosticTest[];
  count: number;
  error?: string;
  connectionStatus: 'connected' | 'failed' | 'timeout' | 'pending';
  tableExists: boolean;
  rlsEnabled: boolean;
  permissions: {
    select: boolean;
    insert: boolean;
    update: boolean;
    delete: boolean;
  };
}

interface DiagnosticTest {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
  errorCode?: string;
  errorHint?: string;
  solution?: string;
  executionTime?: number;
}

interface DatabaseInfo {
  tables: string[];
  rlsPolicies: any[];
  connectionStatus: 'connected' | 'failed' | 'timeout' | 'pending';
  userPermissions: any;
}

const MarketplaceDiagnosticPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { 
    getEquipment, addEquipment, updateEquipment, deleteEquipment,
    getAnimals, addAnimal, updateAnimal, deleteAnimal,
    getLand, addLand, updateLand, deleteLand,
    getNurseries, addNursery, updateNursery, deleteNursery,
    getVegetables, addVegetable, updateVegetable, deleteVegetable,
    getProfile, getStats, getCategories
  } = useSupabaseData();
  
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([
    {
      id: 'equipment',
      name: 'المعدات الزراعية',
      emoji: '🚜',
      color: 'bg-blue-500',
      status: 'pending',
      tests: [],
      count: 0,
      connectionStatus: 'pending',
      tableExists: false,
      rlsEnabled: false,
      permissions: { select: false, insert: false, update: false, delete: false }
    },
    {
      id: 'animals',
      name: 'الحيوانات',
      emoji: '🐄',
      color: 'bg-orange-500',
      status: 'pending',
      tests: [],
      count: 0,
      connectionStatus: 'pending',
      tableExists: false,
      rlsEnabled: false,
      permissions: { select: false, insert: false, update: false, delete: false }
    },
    {
      id: 'land',
      name: 'الأراضي الزراعية',
      emoji: '🌾',
      color: 'bg-emerald-500',
      status: 'pending',
      tests: [],
      count: 0,
      connectionStatus: 'pending',
      tableExists: false,
      rlsEnabled: false,
      permissions: { select: false, insert: false, update: false, delete: false }
    },
    {
      id: 'nurseries',
      name: 'المشاتل والشتلات',
      emoji: '🌱',
      color: 'bg-green-500',
      status: 'pending',
      tests: [],
      count: 0,
      connectionStatus: 'pending',
      tableExists: false,
      rlsEnabled: false,
      permissions: { select: false, insert: false, update: false, delete: false }
    },
    {
      id: 'vegetables',
      name: 'الخضروات والفواكه',
      emoji: '🍅',
      color: 'bg-red-500',
      status: 'pending',
      tests: [],
      count: 0,
      connectionStatus: 'pending',
      tableExists: false,
      rlsEnabled: false,
      permissions: { select: false, insert: false, update: false, delete: false }
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [databaseInfo, setDatabaseInfo] = useState<DatabaseInfo>({
    tables: [],
    rlsPolicies: [],
    connectionStatus: 'pending',
    userPermissions: {}
  });
  const [showDetails, setShowDetails] = useState<string[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const updateDiagnosticResult = (id: string, updates: Partial<DiagnosticResult>) => {
    setDiagnosticResults(prev => prev.map(test => 
      test.id === id ? { ...test, ...updates } : test
    ));
  };

  const addTestToResult = (id: string, test: DiagnosticTest) => {
    setDiagnosticResults(prev => prev.map(result => 
      result.id === id 
        ? { ...result, tests: [...result.tests, test] }
        : result
    ));
  };

  const toggleDetails = (id: string) => {
    setShowDetails(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Test database connection and structure
  const testDatabaseConnection = async () => {
    addResult('🔍 اختبار الاتصال بقاعدة البيانات...');
    
    try {
      const startTime = Date.now();
      
      // Test basic connection
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      const executionTime = Date.now() - startTime;
      
      if (error) {
        throw new Error(`Connection failed: ${error.message}`);
      }

      addResult(`✅ الاتصال بقاعدة البيانات ناجح (${executionTime}ms)`);
      
      // Get database schema information
      const tables = ['equipment', 'animal_listings', 'land_listings', 'nurseries', 'vegetables', 'profiles', 'categories'];
      const tableExists: { [key: string]: boolean } = {};
      
      for (const table of tables) {
        try {
          const { error: tableError } = await supabase
            .from(table)
            .select('id')
            .limit(1);
          
          tableExists[table] = !tableError;
          addResult(`${tableExists[table] ? '✅' : '❌'} جدول ${table}: ${tableExists[table] ? 'موجود' : 'غير موجود'}`);
        } catch (err) {
          tableExists[table] = false;
          addResult(`❌ جدول ${table}: خطأ في الوصول`);
        }
      }

      setDatabaseInfo(prev => ({
        ...prev,
        tables: Object.keys(tableExists).filter(table => tableExists[table]),
        connectionStatus: 'connected'
      }));

      return { success: true, tableExists, executionTime };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      addResult(`❌ فشل الاتصال: ${errorMessage}`);
      
      setDatabaseInfo(prev => ({
        ...prev,
        connectionStatus: 'failed'
      }));

      return { success: false, error: errorMessage };
    }
  };

  // Test RLS policies
  const testRLSPolicies = async (tableName: string): Promise<DiagnosticTest[]> => {
    try {
      const tests: DiagnosticTest[] = [];
      
      // Test SELECT permission
      const { data: selectData, error: selectError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      tests.push({
        name: 'SELECT Permission',
        status: selectError ? 'error' : 'success',
        message: selectError ? `فشل في SELECT: ${selectError.message}` : 'SELECT يعمل بشكل صحيح',
        errorCode: selectError?.code,
        errorHint: selectError?.hint,
        solution: selectError ? 'تحقق من سياسات RLS للقراءة' : undefined
      });

      // Test INSERT permission (if user is logged in)
      if (user) {
        const testData = {
          title: 'Test Item',
          description: 'Test description',
          price: 100,
          location: 'Test Location',
          user_id: user.id
        };

        const { data: insertData, error: insertError } = await supabase
          .from(tableName)
          .insert([testData])
          .select()
          .single();

        tests.push({
          name: 'INSERT Permission',
          status: insertError ? 'error' : 'success',
          message: insertError ? `فشل في INSERT: ${insertError.message}` : 'INSERT يعمل بشكل صحيح',
          errorCode: insertError?.code,
          errorHint: insertError?.hint,
          solution: insertError ? 'تحقق من سياسات RLS للإدراج' : undefined
        });

        // Clean up test data if insert was successful
        if (!insertError && insertData) {
          await supabase
            .from(tableName)
            .delete()
            .eq('id', insertData.id);
        }
      } else {
        tests.push({
          name: 'INSERT Permission',
          status: 'warning',
          message: 'تخطي اختبار INSERT - المستخدم غير مسجل دخول'
        });
      }

      return tests;
    } catch (error) {
      return [{
        name: 'RLS Policies',
        status: 'error',
        message: `خطأ في اختبار RLS: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        solution: 'تحقق من إعدادات RLS في Supabase'
      }];
    }
  };

  // Comprehensive test for each marketplace
  const testMarketplace = async (marketplaceId: string, marketplaceName: string, testFunctions: any) => {
    setCurrentTest(marketplaceId);
    addResult(`🔍 بدء اختبار ${marketplaceName}...`);
    
    const tests: DiagnosticTest[] = [];
    let connectionStatus: 'connected' | 'failed' | 'timeout' = 'connected';
    let tableExists = false;
    let rlsEnabled = false;
    let permissions = { select: false, insert: false, update: false, delete: false };

    try {
      // Test 1: Check if table exists
      const startTime = Date.now();
      const tableName = marketplaceId === 'animals' ? 'animal_listings' : 
                       marketplaceId === 'land' ? 'land_listings' : 
                       marketplaceId;
      const { data: tableCheck, error: tableError } = await supabase
        .from(tableName)
        .select('id')
        .limit(1);

      const executionTime = Date.now() - startTime;
      tableExists = !tableError;
      
      tests.push({
        name: 'وجود الجدول',
        status: tableExists ? 'success' : 'error',
        message: tableExists ? 'الجدول موجود' : `الجدول غير موجود: ${tableError?.message}`,
        errorCode: tableError?.code,
        errorHint: tableError?.hint,
        solution: tableError ? 'تحقق من إنشاء الجدول في Supabase' : undefined,
        executionTime
      });

      if (!tableExists) {
        connectionStatus = 'failed';
        updateDiagnosticResult(marketplaceId, {
          status: 'error',
          connectionStatus,
          tableExists,
          tests
        });
        return;
      }

      // Test 2: Test basic fetch
      try {
        const fetchStartTime = Date.now();
        const data = await testFunctions.get();
        const fetchExecutionTime = Date.now() - fetchStartTime;
        
        tests.push({
          name: 'جلب البيانات',
          status: 'success',
          message: `تم جلب ${data.length} عنصر بنجاح`,
          executionTime: fetchExecutionTime
        });
        permissions.select = true;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
        tests.push({
          name: 'جلب البيانات',
          status: 'error',
          message: `فشل في جلب البيانات: ${errorMessage}`,
          errorCode: error instanceof Error ? (error as any).code : undefined,
          solution: 'تحقق من صلاحيات القراءة في RLS'
        });
        connectionStatus = 'failed';
      }

      // Test 3: Test CRUD operations (if user is logged in)
      if (user) {
        // Create specific test data for each marketplace
        let testData: any = {
          title: `${marketplaceName} اختبار`,
          description: 'عنصر للاختبار فقط',
          price: 100,
          location: 'الجزائر العاصمة',
          user_id: user.id
        };

        // Add marketplace-specific required fields
        if (marketplaceId === 'vegetables') {
          testData = {
            ...testData,
            vegetable_type: 'tomatoes',
            quantity: 10,
            unit: 'kg',
            freshness: 'excellent', // Must be: excellent, good, fair, poor
            organic: false,
            packaging: 'packaged', // Must be: loose, packaged, bulk
            harvest_date: new Date().toISOString().split('T')[0]
          };
        } else if (marketplaceId === 'land') {
          testData = {
            ...testData,
            // Note: land_listings doesn't have land_type column
            area_size: 1000,
            area_unit: 'hectare', // Changed to match constraint
            listing_type: 'sale'
          };
        } else if (marketplaceId === 'equipment') {
          // We need to get a valid category_id from the database
          // For now, we'll use a placeholder that should be replaced
          testData = {
            ...testData,
            category_id: '00000000-0000-0000-0000-000000000001', // Placeholder UUID
            condition: 'good',
            currency: 'DZD'
          };
        } else if (marketplaceId === 'animals') {
          testData = {
            ...testData,
            animal_type: 'sheep',
            quantity: 5,
            gender: 'mixed',
            currency: 'DZD',
            vaccination_status: false,
            purpose: 'meat'
          };
        } else if (marketplaceId === 'nurseries') {
          testData = {
            ...testData,
            quantity: 50,
            currency: 'DZD'
          };
        }

        // Test INSERT
        try {
          const insertStartTime = Date.now();
          const newItem = await testFunctions.add(testData);
          const insertExecutionTime = Date.now() - insertStartTime;
          
          tests.push({
            name: 'إضافة عنصر',
            status: 'success',
            message: 'تم إضافة عنصر بنجاح',
            executionTime: insertExecutionTime
          });
          permissions.insert = true;

          // Test UPDATE
          try {
            const updateStartTime = Date.now();
            const updatedItem = await testFunctions.update(newItem.id, {
              title: `${marketplaceName} اختبار محدث`
            });
            const updateExecutionTime = Date.now() - updateStartTime;
            
            tests.push({
              name: 'تحديث عنصر',
              status: 'success',
              message: 'تم تحديث عنصر بنجاح',
              executionTime: updateExecutionTime
            });
            permissions.update = true;

            // Test DELETE
            try {
              const deleteStartTime = Date.now();
              await testFunctions.delete(newItem.id);
              const deleteExecutionTime = Date.now() - deleteStartTime;
              
              tests.push({
                name: 'حذف عنصر',
                status: 'success',
                message: 'تم حذف عنصر بنجاح',
                executionTime: deleteExecutionTime
              });
              permissions.delete = true;

            } catch (deleteError) {
              const errorMessage = deleteError instanceof Error ? deleteError.message : 'خطأ غير معروف';
              tests.push({
                name: 'حذف عنصر',
                status: 'error',
                message: `فشل في الحذف: ${errorMessage}`,
                errorCode: deleteError instanceof Error ? (deleteError as any).code : undefined,
                solution: 'تحقق من صلاحيات الحذف في RLS'
              });
            }

          } catch (updateError) {
            const errorMessage = updateError instanceof Error ? updateError.message : 'خطأ غير معروف';
            tests.push({
              name: 'تحديث عنصر',
              status: 'error',
              message: `فشل في التحديث: ${errorMessage}`,
              errorCode: updateError instanceof Error ? (updateError as any).code : undefined,
              solution: 'تحقق من صلاحيات التحديث في RLS'
            });
          }

        } catch (insertError) {
          const errorMessage = insertError instanceof Error ? insertError.message : 'خطأ غير معروف';
          tests.push({
            name: 'إضافة عنصر',
            status: 'error',
            message: `فشل في الإضافة: ${errorMessage}`,
            errorCode: insertError instanceof Error ? (insertError as any).code : undefined,
            solution: 'تحقق من صلاحيات الإدراج في RLS'
          });
        }

      } else {
        tests.push({
          name: 'عمليات CRUD',
          status: 'warning',
          message: 'تخطي اختبارات CRUD - المستخدم غير مسجل دخول'
        });
      }

      // Test 4: RLS Policies
      const rlsTableName = marketplaceId === 'animals' ? 'animal_listings' : 
                           marketplaceId === 'land' ? 'land_listings' : 
                           marketplaceId;
      const rlsTests = await testRLSPolicies(rlsTableName);
      tests.push(...rlsTests);
      rlsEnabled = rlsTests.some(test => test.status === 'success');

      // Test 5: Data structure validation
      try {
        const data = await testFunctions.get();
        if (data.length > 0) {
          const sample = data[0];
          const requiredFields = ['id', 'title', 'user_id'];
          const missingFields = requiredFields.filter(field => !(field in sample));
          
          if (missingFields.length === 0) {
            tests.push({
              name: 'هيكل البيانات',
              status: 'success',
              message: 'هيكل البيانات صحيح'
            });
          } else {
            tests.push({
              name: 'هيكل البيانات',
              status: 'error',
              message: `حقول مفقودة: ${missingFields.join(', ')}`,
              solution: 'تحقق من هيكل الجدول في Supabase'
            });
          }
        }
      } catch (error) {
        tests.push({
          name: 'هيكل البيانات',
          status: 'error',
          message: `فشل في التحقق من هيكل البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
          solution: 'تحقق من إعدادات الجدول'
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      tests.push({
        name: 'اختبار عام',
        status: 'error',
        message: `خطأ عام: ${errorMessage}`,
        solution: 'تحقق من إعدادات Supabase والاتصال'
      });
      connectionStatus = 'failed';
    }

    const finalStatus = tests.some(t => t.status === 'error') ? 'error' : 
                       tests.some(t => t.status === 'warning') ? 'warning' : 'success';

    updateDiagnosticResult(marketplaceId, {
      status: finalStatus,
      tests,
      connectionStatus,
      tableExists,
      rlsEnabled,
      permissions,
      count: parseInt(tests.find(t => t.name === 'جلب البيانات')?.message.match(/\d+/)?.[0] || '0', 10)
    });

    setCurrentTest('');
  };

  const runAllDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);
    addResult('=== بدء التشخيص الشامل ===');
    
    // Reset all diagnostic results
    setDiagnosticResults(prev => prev.map(test => ({
      ...test,
      status: 'pending',
      tests: [],
      count: 0,
      error: undefined,
      connectionStatus: 'pending',
      tableExists: false,
      rlsEnabled: false,
      permissions: { select: false, insert: false, update: false, delete: false }
    })));

    try {
      // Test database connection first
      const dbConnection = await testDatabaseConnection();
      
      if (!dbConnection.success) {
        addResult('❌ فشل الاتصال بقاعدة البيانات - إيقاف الاختبارات');
        setIsRunning(false);
        return;
      }

      // Test each marketplace
      const marketplaces = [
        {
          id: 'equipment',
          name: 'المعدات الزراعية',
          testFunctions: { get: getEquipment, add: addEquipment, update: updateEquipment, delete: deleteEquipment }
        },
        {
          id: 'animals',
          name: 'الحيوانات',
          testFunctions: { get: getAnimals, add: addAnimal, update: updateAnimal, delete: deleteAnimal }
        },
        {
          id: 'land',
          name: 'الأراضي الزراعية',
          testFunctions: { get: getLand, add: addLand, update: updateLand, delete: deleteLand }
        },
        {
          id: 'nurseries',
          name: 'المشاتل والشتلات',
          testFunctions: { get: getNurseries, add: addNursery, update: updateNursery, delete: deleteNursery }
        },
        {
          id: 'vegetables',
          name: 'الخضروات والفواكه',
          testFunctions: { get: getVegetables, add: addVegetable, update: updateVegetable, delete: deleteVegetable }
        }
      ];

      for (const marketplace of marketplaces) {
        await testMarketplace(marketplace.id, marketplace.name, marketplace.testFunctions);
      }

      // Test user profile
      if (user) {
        addResult('👤 اختبار الملف الشخصي...');
        try {
          const profile = await getProfile(user.id);
          if (profile) {
            addResult('✅ الملف الشخصي يعمل بشكل صحيح');
          } else {
            addResult('⚠️ الملف الشخصي غير موجود');
          }
        } catch (error) {
          addResult(`❌ خطأ في الملف الشخصي: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
        }
      }

      // Test statistics
      addResult('📊 اختبار الإحصائيات...');
      try {
        const stats = await getStats();
        addResult(`✅ الإحصائيات: ${JSON.stringify(stats)}`);
      } catch (error) {
        addResult(`❌ خطأ في الإحصائيات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      }

    } catch (error) {
      addResult(`❌ خطأ عام في التشخيص: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }

    addResult('=== انتهى التشخيص الشامل ===');
    setIsRunning(false);
  };

  const resetDiagnostics = () => {
    setDiagnosticResults(prev => prev.map(test => ({
      ...test,
      status: 'pending',
      tests: [],
      count: 0,
      error: undefined,
      connectionStatus: 'pending',
      tableExists: false,
      rlsEnabled: false,
      permissions: { select: false, insert: false, update: false, delete: false }
    })));
    setResults([]);
    setShowDetails([]);
    setCurrentTest('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '⏳';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'timeout': return 'text-yellow-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🔧 تشخيص شامل للأسواق</h1>
          <p className="text-gray-600 text-lg">تشخيص شامل لقاعدة البيانات وجميع وظائف السوق مع تقارير مفصلة</p>
        </div>

        {/* User Status */}
        <div className={`p-4 rounded-lg mb-6 ${user ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {user ? '✅ المستخدم مسجل دخول' : '⚠️ المستخدم غير مسجل دخول'}
              </h3>
              <p className="text-sm text-gray-600">
                {user ? `البريد الإلكتروني: ${user.email}` : 'بعض الاختبارات تتطلب تسجيل الدخول'}
              </p>
            </div>
            {!user && (
              <Link 
                href="/auth/login"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>

        {/* Database Connection Status */}
        <div className={`p-4 rounded-lg mb-6 ${databaseInfo.connectionStatus === 'connected' ? 'bg-green-50 border border-green-200' : databaseInfo.connectionStatus === 'failed' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {databaseInfo.connectionStatus === 'connected' ? '✅ متصل بقاعدة البيانات' : 
                 databaseInfo.connectionStatus === 'failed' ? '❌ فشل الاتصال' : '⏳ جاري الاختبار'}
              </h3>
              <p className="text-sm text-gray-600">
                {databaseInfo.connectionStatus === 'connected' ? 
                  `الجداول المتاحة: ${databaseInfo.tables.join(', ')}` : 
                  'تحقق من إعدادات Supabase'}
              </p>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={runAllDiagnostics}
            disabled={isRunning}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isRunning 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isRunning ? '🔄 جاري التشخيص...' : '🚀 تشغيل التشخيص الشامل'}
          </button>

          <button 
            onClick={resetDiagnostics}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            🔄 إعادة تعيين
          </button>

          <button 
            onClick={() => setShowDetails(prev => prev.length === 0 ? diagnosticResults.map(t => t.id) : [])}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
          >
            {showDetails.length === 0 ? '👁️ عرض التفاصيل' : '👁️ إخفاء التفاصيل'}
          </button>
        </div>

        {/* Current Test Indicator */}
        {currentTest && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="font-medium">جاري اختبار: {diagnosticResults.find(r => r.id === currentTest)?.name}</span>
            </div>
          </div>
        )}

        {/* Diagnostic Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {diagnosticResults.map((test) => (
            <div 
              key={test.id} 
              className={`border rounded-lg p-6 transition-all hover:shadow-lg ${getStatusBgColor(test.status)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{test.emoji}</span>
                  <div>
                    <h3 className="font-bold text-lg">{test.name}</h3>
                    <div className="flex items-center gap-2">
                      <span>{getStatusIcon(test.status)}</span>
                      <span className={`font-medium ${getStatusColor(test.status)}`}>
                        {test.status === 'pending' && 'في الانتظار'}
                        {test.status === 'success' && 'نجح'}
                        {test.status === 'error' && 'فشل'}
                        {test.status === 'warning' && 'تحذير'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleDetails(test.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showDetails.includes(test.id) ? '▼' : '▶'}
                </button>
              </div>

              {/* Connection Status */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className={`font-medium ${getConnectionStatusColor(test.connectionStatus)}`}>
                    {test.connectionStatus === 'connected' ? '✅ متصل' : 
                     test.connectionStatus === 'failed' ? '❌ فشل' : 
                     test.connectionStatus === 'timeout' ? '⏰ انتهت المهلة' : '⏳ في الانتظار'}
                  </span>
                  <span className="text-gray-600">الاتصال</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className={test.tableExists ? 'text-green-600' : 'text-red-600'}>
                    {test.tableExists ? '✅' : '❌'}
                  </span>
                  <span className="text-gray-600">الجدول موجود</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className={test.rlsEnabled ? 'text-green-600' : 'text-yellow-600'}>
                    {test.rlsEnabled ? '✅' : '⚠️'}
                  </span>
                  <span className="text-gray-600">RLS مفعل</span>
                </div>
              </div>

              {/* Permissions */}
              {test.status !== 'pending' && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">الصلاحيات:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center gap-1 ${test.permissions.select ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{test.permissions.select ? '✅' : '❌'}</span>
                      <span>قراءة</span>
                    </div>
                    <div className={`flex items-center gap-1 ${test.permissions.insert ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{test.permissions.insert ? '✅' : '❌'}</span>
                      <span>إدراج</span>
                    </div>
                    <div className={`flex items-center gap-1 ${test.permissions.update ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{test.permissions.update ? '✅' : '❌'}</span>
                      <span>تحديث</span>
                    </div>
                    <div className={`flex items-center gap-1 ${test.permissions.delete ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{test.permissions.delete ? '✅' : '❌'}</span>
                      <span>حذف</span>
                    </div>
                  </div>
                </div>
              )}

              {test.status !== 'pending' && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700">
                    عدد العناصر: {test.count}
                  </div>
                  {test.error && (
                    <div className="text-sm text-red-600 mt-1">
                      خطأ: {test.error}
                    </div>
                  )}
                </div>
              )}

              {/* Test Details */}
              {showDetails.includes(test.id) && test.tests.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">تفاصيل الاختبارات:</h4>
                  {test.tests.map((testDetail, index) => (
                    <div key={index} className="bg-white rounded p-3 border">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{getStatusIcon(testDetail.status)}</span>
                        <span className="font-medium text-sm">{testDetail.name}</span>
                        {testDetail.executionTime && (
                          <span className="text-xs text-gray-500">({testDetail.executionTime}ms)</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{testDetail.message}</p>
                      
                      {testDetail.errorCode && (
                        <div className="mt-1 text-xs">
                          <span className="font-medium text-red-600">كود الخطأ:</span> {testDetail.errorCode}
                        </div>
                      )}
                      
                      {testDetail.errorHint && (
                        <div className="mt-1 text-xs">
                          <span className="font-medium text-blue-600">تلميح:</span> {testDetail.errorHint}
                        </div>
                      )}
                      
                      {testDetail.solution && (
                        <div className="mt-1 text-xs">
                          <span className="font-medium text-green-600">الحل:</span> {testDetail.solution}
                        </div>
                      )}
                      
                      {testDetail.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-blue-600 cursor-pointer">عرض التفاصيل</summary>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(testDetail.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-4 flex gap-2">
                <Link 
                  href={`/${test.id}`}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  زيارة السوق
                </Link>
                <Link 
                  href={`/${test.id}/new`}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                >
                  إضافة جديد
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Results Log */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">📝 سجل التشخيص</h3>
          <div className="bg-gray-100 rounded p-4 h-64 overflow-y-auto font-mono text-sm">
            {results.length === 0 ? (
              <div className="text-gray-500">
                انقر على "تشغيل التشخيص الشامل" لبدء التشخيص...
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((result, index) => (
                  <div key={index} className="text-gray-800">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {diagnosticResults.some(t => t.status !== 'pending') && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">📊 ملخص التشخيص</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {diagnosticResults.filter(t => t.status === 'success').length}
                </div>
                <div className="text-sm text-green-700">نجح</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {diagnosticResults.filter(t => t.status === 'error').length}
                </div>
                <div className="text-sm text-red-700">فشل</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {diagnosticResults.filter(t => t.status === 'warning').length}
                </div>
                <div className="text-sm text-yellow-700">تحذير</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {diagnosticResults.filter(t => t.connectionStatus === 'connected').length}
                </div>
                <div className="text-sm text-blue-700">متصل</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceDiagnosticPage; 