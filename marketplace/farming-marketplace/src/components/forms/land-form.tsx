import React, { useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { Land } from '../../types/land';

const LandForm: React.FC<{ onSubmit: (land: Land) => void }> = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [size, setSize] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('land')
                .insert([{ title, description, price, location, size }]);

            if (error) throw error;

            onSubmit(data[0]);
            setTitle('');
            setDescription('');
            setPrice('');
            setLocation('');
            setSize('');
        } catch (error) {
            setError('Error creating land listing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div>
                <label htmlFor="title" className="block">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border p-2 w-full"
                />
            </div>
            <div>
                <label htmlFor="description" className="block">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="border p-2 w-full"
                />
            </div>
            <div>
                <label htmlFor="price" className="block">Price</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="border p-2 w-full"
                />
            </div>
            <div>
                <label htmlFor="location" className="block">Location</label>
                <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="border p-2 w-full"
                />
            </div>
            <div>
                <label htmlFor="size" className="block">Size (acres)</label>
                <input
                    type="number"
                    id="size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    required
                    className="border p-2 w-full"
                />
            </div>
            <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2">
                {loading ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
};

export default LandForm;