import { useEffect, useState } from 'react';
import { supabase } from '../lib/firebaseConfig';
import { Land } from '../types/land';

const useLand = () => {
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLands = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('land_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setLands(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching lands');
      console.error('Error fetching lands:', err);
    } finally {
      setLoading(false);
    }
  };

  const addLand = async (landData: Partial<Land>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('land_listings')
        .insert([{
          ...landData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      await fetchLands();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding land');
      throw err;
    }
  };

  const updateLand = async (id: string, updates: Partial<Land>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('land_listings')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      await fetchLands();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating land');
      throw err;
    }
  };

  const deleteLand = async (id: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('land_listings')
        .delete()
        .eq('id', id);

      if (supabaseError) {
        throw supabaseError;
      }

      await fetchLands();
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting land');
      throw err;
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  return { 
    lands, 
    loading, 
    error, 
    refetch: fetchLands,
    addLand,
    updateLand,
    deleteLand
  };
};

export default useLand;