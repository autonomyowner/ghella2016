import { useEffect, useState } from 'react';
import { supabase } from '../lib/firebaseConfig';
import { Equipment } from '../types/equipment';

const useEquipment = () => {
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEquipment = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const { data, error: supabaseError } = await supabase
                .from('equipment')
                .select('*')
                .order('created_at', { ascending: false });

            if (supabaseError) {
                throw supabaseError;
            }

            setEquipmentList(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching equipment');
            console.error('Error fetching equipment:', err);
        } finally {
            setLoading(false);
        }
    };

    const addEquipment = async (equipmentData: Partial<Equipment>) => {
        try {
            const { data, error: supabaseError } = await supabase
                .from('equipment')
                .insert([{
                    ...equipmentData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }])
                .select()
                .single();

            if (supabaseError) {
                throw supabaseError;
            }

            await fetchEquipment();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error adding equipment');
            throw err;
        }
    };

    const updateEquipment = async (id: string, updates: Partial<Equipment>) => {
        try {
            const { data, error: supabaseError } = await supabase
                .from('equipment')
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

            await fetchEquipment();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating equipment');
            throw err;
        }
    };

    const deleteEquipment = async (id: string) => {
        try {
            const { error: supabaseError } = await supabase
                .from('equipment')
                .delete()
                .eq('id', id);

            if (supabaseError) {
                throw supabaseError;
            }

            await fetchEquipment();
            return { success: true };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting equipment');
            throw err;
        }
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    return { 
        equipmentList, 
        loading, 
        error, 
        refetch: fetchEquipment,
        addEquipment,
        updateEquipment,
        deleteEquipment
    };
};

export default useEquipment;