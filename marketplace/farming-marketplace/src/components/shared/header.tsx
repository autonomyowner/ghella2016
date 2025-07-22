import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
    return (
        <header className="bg-green-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-2xl font-bold">
                    Farming Marketplace
                </h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link href="/" className="text-white hover:underline">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/equipment" className="text-white hover:underline">
                                Equipment
                            </Link>
                        </li>
                        <li>
                            <Link href="/land" className="text-white hover:underline">
                                Land
                            </Link>
                        </li>
                        <li>
                            <Link href="/profile" className="text-white hover:underline">
                                Profile
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
