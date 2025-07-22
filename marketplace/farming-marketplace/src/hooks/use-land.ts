import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../lib/firebaseConfig';
import { Land } from '../types/land';

const useLand = () => {
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLands = async () => {
    try {
      setLoading(true);
      const landRef = collection(firestore, 'land_listings');
      const querySnapshot = await getDocs(landRef);
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Land[];

      setLands(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching lands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  return { lands, loading, error, refetch: fetchLands };
};

export default useLand;