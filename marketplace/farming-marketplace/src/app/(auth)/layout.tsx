import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="bg-green-600 text-white p-4">
                <h1 className="text-xl font-bold">Farming Marketplace</h1>
            </header>
            <main className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                    {children}
                </div>
            </main>
            <footer className="bg-gray-200 text-center p-4">
                <p>&copy; {new Date().getFullYear()} Farming Marketplace</p>
            </footer>
        </div>
    );
};

export default AuthLayout;