import React from 'react';
import Header from '../components/shared/header';
import Footer from '../components/shared/footer';

const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Welcome to the Farming & Agricultural Equipment Marketplace</h1>
                <p className="mb-4">Discover a wide range of agricultural equipment and land listings tailored for farmers and buyers.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Placeholder for featured listings */}
                    <div className="border rounded-lg p-4">
                        <h2 className="text-xl font-semibold">Featured Equipment</h2>
                        {/* Equipment listings will go here */}
                    </div>
                    <div className="border rounded-lg p-4">
                        <h2 className="text-xl font-semibold">Available Land</h2>
                        {/* Land listings will go here */}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
