import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase/client';
import LandForm from '@/components/forms/land-form';

const CreateLandPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateLand = async (landData: any) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('land')
      .insert([landData]);

    if (error) {
      setError(error.message);
    } else {
      router.push(`/land/${data[0].id}`);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Land Listing</h1>
      {error && <p className="text-red-500">{error}</p>}
      <LandForm onSubmit={handleCreateLand} loading={loading} />
    </div>
  );
};

export default CreateLandPage;