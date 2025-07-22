import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../lib/firebaseConfig';
import { Equipment } from '../types/equipment';

const useEquipment = () => {
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEquipment = async () => {
        try {
        setLoading(true);
            const equipmentRef = collection(firestore, 'equipment');
            const querySnapshot = await getDocs(equipmentRef);
            
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Equipment[];

            setEquipmentList(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching equipment');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    return { equipmentList, loading, error, refetch: fetchEquipment };
};

export default useEquipment;