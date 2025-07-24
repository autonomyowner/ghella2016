'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase/supabaseClient';

const TestAllFormsPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [results, setResults] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const testInsert = async (tableName: string, testData: any) => {
    setLoading(prev => ({ ...prev, [tableName]: true }));
    setResults(prev => ({ ...prev, [tableName]: 'Testing...' }));

    try {
      if (!user) {
        setResults(prev => ({ ...prev, [tableName]: 'No user logged in' }));
        return;
      }

      const { data, error } = await supabase
        .from(tableName)
        .insert([testData])
        .select()
        .single();

      if (error) {
        setResults(prev => ({ ...prev, [tableName]: `Error: ${error.message}` }));
      } else {
        setResults(prev => ({ ...prev, [tableName]: `Success! ID: ${data.id}` }));
      }
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [tableName]: `Exception: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [tableName]: false }));
    }
  };

  const testEquipment = () => {
    const testData = {
      user_id: user?.id,
      title: 'Test Equipment - ' + new Date().toISOString(),
      description: 'Test equipment description',
      price: 50000,
      condition: 'good',
      location: 'Test Location',
      brand: 'Test Brand',
      model: 'Test Model',
      year: 2020,
      hours_used: 100,
      images: ['/placeholder-image.jpg'],
      category_id: undefined,
      currency: 'DZD',
      is_available: true,
      is_featured: false,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    testInsert('equipment', testData);
  };

  const testLand = () => {
    const testData = {
      user_id: user?.id,
      title: 'Test Land - ' + new Date().toISOString(),
      description: 'Test land description',
      price: 100000,
      currency: 'DZD',
      listing_type: 'sale',
      area_size: 10,
      area_unit: 'hectare',
      location: 'Test Location',
      soil_type: 'clay',
      water_source: 'well',
      images: ['/placeholder-image.jpg'],
      is_available: true,
      is_featured: false,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    testInsert('land_listings', testData);
  };

  const testNurseries = () => {
    const testData = {
      user_id: user?.id,
      title: 'Test Nursery - ' + new Date().toISOString(),
      description: 'Test nursery description',
      price: 5000,
      currency: 'دج',
      plant_type: 'fruit_trees',
      plant_name: 'Orange Tree',
      age_months: 6,
      size: 'medium',
      quantity: 1,
      health_status: 'healthy',
      location: 'Test Location',
      pot_size: 'medium',
      care_instructions: 'Water daily',
      seasonality: 'all_year',
      images: ['/placeholder-image.jpg'],
      is_available: true,
      is_featured: false,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    testInsert('nurseries', testData);
  };

  const testAnimals = () => {
    const testData = {
      user_id: user?.id,
      title: 'Test Animal - ' + new Date().toISOString(),
      description: 'Test animal description',
      price: 25000,
      currency: 'DZD',
      animal_type: 'cattle',
      breed: 'Test Breed',
      age_years: 2,
      weight_kg: 500,
      health_status: 'healthy',
      location: 'Test Location',
      images: ['/placeholder-image.jpg'],
      is_available: true,
      is_featured: false,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    testInsert('animal_listings', testData);
  };

  const testLabor = () => {
    const testData = {
      user_id: user?.id,
      title: 'Test Labor - ' + new Date().toISOString(),
      description: 'Test labor description',
      price: 2000,
      currency: 'DZD',
      labor_type: 'harvesting',
      experience_years: 5,
      location: 'Test Location',
      availability: 'full_time',
      skills: ['harvesting', 'planting'],
      images: ['/placeholder-image.jpg'],
      is_available: true,
      is_featured: false,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    testInsert('labor', testData);
  };

  const testDelivery = () => {
    const testData = {
      user_id: user?.id,
      title: 'Test Delivery - ' + new Date().toISOString(),
      description: 'Test delivery description',
      price: 1500,
      currency: 'DZD',
      delivery_type: 'local',
      vehicle_type: 'truck',
      capacity_kg: 1000,
      location: 'Test Location',
      service_area: 'Test Area',
      images: ['/placeholder-image.jpg'],
      is_available: true,
      is_featured: false,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    testInsert('delivery', testData);
  };

  const testAnalysis = () => {
    const testData = {
      user_id: user?.id,
      title: 'Test Analysis - ' + new Date().toISOString(),
      description: 'Test analysis description',
      price: 3000,
      currency: 'DZD',
      analysis_type: 'soil',
      sample_type: 'soil',
      location: 'Test Location',
      turnaround_days: 3,
      images: ['/placeholder-image.jpg'],
      is_available: true,
      is_featured: false,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    testInsert('analysis', testData);
  };

  const testVegetables = () => {
    const testData = {
      user_id: user?.id,
      title: 'Test Vegetables - ' + new Date().toISOString(),
      description: 'Test vegetables description',
      price: 1000,
      currency: 'DZD',
      vegetable_type: 'tomatoes',
      variety: 'cherry',
      quantity_kg: 50,
      harvest_date: new Date().toISOString(),
      location: 'Test Location',
      images: ['/placeholder-image.jpg'],
      is_available: true,
      is_featured: false,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    testInsert('vegetables', testData);
  };

  const testButtons = [
    { name: 'Equipment', handler: testEquipment },
    { name: 'Land', handler: testLand },
    { name: 'Nurseries', handler: testNurseries },
    { name: 'Animals', handler: testAnimals },
    { name: 'Labor', handler: testLabor },
    { name: 'Delivery', handler: testDelivery },
    { name: 'Analysis', handler: testAnalysis },
    { name: 'Vegetables', handler: testVegetables },
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test All Form Insertions</h1>
      
      {!user && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          No user logged in
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        {testButtons.map(({ name, handler }) => (
          <button 
            key={name}
            onClick={handler}
            disabled={loading[name]}
            style={{
              padding: '10px 20px',
              backgroundColor: loading[name] ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading[name] ? 'not-allowed' : 'pointer',
              margin: '5px'
            }}
          >
            {loading[name] ? 'Testing...' : `Test ${name}`}
          </button>
        ))}
      </div>

      <div style={{ 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <strong>Results:</strong>
        {Object.entries(results).map(([table, result]) => (
          <div key={table} style={{ marginTop: '10px' }}>
            <strong>{table}:</strong> {result}
          </div>
        ))}
      </div>

      {user && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e9ecef' }}>
          <strong>User:</strong> {user.email}
        </div>
      )}
    </div>
  );
};

export default TestAllFormsPage; 