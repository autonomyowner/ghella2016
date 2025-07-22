import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} Farming Marketplace. All rights reserved.</p>
                <p>Connect with us on social media!</p>
                <div className="flex justify-center space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                    <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                    <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
