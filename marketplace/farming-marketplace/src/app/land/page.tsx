import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Land } from '@/types/land';

const LandPage: React.FC = () => {
    const [lands, setLands] = useState<Land[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLands = async () => {
            try {
                const { data, error } = await supabase
                    .from('land')
                    .select('*');

                if (error) throw error;

                setLands(data);
            } catch (error) {
                setError('Error fetching land listings');
            } finally {
                setLoading(false);
            }
        };

        fetchLands();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Available Land Listings</h1>
            <ul>
                {lands.map((land) => (
                    <li key={land.id} className="border p-4 mb-2">
                        <h2 className="text-xl">{land.title}</h2>
                        <p>{land.description}</p>
                        <p>Price: ${land.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LandPage;