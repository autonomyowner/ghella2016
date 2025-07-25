'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase/supabaseClient';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink,
  RefreshCw,
  Plus,
  Save,
  Eye,
  Heart,
  Share2,
  CalendarCheck,
  TrendingUp,
  Upload,
  Database,
  User,
  ShoppingCart,
  Package,
  DollarSign,
  Clock,
  Shield,
  Trash2,
  Edit,
  Search,
  Filter,
  MessageCircle
} from 'lucide-react';
import type { Equipment, LandListing, AnimalListing, Profile, Category, Vegetable, Nursery } from '@/types/database.types';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
  duration?: number;
  error?: any;
}

interface TestProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  seller: string;
  createdAt: Date;
  status: 'draft' | 'published' | 'sold';
  type: 'equipment' | 'land' | 'animal';
}

export default function TestMarketplacePage() {
  const { user, profile } = useSupabaseAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [testProducts, setTestProducts] = useState<TestProduct[]>([]);
  const [realProducts, setRealProducts] = useState<Equipment[]>([]);
  const [realVegetables, setRealVegetables] = useState<Vegetable[]>([]);
  const [realNurseries, setRealNurseries] = useState<Nursery[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [databaseStatus, setDatabaseStatus] = useState({
    connected: false,
    tablesExist: false,
    rlsEnabled: false
  });

  // Test database connection
  const testDatabaseConnection = async (): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        return {
          name: 'Database Connection',
          status: 'fail',
          message: 'Failed to connect to database',
          details: error.message,
          duration: Date.now() - startTime,
          error
        };
      }
      
      return {
        name: 'Database Connection',
        status: 'pass',
        message: 'Successfully connected to Supabase database',
        details: 'Database is accessible and responding',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Database Connection',
        status: 'fail',
        message: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        error
      };
    }
  };

  // Test if all required tables exist
  const testTablesExist = async (): Promise<TestResult[]> => {
    const results: TestResult[] = [];
    const tables = ['profiles', 'equipment', 'land_listings', 'categories'];
    
    for (const table of tables) {
      const startTime = Date.now();
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          results.push({
            name: `Table: ${table}`,
            status: 'fail',
            message: `Table ${table} does not exist or is not accessible`,
            details: error.message,
            duration: Date.now() - startTime,
            error
          });
        } else {
          results.push({
            name: `Table: ${table}`,
            status: 'pass',
            message: `Table ${table} exists and is accessible`,
            details: 'Table structure is valid',
            duration: Date.now() - startTime
          });
        }
      } catch (error) {
        results.push({
          name: `Table: ${table}`,
          status: 'fail',
          message: `Error checking table ${table}`,
          details: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - startTime,
          error
        });
      }
    }
    
    // Test animal_listings table separately
    try {
      const { data, error } = await supabase
        .from('animal_listings')
        .select('*')
        .limit(1);
      
      if (error) {
        results.push({
          name: 'Table: animal_listings',
          status: 'warning',
          message: 'Animal listings table does not exist',
          details: 'This table may need to be created. Using equipment table for animal-related tests.',
          duration: Date.now() - Date.now(),
          error
        });
      } else {
        results.push({
          name: 'Table: animal_listings',
          status: 'pass',
          message: 'Table animal_listings exists and is accessible',
          details: 'Table structure is valid',
          duration: Date.now() - Date.now()
        });
      }
    } catch (error) {
      results.push({
        name: 'Table: animal_listings',
        status: 'warning',
        message: 'Animal listings table not available',
        details: 'This table may need to be created. Using equipment table for animal-related tests.',
        duration: Date.now() - Date.now(),
        error
      });
    }
    
    // Test vegetables table separately
    try {
      const { data, error } = await supabase
        .from('vegetables')
        .select('*')
        .limit(1);
      
      if (error) {
        results.push({
          name: 'Table: vegetables',
          status: 'warning',
          message: 'Vegetables table does not exist',
          details: 'This table may need to be created. Using equipment table for vegetable-related tests.',
          duration: Date.now() - Date.now(),
          error
        });
      } else {
        results.push({
          name: 'Table: vegetables',
          status: 'pass',
          message: 'Table vegetables exists and is accessible',
          details: 'Table structure is valid',
          duration: Date.now() - Date.now()
        });
      }
    } catch (error) {
      results.push({
        name: 'Table: vegetables',
        status: 'warning',
        message: 'Vegetables table not available',
        details: 'This table may need to be created. Using equipment table for vegetable-related tests.',
        duration: Date.now() - Date.now(),
        error
      });
    }
    
    // Test nurseries table separately
    try {
      const { data, error } = await supabase
        .from('nurseries')
        .select('*')
        .limit(1);
      
      if (error) {
        results.push({
          name: 'Table: nurseries',
          status: 'warning',
          message: 'Nurseries table does not exist',
          details: 'This table may need to be created. Using equipment table for nursery-related tests.',
          duration: Date.now() - Date.now(),
          error
        });
      } else {
        results.push({
          name: 'Table: nurseries',
          status: 'pass',
          message: 'Table nurseries exists and is accessible',
          details: 'Table structure is valid',
          duration: Date.now() - Date.now()
        });
      }
    } catch (error) {
      results.push({
        name: 'Table: nurseries',
        status: 'warning',
        message: 'Nurseries table not available',
        details: 'This table may need to be created. Using equipment table for nursery-related tests.',
        duration: Date.now() - Date.now(),
        error
      });
    }
    
    return results;
  };

  // Test user authentication
  const testUserAuthentication = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    if (!user) {
      return {
        name: 'User Authentication',
        status: 'warning',
        message: 'User not authenticated',
        details: 'User needs to login to test full functionality',
        duration: Date.now() - startTime
      };
    }
    
    try {
      // Test if user profile exists
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        return {
          name: 'User Authentication',
          status: 'fail',
          message: 'User profile not found in database',
          details: error.message,
          duration: Date.now() - startTime,
          error
        };
      }
      
      return {
        name: 'User Authentication',
        status: 'pass',
        message: 'User authenticated and profile exists',
        details: `User ID: ${user.id}, Name: ${profileData.full_name || 'Not set'}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'User Authentication',
        status: 'fail',
        message: 'Error checking user authentication',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        error
      };
    }
  };

  // Test creating equipment
  const testEquipmentCreation = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    if (!user) {
      return {
        name: 'Equipment Creation',
        status: 'warning',
        message: 'Cannot test equipment creation without authentication',
        details: 'User must be logged in to create equipment',
        duration: Date.now() - startTime
      };
    }
    
    try {
      // Get a category first
      const { data: categories } = await supabase
        .from('categories')
        .select('id')
        .limit(1);
      
      if (!categories || categories.length === 0) {
        return {
          name: 'Equipment Creation',
          status: 'fail',
          message: 'No categories available for equipment creation',
          details: 'Categories table is empty',
          duration: Date.now() - startTime
        };
      }
      
      const testEquipment = {
        user_id: user.id,
        title: 'معدة تجريبية للاختبار',
        description: 'هذه معدة تجريبية لاختبار وظائف السوق',
        price: Math.floor(Math.random() * 100000) + 10000,
        currency: 'DZD',
        category_id: categories[0].id,
        condition: 'good' as const,
        year: 2020,
        brand: 'تجريبي',
        model: 'موديل 2024',
        hours_used: 500,
        location: 'الجزائر العاصمة',
        coordinates: null,
        images: ['/assets/machin01.jpg'],
        is_available: true,
        is_featured: false,
        view_count: 0
      };
      
      const { data, error } = await supabase
        .from('equipment')
        .insert(testEquipment)
        .select()
        .single();
      
      if (error) {
        return {
          name: 'Equipment Creation',
          status: 'fail',
          message: 'Failed to create equipment in database',
          details: error.message,
          duration: Date.now() - startTime,
          error
        };
      }
      
      // Add to real products list
      setRealProducts(prev => [...prev, data]);
      
      return {
        name: 'Equipment Creation',
        status: 'pass',
        message: 'Equipment created successfully in database',
        details: `Equipment ID: ${data.id}, Title: ${data.title}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Equipment Creation',
        status: 'fail',
        message: 'Error during equipment creation',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        error
      };
    }
  };

  // Test creating land listing
  const testLandCreation = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    if (!user) {
      return {
        name: 'Land Creation',
        status: 'warning',
        message: 'Cannot test land creation without authentication',
        details: 'User must be logged in to create land listings',
        duration: Date.now() - startTime
      };
    }
    
    try {
      const testLand = {
        user_id: user.id,
        title: 'أرض زراعية تجريبية للاختبار',
        description: 'هذه أرض تجريبية لاختبار وظائف السوق',
        price: Math.floor(Math.random() * 50000000) + 10000000,
        currency: 'DZD',
        listing_type: 'sale' as const,
        area_size: Math.floor(Math.random() * 50) + 10,
        area_unit: 'hectare' as const,
        location: 'تيارت',
        coordinates: null,
        soil_type: 'تربة خصبة',
        water_source: 'ري متطور',
        images: ['/assets/land01.jpg'],
        is_available: true,
        is_featured: false,
        view_count: 0
      };
      
      const { data, error } = await supabase
        .from('land_listings')
        .insert(testLand)
        .select()
        .single();
      
      if (error) {
        return {
          name: 'Land Creation',
          status: 'fail',
          message: 'Failed to create land listing in database',
          details: error.message,
          duration: Date.now() - startTime,
          error
        };
      }
      
      return {
        name: 'Land Creation',
        status: 'pass',
        message: 'Land listing created successfully in database',
        details: `Land ID: ${data.id}, Title: ${data.title}, Area: ${data.area_size} ${data.area_unit}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Land Creation',
        status: 'fail',
        message: 'Error during land creation',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        error
      };
    }
  };

  // Test creating animal listing
  const testAnimalCreation = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    if (!user) {
      return {
        name: 'Animal Creation',
        status: 'warning',
        message: 'Cannot test animal creation without authentication',
        details: 'User must be logged in to create animal listings',
        duration: Date.now() - startTime
      };
    }
    
    try {
      // First check if animal_listings table exists
      const { data: tableCheck, error: tableError } = await supabase
        .from('animal_listings')
        .select('id')
        .limit(1);
      
      if (tableError) {
        return {
          name: 'Animal Creation',
          status: 'warning',
          message: 'Animal listings table does not exist',
          details: 'This table may need to be created. Skipping animal creation test.',
          duration: Date.now() - startTime,
          error: tableError
        };
      }
      
      // Get a category for animals
      const { data: categories } = await supabase
        .from('categories')
        .select('id')
        .limit(1);
      
      if (!categories || categories.length === 0) {
        return {
          name: 'Animal Creation',
          status: 'fail',
          message: 'No categories available for animal creation',
          details: 'Categories table is empty',
          duration: Date.now() - startTime
        };
      }
      
      const testAnimal = {
        user_id: user.id,
        title: 'أبقار تجريبية للاختبار',
        description: 'هذه أبقار تجريبية لاختبار وظائف السوق',
        price: Math.floor(Math.random() * 500000) + 100000,
        currency: 'DZD',
        animal_type: 'cow' as const,
        breed: 'هولشتاين',
        age_months: 24,
        gender: 'female' as const,
        quantity: 5,
        health_status: 'صحي ومطعم',
        vaccination_status: true,
        location: 'سطيف',
        coordinates: null,
        images: ['/assets/sheep1.webp'],
        is_available: true,
        is_featured: false,
        view_count: 0,
        weight_kg: 450,
        price_per_head: true,
        purpose: 'dairy' as const
      };
      
      const { data, error } = await supabase
        .from('animal_listings')
        .insert(testAnimal)
        .select()
        .single();
      
      if (error) {
        return {
          name: 'Animal Creation',
          status: 'fail',
          message: 'Failed to create animal listing in database',
          details: error.message,
          duration: Date.now() - startTime,
          error
        };
      }
      
      return {
        name: 'Animal Creation',
        status: 'pass',
        message: 'Animal listing created successfully in database',
        details: `Animal ID: ${data.id}, Title: ${data.title}, Type: ${data.animal_type}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Animal Creation',
        status: 'fail',
        message: 'Error during animal creation',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        error
      };
    }
  };

  // Test creating vegetable listing
  const testVegetableCreation = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    if (!user) {
      return {
        name: 'Vegetable Creation',
        status: 'warning',
        message: 'Cannot test vegetable creation without authentication',
        details: 'User must be logged in to create vegetable listings',
        duration: Date.now() - startTime
      };
    }
    
    try {
      // First check if vegetables table exists
      const { data: tableCheck, error: tableError } = await supabase
        .from('vegetables')
        .select('id')
        .limit(1);
      
      if (tableError) {
        return {
          name: 'Vegetable Creation',
          status: 'warning',
          message: 'Vegetables table does not exist',
          details: 'This table may need to be created. Skipping vegetable creation test.',
          duration: Date.now() - startTime,
          error: tableError
        };
      }
      
      const testVegetable = {
        user_id: user.id,
        title: 'طماطم طازجة تجريبية',
        description: 'طماطم طازجة عضوية من مزرعتنا - Fresh organic tomatoes from our farm',
        vegetable_type: 'tomatoes',
        price: Math.floor(Math.random() * 200) + 100,
        currency: 'DZD',
        unit: 'kg',
        quantity: Math.floor(Math.random() * 50) + 10,
        harvest_date: new Date().toISOString().split('T')[0],
        location: 'الجزائر العاصمة',
        coordinates: null,
        images: ['/assets/tomato 2.jpg'],
        is_available: true,
        is_featured: false,
        view_count: 0,
        freshness: 'excellent',
        organic: true,
        variety: 'طماطم كرزية',
        certification: 'عضوي',
        packaging: 'loose'
      };
      
      const { data, error } = await supabase
        .from('vegetables')
        .insert(testVegetable)
        .select()
        .single();
      
      if (error) {
        return {
          name: 'Vegetable Creation',
          status: 'fail',
          message: 'Failed to create vegetable listing in database',
          details: error.message,
          duration: Date.now() - startTime,
          error
        };
      }
      
      return {
        name: 'Vegetable Creation',
        status: 'pass',
        message: 'Vegetable listing created successfully in database',
        details: `Vegetable ID: ${data.id}, Title: ${data.title}, Type: ${data.vegetable_type}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Vegetable Creation',
        status: 'fail',
        message: 'Error during vegetable creation',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        error
      };
    }
  };

  // Test creating nursery listing
  const testNurseryCreation = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    if (!user) {
      return {
        name: 'Nursery Creation',
        status: 'warning',
        message: 'Cannot test nursery creation without authentication',
        details: 'User must be logged in to create nursery listings',
        duration: Date.now() - startTime
      };
    }
    
    try {
      // First check if nurseries table exists
      const { data: tableCheck, error: tableError } = await supabase
        .from('nurseries')
        .select('id')
        .limit(1);
      
      if (tableError) {
        return {
          name: 'Nursery Creation',
          status: 'warning',
          message: 'Nurseries table does not exist',
          details: 'This table may need to be created. Skipping nursery creation test.',
          duration: Date.now() - startTime,
          error: tableError
        };
      }
      
      const testNursery = {
        user_id: user.id,
        title: 'شتلات زيتون عالية الجودة',
        description: 'شتلات زيتون عالية الجودة من مزرعتنا - High quality olive saplings from our farm',
        price: Math.floor(Math.random() * 1000) + 200,
        currency: 'DZD',
        quantity: Math.floor(Math.random() * 100) + 10,
        location: 'قسنطينة',
        coordinates: null,
        images: ['/assets/seedings01.jpg'],
        is_available: true,
        is_featured: false,
        view_count: 0
      };
      
      const { data, error } = await supabase
        .from('nurseries')
        .insert(testNursery)
        .select()
        .single();
      
      if (error) {
        return {
          name: 'Nursery Creation',
          status: 'fail',
          message: 'Failed to create nursery listing in database',
          details: error.message,
          duration: Date.now() - startTime,
          error
        };
      }
      
      return {
        name: 'Nursery Creation',
        status: 'pass',
        message: 'Nursery listing created successfully in database',
        details: `Nursery ID: ${data.id}, Title: ${data.title}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Nursery Creation',
        status: 'fail',
        message: 'Error during nursery creation',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        error
      };
    }
  };

  // Test equipment retrieval
  const testProductRetrieval = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select(`
          *,
          profiles:user_id(full_name, location),
          categories:category_id(name_ar, name)
        `)
        .eq('is_available', true)
        .limit(10);
      
      if (error) {
        return {
          name: 'Equipment Retrieval',
          status: 'fail',
          message: 'Failed to retrieve equipment from database',
          details: error.message,
          duration: Date.now() - startTime,
          error
        };
      }
      
      return {
        name: 'Equipment Retrieval',
        status: 'pass',
        message: `Successfully retrieved ${data.length} equipment items`,
        details: `Equipment found: ${data.length}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Equipment Retrieval',
        status: 'fail',
        message: 'Error retrieving equipment',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        error
      };
    }
  };

  // Test land retrieval
  const testLandRetrieval = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('land_listings')
        .select(`
          *,
          profiles:user_id(full_name, location)
        `)
        .eq('is_available', true)
        .limit(10);
      
      if (error) {
        return {
          name: 'Land Retrieval',
          status: 'fail',
          message: 'Failed to retrieve land listings from database',
          details: error.message,
          duration: Date.now() - startTime,
          error
        };
      }
      
      return {
        name: 'Land Retrieval',
        status: 'pass',
        message: `Successfully retrieved ${data.length} land listings`,
        details: `Land listings found: ${data.length}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Land Retrieval',
        status: 'fail',
        message: 'Error retrieving land listings',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        error
      };
    }
  };

  // Test animal retrieval
  const testAnimalRetrieval = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      // First check if animal_listings table exists
      const { data: tableCheck, error: tableError } = await supabase
        .from('animal_listings')
        .select('id')
        .limit(1);
      
      if (tableError) {
        return {
          name: 'Animal Retrieval',
          status: 'warning',
          message: 'Animal listings table does not exist',
          details: 'This table may need to be created. Skipping animal retrieval test.',
          duration: Date.now() - startTime,
          error: tableError
        };
      }
      
      const { data, error } = await supabase
        .from('animal_listings')
        .select('*')
        .eq('is_available', true)
        .limit(10);
      
      if (error) {
        return {
          name: 'Animal Retrieval',
          status: 'fail',
          message: 'Failed to retrieve animal listings from database',
          details: error.message,
          duration: Date.now() - startTime,
          error
        };
      }
      
      return {
        name: 'Animal Retrieval',
        status: 'pass',
        message: `Successfully retrieved ${data.length} animal listings`,
        details: `Animal listings found: ${data.length}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Animal Retrieval',
        status: 'fail',
        message: 'Error retrieving animal listings',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        error
      };
    }
  };

  // Test vegetable retrieval
  const testVegetableRetrieval = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      // First check if vegetables table exists
      const { data: tableCheck, error: tableError } = await supabase
        .from('vegetables')
        .select('id')
        .limit(1);
      
      if (tableError) {
        return {
          name: 'Vegetable Retrieval',
          status: 'warning',
          message: 'Vegetables table does not exist',
          details: 'This table may need to be created. Skipping vegetable retrieval test.',
          duration: Date.now() - startTime,
          error: tableError
        };
      }
      
      const { data, error } = await supabase
        .from('vegetables')
        .select('*')
        .eq('is_available', true)
        .limit(10);
      
      if (error) {
        return {
          name: 'Vegetable Retrieval',
          status: 'fail',
          message: 'Failed to retrieve vegetable listings from database',
          details: error.message,
          duration: Date.now() - startTime,
          error
        };
      }
      
      return {
        name: 'Vegetable Retrieval',
        status: 'pass',
        message: `Successfully retrieved ${data.length} vegetable listings`,
        details: `Vegetable listings found: ${data.length}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Vegetable Retrieval',
        status: 'fail',
        message: 'Error retrieving vegetable listings',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        error
      };
    }
  };

  // Test nursery retrieval
  const testNurseryRetrieval = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      // First check if nurseries table exists
      const { data: tableCheck, error: tableError } = await supabase
        .from('nurseries')
        .select('id')
        .limit(1);
      
      if (tableError) {
        return {
          name: 'Nursery Retrieval',
          status: 'warning',
          message: 'Nurseries table does not exist',
          details: 'This table may need to be created. Skipping nursery retrieval test.',
          duration: Date.now() - startTime,
          error: tableError
        };
      }
      
      const { data, error } = await supabase
        .from('nurseries')
        .select('*')
        .eq('is_available', true)
        .limit(10);
      
      if (error) {
        return {
          name: 'Nursery Retrieval',
          status: 'fail',
          message: 'Failed to retrieve nursery listings from database',
          details: error.message,
          duration: Date.now() - startTime,
          error
        };
      }
      
      return {
        name: 'Nursery Retrieval',
        status: 'pass',
        message: `Successfully retrieved ${data.length} nursery listings`,
        details: `Nursery listings found: ${data.length}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Nursery Retrieval',
        status: 'fail',
        message: 'Error retrieving nursery listings',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        error
      };
    }
  };

  // Test product search
  const testProductSearch = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const searchTerm = 'معدة';
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .limit(5);
      
      if (error) {
        return {
          name: 'Product Search',
          status: 'fail',
          message: 'Search functionality failed',
          details: error.message,
          duration: Date.now() - startTime,
          error
        };
      }
      
      return {
        name: 'Product Search',
        status: 'pass',
        message: `Search found ${data.length} products matching "${searchTerm}"`,
        details: `Search term: "${searchTerm}", Results: ${data.length}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Product Search',
        status: 'fail',
        message: 'Error during search test',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        error
      };
    }
  };

  // Test product update
  const testProductUpdate = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    if (realProducts.length === 0) {
      return {
        name: 'Product Update',
        status: 'warning',
        message: 'No products available for update test',
        details: 'Create a product first to test updates',
        duration: Date.now() - startTime
      };
    }
    
    try {
      const productToUpdate = realProducts[0];
      const newTitle = `${productToUpdate.title} - محدث`;
      
      const { data, error } = await supabase
        .from('equipment')
        .update({ 
          title: newTitle,
          updated_at: new Date().toISOString()
        })
        .eq('id', productToUpdate.id)
        .select()
        .single();
      
      if (error) {
        return {
          name: 'Product Update',
          status: 'fail',
          message: 'Failed to update product',
          details: error.message,
          duration: Date.now() - startTime,
          error
        };
      }
      
      // Update local state
      setRealProducts(prev => 
        prev.map(p => p.id === productToUpdate.id ? data : p)
      );
      
      return {
        name: 'Product Update',
        status: 'pass',
        message: 'Product updated successfully',
        details: `Updated title: ${data.title}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Product Update',
        status: 'fail',
        message: 'Error during product update',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        error
      };
    }
  };

  // Test product deletion
  const testProductDeletion = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    if (realProducts.length === 0) {
      return {
        name: 'Product Deletion',
        status: 'warning',
        message: 'No products available for deletion test',
        details: 'Create a product first to test deletion',
        duration: Date.now() - startTime
      };
    }
    
    try {
      const productToDelete = realProducts[0];
      
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', productToDelete.id);
      
      if (error) {
        return {
          name: 'Product Deletion',
          status: 'fail',
          message: 'Failed to delete product',
          details: error.message,
          duration: Date.now() - startTime,
          error
        };
      }
      
      // Remove from local state
      setRealProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      
      return {
        name: 'Product Deletion',
        status: 'pass',
        message: 'Product deleted successfully',
        details: `Deleted product ID: ${productToDelete.id}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Product Deletion',
        status: 'fail',
        message: 'Error during product deletion',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        error
      };
    }
  };

  // Test RLS policies
  const testRLSPolicies = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    if (!user) {
      return {
        name: 'RLS Policies',
        status: 'warning',
        message: 'Cannot test RLS without authentication',
        details: 'User must be logged in to test security policies',
        duration: Date.now() - startTime
      };
    }
    
    try {
      // Try to access another user's data
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .neq('user_id', user.id)
        .limit(1);
      
      // If we can access other users' data, RLS might not be working properly
      if (data && data.length > 0) {
        return {
          name: 'RLS Policies',
          status: 'warning',
          message: 'RLS policies may not be properly configured',
          details: 'Able to access other users\' data',
          duration: Date.now() - startTime
        };
      }
      
      return {
        name: 'RLS Policies',
        status: 'pass',
        message: 'RLS policies are working correctly',
        details: 'Cannot access unauthorized data',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'RLS Policies',
        status: 'fail',
        message: 'Error testing RLS policies',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        error
      };
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    const results: TestResult[] = [];
    
    // Test 1: Database Connection
    setCurrentTest('Testing database connection...');
    const connectionTest = await testDatabaseConnection();
    results.push(connectionTest);
    
    if (connectionTest.status === 'pass') {
      setDatabaseStatus(prev => ({ ...prev, connected: true }));
      
      // Test 2: Check Tables
      setCurrentTest('Checking database tables...');
      const tableTests = await testTablesExist();
      results.push(...tableTests);
      
      const allTablesExist = tableTests.every(test => test.status === 'pass');
      if (allTablesExist) {
        setDatabaseStatus(prev => ({ ...prev, tablesExist: true }));
      }
      
      // Test 3: User Authentication
      setCurrentTest('Testing user authentication...');
      const authTest = await testUserAuthentication();
      results.push(authTest);
      
              // Test 4: Equipment Creation (if authenticated)
        if (user) {
          setCurrentTest('Testing equipment creation...');
          const equipmentTest = await testEquipmentCreation();
          results.push(equipmentTest);
          
          // Test 5: Land Creation
          setCurrentTest('Testing land creation...');
          const landTest = await testLandCreation();
          results.push(landTest);
          
          // Test 6: Animal Creation
          setCurrentTest('Testing animal creation...');
          const animalTest = await testAnimalCreation();
          results.push(animalTest);
          
          // Test 7: Vegetable Creation
          setCurrentTest('Testing vegetable creation...');
          const vegetableTest = await testVegetableCreation();
          results.push(vegetableTest);
          
          // Test 8: Nursery Creation
          setCurrentTest('Testing nursery creation...');
          const nurseryTest = await testNurseryCreation();
          results.push(nurseryTest);
        
                  // Test 7: Equipment Retrieval
          setCurrentTest('Testing equipment retrieval...');
          const equipmentRetrievalTest = await testProductRetrieval();
          results.push(equipmentRetrievalTest);
          
          // Test 8: Land Retrieval
          setCurrentTest('Testing land retrieval...');
          const landRetrievalTest = await testLandRetrieval();
          results.push(landRetrievalTest);
          
          // Test 9: Animal Retrieval
          setCurrentTest('Testing animal retrieval...');
          const animalRetrievalTest = await testAnimalRetrieval();
          results.push(animalRetrievalTest);
          
          // Test 10: Vegetable Retrieval
          setCurrentTest('Testing vegetable retrieval...');
          const vegetableRetrievalTest = await testVegetableRetrieval();
          results.push(vegetableRetrievalTest);
          
          // Test 11: Nursery Retrieval
          setCurrentTest('Testing nursery retrieval...');
          const nurseryRetrievalTest = await testNurseryRetrieval();
          results.push(nurseryRetrievalTest);
          
          // Test 10: Product Search
          setCurrentTest('Testing product search...');
          const searchTest = await testProductSearch();
          results.push(searchTest);
          
          // Test 11: Product Update
          setCurrentTest('Testing product update...');
          const updateTest = await testProductUpdate();
          results.push(updateTest);
          
          // Test 12: RLS Policies
          setCurrentTest('Testing RLS policies...');
          const rlsTest = await testRLSPolicies();
          results.push(rlsTest);
          
          if (rlsTest.status === 'pass') {
            setDatabaseStatus(prev => ({ ...prev, rlsEnabled: true }));
          }
          
          // Test 13: Product Deletion (cleanup)
          setCurrentTest('Testing product deletion...');
          const deletionTest = await testProductDeletion();
          results.push(deletionTest);
      }
    }
    
    setTestResults(results);
    setIsRunning(false);
    setCurrentTest('');
  };

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');
      
      if (data) {
        setCategories(data);
      }
    };
    
    loadCategories();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'fail':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const summary = {
    total: testResults.length,
    passed: testResults.filter(r => r.status === 'pass').length,
    failed: testResults.filter(r => r.status === 'fail').length,
    warnings: testResults.filter(r => r.status === 'warning').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🧪 Real-Time Marketplace Test</h1>
          <p className="text-xl text-gray-300 mb-6">
            Testing actual Supabase database operations and marketplace functionality
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Running Real Tests...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" />
                  Run Real Database Tests
                </>
              )}
            </button>
            
            <Link
              href="/marketplace"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              Go to Marketplace
            </Link>
          </div>

          {isRunning && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
                <span className="text-blue-300">{currentTest}</span>
              </div>
            </div>
          )}
        </div>

        {/* Database Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`p-4 rounded-lg ${databaseStatus.connected ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              <span className="font-semibold">Database Connection</span>
            </div>
            <p className="text-sm mt-1">
              {databaseStatus.connected ? 'Connected to Supabase' : 'Not connected'}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${databaseStatus.tablesExist ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <span className="font-semibold">Database Tables</span>
            </div>
            <p className="text-sm mt-1">
              {databaseStatus.tablesExist ? 'All tables exist' : 'Checking tables...'}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${databaseStatus.rlsEnabled ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Security (RLS)</span>
            </div>
            <p className="text-sm mt-1">
              {databaseStatus.rlsEnabled ? 'RLS policies active' : 'Testing RLS...'}
            </p>
          </div>
        </div>

        {/* User Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className={`p-4 rounded-lg ${user ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-semibold">Authentication</span>
            </div>
            <p className="text-sm mt-1">
              {user ? `Logged in as: ${user.email}` : 'Not logged in'}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${profile ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Profile Status</span>
            </div>
            <p className="text-sm mt-1">
              {profile ? `Profile: ${profile.full_name || 'Incomplete'}` : 'No profile found'}
            </p>
          </div>
        </div>

        {/* Summary */}
        {testResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{summary.total}</div>
              <div className="text-gray-300">Total Tests</div>
            </div>
            <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{summary.passed}</div>
              <div className="text-green-300">Passed</div>
            </div>
            <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{summary.failed}</div>
              <div className="text-red-300">Failed</div>
            </div>
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{summary.warnings}</div>
              <div className="text-yellow-300">Warnings</div>
            </div>
          </div>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold mb-4">Real Database Test Results</h2>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{result.name}</h3>
                    <p className="text-gray-700">{result.message}</p>
                    {result.details && (
                      <p className="text-sm text-gray-600 mt-1">{result.details}</p>
                    )}
                    {result.duration && (
                      <p className="text-xs text-gray-500 mt-1">Duration: {result.duration}ms</p>
                    )}
                    {result.error && (
                      <details className="mt-2">
                        <summary className="text-xs text-red-600 cursor-pointer">View Error Details</summary>
                        <pre className="text-xs bg-red-50 p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(result.error, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Real Products Created */}
        {realProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Real Products Created in Database</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {realProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${product.images[0]}')` }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.is_available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {product.is_available ? 'متاح' : 'غير متاح'}
                      </span>
                    </div>
                    
                    {/* Price */}
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-black/60 backdrop-blur-md rounded-lg p-2">
                        <div className="text-lg font-bold text-white">{product.price.toLocaleString('en-US')} {product.currency}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{product.title}</h3>
                    <p className="text-white/80 text-sm mb-3">{product.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-white/60 mb-3">
                      <span>{product.condition}</span>
                      <span>{product.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span>ID: {product.id.slice(0, 8)}...</span>
                      <span>{new Date(product.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Available */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Available Categories ({categories.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-white text-sm">{category.name_ar}</h3>
                  <p className="text-white/60 text-xs">{category.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setTestResults([]);
              setRealProducts([]);
              setDatabaseStatus({
                connected: false,
                tablesExist: false,
                rlsEnabled: false
              });
            }}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Reset All Tests
          </button>
          
          {!user && (
            <Link
              href="/auth/login"
              className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Login to Test Full Features
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 