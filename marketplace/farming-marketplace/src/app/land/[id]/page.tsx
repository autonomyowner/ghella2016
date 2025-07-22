import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@firebase/firebase-js';
import { Land } from '@/types/land';

const LandDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [land, setLand] = useState<Land | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLandDetails = async () => {
      if (!id) return;

      const { data, error } = await firebase
        .from('land')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError('Error fetching land details');
      } else {
        setLand(data);
      }
      setLoading(false);
    };

    fetchLandDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{land?.title}</h1>
      <p>{land?.description}</p>
      <p>Price: ${land?.price}</p>
      <p>Size: {land?.size} acres</p>
      <p>Location: {land?.location}</p>
    </div>
  );
};

export default LandDetailPage;