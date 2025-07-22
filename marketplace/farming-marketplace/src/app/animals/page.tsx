import React from 'react';
import { useEffect, useState } from 'react';
import { createClient } from '@firebase/firebase-js';
import { Animal } from '@/types/animal';

const AnimalsPage: React.FC = () => {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const { data, error } = await firebase
                    .from('animals')
                    .select('*');

                if (error) throw error;

                setAnimals(data);
            } catch (error) {
                setError('Error fetching animal listings');
            } finally {
                setLoading(false);
            }
        };

        fetchAnimals();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Available Animal Listings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {animals.map((animal) => (
                    <div key={animal.id} className="border rounded-lg p-4 shadow-md">
                        <h2 className="text-xl font-semibold mb-2">{animal.title}</h2>
                        <p className="text-gray-600 mb-2">{animal.description}</p>
                        <p className="text-lg font-bold text-green-600">Price: ${animal.price}</p>
                        <p className="text-sm text-gray-500">Type: {animal.animal_type}</p>
                        <p className="text-sm text-gray-500">Location: {animal.location}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnimalsPage; 