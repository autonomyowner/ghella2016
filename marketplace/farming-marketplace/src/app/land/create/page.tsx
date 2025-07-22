import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@firebase/firebase-js';
import LandForm from '@/components/forms/land-form';

const CreateLandPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateLand = async (landData: any) => {
    setLoading(true);
    setError(null);

    // Note: This is a placeholder - you'll need to configure firebase properly
    // const firebase = createClient(process.env.NEXT_PUBLIC_firebase_URL!, process.env.NEXT_PUBLIC_firebase_ANON_KEY!);
    // const { data, error } = await firebase
    //   .from('land')
    //   .insert([landData]);

    // if (error) {
    //   setError(error.message);
    // } else {
    //   router.push(`/land/${data[0].id}`);
    // }
    
    setError('Database not configured for this marketplace');
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Land Listing</h1>
      {error && <p className="text-red-500">{error}</p>}
      <LandForm onSubmit={handleCreateLand} />
    </div>
  );
};

export default CreateLandPage;