import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Brand Logo */}
                <Link href="/" legacyBehavior>
                    <a className="text-white text-2xl font-bold hover:text-gray-300">
                        Plant Identifier
                    </a>
                </Link>

                {/* Hamburger Icon (visible on small screens) */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-white text-2xl sm:hidden focus:outline-none"
                >
                    {isMenuOpen ? '✖' : '☰'}
                </button>

                {/* Navigation Links */}
                <ul
                    className={`flex flex-col sm:flex-row sm:space-x-8 items-center sm:static absolute sm:w-auto w-full top-16 left-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 sm:bg-transparent sm:py-0 py-4 sm:translate-x-0 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <li>
                        <Link href="/" legacyBehavior>
                            <a className="text-white text-lg font-medium hover:text-gray-300 transition duration-200">
                                Home
                            </a>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
