import React from 'react';
import { useEffect, useState } from 'react';
import useLand from '@/hooks/use-land';
import { Land } from '@/types/land';

const LandPage: React.FC = () => {
    const { lands, loading, error } = useLand();

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Available Land Listings</h1>
            {lands.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    No land listings available at the moment.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {lands.map((land) => (
                        <div key={land.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold mb-2">{land.title}</h2>
                            <p className="text-gray-600 mb-2">{land.description}</p>
                            <p className="text-lg font-bold text-green-600">${land.price}</p>
                            {land.location && (
                                <p className="text-sm text-gray-500 mt-2">📍 {land.location}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LandPage;