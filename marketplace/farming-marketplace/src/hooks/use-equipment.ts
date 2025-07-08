import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { Equipment } from '../types/equipment';

const useEquipment = () => {
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEquipment = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('Equipment')
            .select('*');

        if (error) {
            setError(error.message);
        } else {
            setEquipmentList(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    return { equipmentList, loading, error };
};

export default useEquipment;