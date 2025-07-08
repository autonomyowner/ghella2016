import React, { useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { Equipment } from '../../types/equipment';

const EquipmentForm: React.FC<{ existingEquipment?: Equipment; onSubmit: () => void }> = ({ existingEquipment, onSubmit }) => {
    const [title, setTitle] = useState(existingEquipment?.title || '');
    const [description, setDescription] = useState(existingEquipment?.description || '');
    const [price, setPrice] = useState(existingEquipment?.price || 0);
    const [category, setCategory] = useState(existingEquipment?.category || '');
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price.toString());
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        try {
            if (existingEquipment) {
                // Update existing equipment
                const { data, error } = await supabase
                    .from('Equipment')
                    .update({ title, description, price, category })
                    .eq('id', existingEquipment.id);
                if (error) throw error;
            } else {
                // Create new equipment
                const { data, error } = await supabase
                    .from('Equipment')
                    .insert([{ title, description, price, category }]);
                if (error) throw error;
            }
            onSubmit();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                <input
                    type="file"
                    id="image"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">Submit</button>
        </form>
    );
};

export default EquipmentForm;