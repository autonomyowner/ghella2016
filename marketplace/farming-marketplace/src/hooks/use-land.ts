import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { Land } from '../types/land';

const useLand = () => {
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLands = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('land').select('*');
      if (error) throw error;
      setLands(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  return { lands, loading, error };
};

export default useLand;