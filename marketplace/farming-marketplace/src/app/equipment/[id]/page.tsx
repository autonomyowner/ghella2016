import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@firebase/firebase-js';
import { Equipment } from '@/types/equipment';

const EquipmentDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!id) return;

      // Note: This is a placeholder - you'll need to configure firebase properly
      // const firebase = createClient(process.env.NEXT_PUBLIC_firebase_URL!, process.env.NEXT_PUBLIC_firebase_ANON_KEY!);
      // const { data, error } = await firebase
      //   .from('Equipment')
      //   .select('*')
      //   .eq('id', id)
      //   .single();

      // if (error) {
      //   setError('Failed to load equipment details.');
      // } else {
      //   setEquipment(data);
      // }
      
      setError('Database not configured for this marketplace');
      setLoading(false);
    };

    fetchEquipment();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!equipment) return <div>No equipment found.</div>;

  return (
    <div>
      <h1>{equipment.name}</h1>
      <p>{equipment.description}</p>
      <p>Price: ${equipment.price}</p>
      <p>Location: {equipment.location}</p>
      {/* Add more fields as necessary */}
    </div>
  );
};

export default EquipmentDetailPage;