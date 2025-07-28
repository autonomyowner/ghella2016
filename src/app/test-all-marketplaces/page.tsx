'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseData } from '@/hooks/useSupabase';
import Link from 'next/link';

interface TestResult {
  id: string;
  name: string;
  emoji: string;
  color: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  tests: {
    name: string;
    status: string;
    message: string;
    details?: any;
  }[];
  count: number;
  error?: string;
}

interface TestData {
  equipment: any;
  animals: any;
  land: any;
  nurseries: any;
  vegetables: any;
  labor: any;
  analysis: any;
  delivery: any;
  categories: any;
}

const TestAllMarketplacesPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { 
    // Equipment
    getEquipment, addEquipment, updateEquipment, deleteEquipment,
    // Animals
    getAnimals, addAnimal, updateAnimal, deleteAnimal,
    // Land
    getLand, addLand, updateLand, deleteLand,
    // Nurseries
    getNurseries, addNursery, updateNursery, deleteNursery,
    // Vegetables
    getVegetables, addVegetable, updateVegetable, deleteVegetable,
    // Labor
    getLabor, addLabor, updateLabor, deleteLabor,
    // Analysis
    getAnalysis, addAnalysis, updateAnalysis, deleteAnalysis,
    // Delivery
    getDelivery, addDelivery, updateDelivery, deleteDelivery,
    // Categories
    getCategories,
    // Profile
    getProfile,
    // Stats
    getStats
  } = useSupabaseData();
  
  const [testResults, setTestResults] = useState<TestResult[]>([
    {
      id: 'equipment',
      name: 'المعدات الزراعية',
      emoji: '🚜',
      color: 'bg-blue-500',
      status: 'pending',
      tests: [],
      count: 0
    },
    {
      id: 'animals',
      name: 'الحيوانات',
      emoji: '🐄',
      color: 'bg-orange-500',
      status: 'pending',
      tests: [],
      count: 0
    },
    {
      id: 'land',
      name: 'الأراضي الزراعية',
      emoji: '🌾',
      color: 'bg-emerald-500',
      status: 'pending',
      tests: [],
      count: 0
    },
    {
      id: 'nurseries',
      name: 'المشاتل والشتلات',
      emoji: '🌱',
      color: 'bg-green-500',
      status: 'pending',
      tests: [],
      count: 0
    },
    {
      id: 'vegetables',
      name: 'الخضروات والفواكه',
      emoji: '🍅',
      color: 'bg-red-500',
      status: 'pending',
      tests: [],
      count: 0
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [testData, setTestData] = useState<TestData>({} as TestData);
  const [showDetails, setShowDetails] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const updateTestResult = (id: string, updates: Partial<TestResult>) => {
    setTestResults(prev => prev.map(test => 
      test.id === id ? { ...test, ...updates } : test
    ));
  };

  const addTestToResult = (id: string, test: TestResult['tests'][0]) => {
    setTestResults(prev => prev.map(result => 
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

  // Test Equipment
  const testEquipment = async () => {
    const tests = [];
    
    try {
      // Test 1: Fetch equipment
      addResult('🔍 اختبار جلب المعدات...');
      const equipment = await getEquipment();
              tests.push({
          name: 'جلب المعدات',
          status: 'success' as const,
          message: `تم جلب ${equipment.length} معدة بنجاح`,
          details: equipment
        });
      setTestData(prev => ({ ...prev, equipment }));

      // Test 2: Add equipment (if user is logged in)
      if (user) {
        addResult('➕ اختبار إضافة معدة...');
        const testEquipmentData = {
          title: 'معدة اختبار',
          description: 'معدة للاختبار فقط',
          category_id: '1',
          price: 1000,
          condition: 'جيد',
          location: 'الجزائر العاصمة',
          contact_phone: '0770123456',
          images: []
        };

        try {
          const newEquipment = await addEquipment(testEquipmentData);
          tests.push({
            name: 'إضافة معدة',
            status: 'success',
            message: 'تم إضافة معدة بنجاح',
            details: newEquipment
          });

          // Test 3: Update equipment
          addResult('✏️ اختبار تحديث معدة...');
          const updatedEquipment = await updateEquipment(newEquipment.id, {
            title: 'معدة اختبار محدثة',
            price: 1200
          });
          tests.push({
            name: 'تحديث معدة',
            status: 'success',
            message: 'تم تحديث معدة بنجاح',
            details: updatedEquipment
          });

          // Test 4: Delete equipment
          addResult('🗑️ اختبار حذف معدة...');
          await deleteEquipment(newEquipment.id);
          tests.push({
            name: 'حذف معدة',
            status: 'success',
            message: 'تم حذف معدة بنجاح'
          });

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
          tests.push({
            name: 'عمليات CRUD',
            status: 'error',
            message: `فشل في عمليات CRUD: ${errorMessage}`,
            details: error
          });
        }
      } else {
        tests.push({
          name: 'عمليات CRUD',
          status: 'warning',
          message: 'تخطي عمليات CRUD - المستخدم غير مسجل دخول'
        });
      }

      // Test 5: Validate equipment structure
      if (equipment.length > 0) {
        const sample = equipment[0];
        const requiredFields = ['id', 'title', 'price', 'location', 'user_id'];
        const missingFields = requiredFields.filter(field => !(field in sample));
        
        if (missingFields.length === 0) {
          tests.push({
            name: 'هيكل البيانات',
            status: 'success',
            message: 'هيكل بيانات المعدات صحيح'
          });
        } else {
          tests.push({
            name: 'هيكل البيانات',
            status: 'error',
            message: `حقول مفقودة: ${missingFields.join(', ')}`
          });
        }
      }

      updateTestResult('equipment', {
        status: tests.some(t => t.status === 'error') ? 'error' : 'success',
        count: equipment.length,
        tests
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      tests.push({
        name: 'جلب المعدات',
        status: 'error',
        message: errorMessage,
        details: error
      });
      
      updateTestResult('equipment', {
        status: 'error',
        error: errorMessage,
        tests
      });
    }
  };

  // Test Vegetables
  const testVegetables = async () => {
    const tests = [];
    
    try {
      // Test 1: Fetch vegetables
      addResult('🔍 اختبار جلب الخضروات...');
      const vegetables = await getVegetables();
      tests.push({
        name: 'جلب الخضروات',
        status: 'success',
        message: `تم جلب ${vegetables.length} خضروات بنجاح`,
        details: vegetables
      });
      setTestData(prev => ({ ...prev, vegetables }));

      // Test 2: Add vegetable (if user is logged in)
      if (user) {
        addResult('➕ اختبار إضافة خضروات...');
        const testVegetableData = {
          title: 'طماطم اختبار',
          description: 'طماطم للاختبار فقط',
          vegetable_type: 'tomatoes',
          price: 150,
          quantity: 10,
          unit: 'kg',
          location: 'الجزائر العاصمة',
          harvest_date: new Date().toISOString().split('T')[0],
          contact_phone: '0770123456',
          images: []
        };

        try {
          const newVegetable = await addVegetable(testVegetableData);
          tests.push({
            name: 'إضافة خضروات',
            status: 'success',
            message: 'تم إضافة خضروات بنجاح',
            details: newVegetable
          });

          // Test 3: Update vegetable
          addResult('✏️ اختبار تحديث خضروات...');
          const updatedVegetable = await updateVegetable(newVegetable.id, {
            title: 'طماطم اختبار محدثة',
            price: 180
          });
          tests.push({
            name: 'تحديث خضروات',
            status: 'success',
            message: 'تم تحديث خضروات بنجاح',
            details: updatedVegetable
          });

          // Test 4: Delete vegetable
          addResult('🗑️ اختبار حذف خضروات...');
          await deleteVegetable(newVegetable.id);
          tests.push({
            name: 'حذف خضروات',
            status: 'success',
            message: 'تم حذف خضروات بنجاح'
          });

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
          tests.push({
            name: 'عمليات CRUD',
            status: 'error',
            message: `فشل في عمليات CRUD: ${errorMessage}`,
            details: error
          });
        }
      } else {
        tests.push({
          name: 'عمليات CRUD',
          status: 'warning',
          message: 'تخطي عمليات CRUD - المستخدم غير مسجل دخول'
        });
      }

      // Test 5: Validate vegetable structure
      if (vegetables.length > 0) {
        const sample = vegetables[0];
        const requiredFields = ['id', 'title', 'vegetable_type', 'price', 'quantity', 'location', 'user_id'];
        const missingFields = requiredFields.filter(field => !(field in sample));
        
        if (missingFields.length === 0) {
          tests.push({
            name: 'هيكل البيانات',
            status: 'success',
            message: 'هيكل بيانات الخضروات صحيح'
          });
        } else {
          tests.push({
            name: 'هيكل البيانات',
            status: 'error',
            message: `حقول مفقودة: ${missingFields.join(', ')}`
          });
        }
      }

      updateTestResult('vegetables', {
        status: tests.some(t => t.status === 'error') ? 'error' : 'success',
        count: vegetables.length,
        tests
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      tests.push({
        name: 'جلب الخضروات',
        status: 'error',
        message: errorMessage,
        details: error
      });
      
      updateTestResult('vegetables', {
        status: 'error',
        error: errorMessage,
        tests
      });
    }
  };

  // Test Land
  const testLand = async () => {
    const tests = [];
    
    try {
      // Test 1: Fetch land
      addResult('🔍 اختبار جلب الأراضي...');
      const land = await getLand();
      tests.push({
        name: 'جلب الأراضي',
        status: 'success',
        message: `تم جلب ${land.length} أرض بنجاح`,
        details: land
      });
      setTestData(prev => ({ ...prev, land }));

      // Test 2: Add land (if user is logged in)
      if (user) {
        addResult('➕ اختبار إضافة أرض...');
        const testLandData = {
          title: 'أرض اختبار',
          description: 'أرض للاختبار فقط',
          land_type: 'agricultural',
          area_size: 1000,
          unit: 'm2',
          price: 50000,
          location: 'الجزائر العاصمة',
          contact_phone: '0770123456',
          images: []
        };

        try {
          const newLand = await addLand(testLandData);
          tests.push({
            name: 'إضافة أرض',
            status: 'success',
            message: 'تم إضافة أرض بنجاح',
            details: newLand
          });

          // Test 3: Update land
          addResult('✏️ اختبار تحديث أرض...');
          const updatedLand = await updateLand(newLand.id, {
            title: 'أرض اختبار محدثة',
            price: 55000
          });
          tests.push({
            name: 'تحديث أرض',
            status: 'success',
            message: 'تم تحديث أرض بنجاح',
            details: updatedLand
          });

          // Test 4: Delete land
          addResult('🗑️ اختبار حذف أرض...');
          await deleteLand(newLand.id);
          tests.push({
            name: 'حذف أرض',
            status: 'success',
            message: 'تم حذف أرض بنجاح'
          });

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
          tests.push({
            name: 'عمليات CRUD',
            status: 'error',
            message: `فشل في عمليات CRUD: ${errorMessage}`,
            details: error
          });
        }
      } else {
        tests.push({
          name: 'عمليات CRUD',
          status: 'warning',
          message: 'تخطي عمليات CRUD - المستخدم غير مسجل دخول'
        });
      }

      // Test 5: Validate land structure
      if (land.length > 0) {
        const sample = land[0];
        const requiredFields = ['id', 'title', 'land_type', 'area_size', 'price', 'location', 'user_id'];
        const missingFields = requiredFields.filter(field => !(field in sample));
        
        if (missingFields.length === 0) {
          tests.push({
            name: 'هيكل البيانات',
            status: 'success',
            message: 'هيكل بيانات الأراضي صحيح'
          });
        } else {
          tests.push({
            name: 'هيكل البيانات',
            status: 'error',
            message: `حقول مفقودة: ${missingFields.join(', ')}`
          });
        }
      }

      updateTestResult('land', {
        status: tests.some(t => t.status === 'error') ? 'error' : 'success',
        count: land.length,
        tests
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      tests.push({
        name: 'جلب الأراضي',
        status: 'error',
        message: errorMessage,
        details: error
      });
      
      updateTestResult('land', {
        status: 'error',
        error: errorMessage,
        tests
      });
    }
  };

  // Test Nurseries
  const testNurseries = async () => {
    const tests = [];
    
    try {
      // Test 1: Fetch nurseries
      addResult('🔍 اختبار جلب المشاتل...');
      const nurseries = await getNurseries();
      tests.push({
        name: 'جلب المشاتل',
        status: 'success',
        message: `تم جلب ${nurseries.length} مشتل بنجاح`,
        details: nurseries
      });
      setTestData(prev => ({ ...prev, nurseries }));

      // Test 2: Add nursery (if user is logged in)
      if (user) {
        addResult('➕ اختبار إضافة مشتل...');
        const testNurseryData = {
          title: 'مشتل اختبار',
          description: 'مشتل للاختبار فقط',
          nursery_type: 'fruit_trees',
          quantity: 50,
          unit: 'piece',
          price: 500,
          location: 'الجزائر العاصمة',
          contact_phone: '0770123456',
          images: []
        };

        try {
          const newNursery = await addNursery(testNurseryData);
          tests.push({
            name: 'إضافة مشتل',
            status: 'success',
            message: 'تم إضافة مشتل بنجاح',
            details: newNursery
          });

          // Test 3: Update nursery
          addResult('✏️ اختبار تحديث مشتل...');
          const updatedNursery = await updateNursery(newNursery.id, {
            title: 'مشتل اختبار محدث',
            price: 550
          });
          tests.push({
            name: 'تحديث مشتل',
            status: 'success',
            message: 'تم تحديث مشتل بنجاح',
            details: updatedNursery
          });

          // Test 4: Delete nursery
          addResult('🗑️ اختبار حذف مشتل...');
          await deleteNursery(newNursery.id);
          tests.push({
            name: 'حذف مشتل',
            status: 'success',
            message: 'تم حذف مشتل بنجاح'
          });

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
          tests.push({
            name: 'عمليات CRUD',
            status: 'error',
            message: `فشل في عمليات CRUD: ${errorMessage}`,
            details: error
          });
        }
      } else {
        tests.push({
          name: 'عمليات CRUD',
          status: 'warning',
          message: 'تخطي عمليات CRUD - المستخدم غير مسجل دخول'
        });
      }

      // Test 5: Validate nursery structure
      if (nurseries.length > 0) {
        const sample = nurseries[0];
        const requiredFields = ['id', 'title', 'nursery_type', 'quantity', 'price', 'location', 'user_id'];
        const missingFields = requiredFields.filter(field => !(field in sample));
        
        if (missingFields.length === 0) {
          tests.push({
            name: 'هيكل البيانات',
            status: 'success',
            message: 'هيكل بيانات المشاتل صحيح'
          });
        } else {
          tests.push({
            name: 'هيكل البيانات',
            status: 'error',
            message: `حقول مفقودة: ${missingFields.join(', ')}`
          });
        }
      }

      updateTestResult('nurseries', {
        status: tests.some(t => t.status === 'error') ? 'error' : 'success',
        count: nurseries.length,
        tests
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      tests.push({
        name: 'جلب المشاتل',
        status: 'error',
        message: errorMessage,
        details: error
      });
      
      updateTestResult('nurseries', {
        status: 'error',
        error: errorMessage,
        tests
      });
    }
  };

  // Test other marketplaces
  const testOtherMarketplaces = async () => {
    const marketplaces = [
      { id: 'animals', name: 'الحيوانات', testFn: getAnimals, addFn: addAnimal, updateFn: updateAnimal, deleteFn: deleteAnimal }
    ];

    for (const marketplace of marketplaces) {
      const tests = [];
      
      try {
        // Test 1: Fetch data
        addResult(`🔍 اختبار جلب ${marketplace.name}...`);
        const data = await marketplace.testFn();
        tests.push({
          name: `جلب ${marketplace.name}`,
          status: 'success',
          message: `تم جلب ${data.length} عنصر بنجاح`,
          details: data
        });
        setTestData(prev => ({ ...prev, [marketplace.id]: data }));

        // Test 2: CRUD operations (if available)
        if (marketplace.addFn && user) {
          addResult(`➕ اختبار إضافة ${marketplace.name}...`);
          try {
            const testData = {
              title: `${marketplace.name} اختبار`,
              description: `${marketplace.name} للاختبار فقط`,
              price: 100,
              location: 'الجزائر العاصمة',
              contact_phone: '0770123456',
              images: []
            };

            const newItem = await marketplace.addFn(testData);
            tests.push({
              name: `إضافة ${marketplace.name}`,
              status: 'success',
              message: `تم إضافة ${marketplace.name} بنجاح`,
              details: newItem
            });

            if (marketplace.updateFn) {
              const updatedItem = await marketplace.updateFn(newItem.id, {
                title: `${marketplace.name} اختبار محدث`
              });
              tests.push({
                name: `تحديث ${marketplace.name}`,
                status: 'success',
                message: `تم تحديث ${marketplace.name} بنجاح`,
                details: updatedItem
              });
            }

            if (marketplace.deleteFn) {
              await marketplace.deleteFn(newItem.id);
              tests.push({
                name: `حذف ${marketplace.name}`,
                status: 'success',
                message: `تم حذف ${marketplace.name} بنجاح`
              });
            }

          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
            tests.push({
              name: `عمليات CRUD ${marketplace.name}`,
              status: 'error',
              message: `فشل في عمليات CRUD: ${errorMessage}`,
              details: error
            });
          }
        } else if (!user) {
          tests.push({
            name: `عمليات CRUD ${marketplace.name}`,
            status: 'warning',
            message: 'تخطي عمليات CRUD - المستخدم غير مسجل دخول'
          });
        }

        // Test 3: Validate structure
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
              message: `حقول مفقودة: ${missingFields.join(', ')}`
            });
          }
        }

        updateTestResult(marketplace.id, {
          status: tests.some(t => t.status === 'error') ? 'error' : 'success',
          count: data.length,
          tests
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
        tests.push({
          name: `جلب ${marketplace.name}`,
          status: 'error',
          message: errorMessage,
          details: error
        });
        
        updateTestResult(marketplace.id, {
          status: 'error',
          error: errorMessage,
          tests
        });
      }
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    addResult('=== بدء اختبار شامل لجميع الأسواق ===');
    
    // Reset all test results
    setTestResults(prev => prev.map(test => ({
      ...test,
      status: 'pending',
      tests: [],
      count: 0,
      error: undefined
    })));

    try {
      // Test main marketplaces with detailed CRUD
      await testEquipment();
      await testVegetables();
      await testLand();
      await testNurseries();
      
      // Test animals marketplace
      await testOtherMarketplaces();

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
      addResult(`❌ خطأ عام في الاختبارات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }

    addResult('=== انتهى اختبار جميع الأسواق ===');
    setIsRunning(false);
  };

  const resetTests = () => {
    setTestResults(prev => prev.map(test => ({
      ...test,
      status: 'pending',
      tests: [],
      count: 0,
      error: undefined
    })));
    setResults([]);
    setTestData({} as TestData);
    setShowDetails([]);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🧪 اختبار شامل لجميع الأسواق</h1>
          <p className="text-gray-600 text-lg">اختبار شامل لقاعدة البيانات وجميع وظائف السوق</p>
          
          {/* Diagnostic Page Link */}
          <div className="mt-4">
            <Link 
              href="/test-marketplace-diagnostic"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              🔧 صفحة التشخيص المتقدمة
            </Link>
            <p className="text-sm text-gray-500 mt-2">
              للحصول على تشخيص مفصل للأخطاء وحلولها
            </p>
          </div>
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

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={runAllTests}
            disabled={isRunning}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isRunning 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isRunning ? '🔄 جاري الاختبار...' : '🚀 تشغيل جميع الاختبارات'}
          </button>

          <button 
            onClick={resetTests}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            🔄 إعادة تعيين
          </button>

          <button 
            onClick={() => setShowDetails(prev => prev.length === 0 ? testResults.map(t => t.id) : [])}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
          >
            {showDetails.length === 0 ? '👁️ عرض التفاصيل' : '👁️ إخفاء التفاصيل'}
          </button>
        </div>

        {/* Test Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {testResults.map((test) => (
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
                      </div>
                      <p className="text-sm text-gray-600">{testDetail.message}</p>
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
          <h3 className="text-xl font-bold mb-4">📝 سجل النتائج</h3>
          <div className="bg-gray-100 rounded p-4 h-64 overflow-y-auto font-mono text-sm">
            {results.length === 0 ? (
              <div className="text-gray-500">
                انقر على "تشغيل جميع الاختبارات" لبدء الاختبار...
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
        {testResults.some(t => t.status !== 'pending') && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">📊 ملخص النتائج</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {testResults.filter(t => t.status === 'success').length}
                </div>
                <div className="text-sm text-green-700">نجح</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {testResults.filter(t => t.status === 'error').length}
                </div>
                <div className="text-sm text-red-700">فشل</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {testResults.filter(t => t.status === 'warning').length}
                </div>
                <div className="text-sm text-yellow-700">تحذير</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {testResults.reduce((sum, t) => sum + t.count, 0)}
                </div>
                <div className="text-sm text-blue-700">إجمالي العناصر</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAllMarketplacesPage; 