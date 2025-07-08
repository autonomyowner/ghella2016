import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase/client';
import EquipmentForm from '@/components/forms/equipment-form';

const CreateEquipmentPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from('Equipment')
      .insert([
        {
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          location: data.location,
          images: data.images,
        },
      ]);

    if (error) {
      setError(error.message);
    } else {
      router.push('/equipment');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Equipment Listing</h1>
      {error && <p className="text-red-500">{error}</p>}
      <EquipmentForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default CreateEquipmentPage;