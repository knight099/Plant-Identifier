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
                    className={`flex flex-col sm:flex-row sm:space-x-8 items-center sm:static absolute sm:w-auto w-full top-16 left-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 sm:bg-transparent sm:py-0 py-4 sm:translate-x-0 transition-transform duration-300 ${
                        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <li>
                        <Link href="/" legacyBehavior>
                            <a className="text-white text-lg font-medium hover:text-gray-300 transition duration-200">
                                Home
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" legacyBehavior>
                            <a className="text-white text-lg font-medium hover:text-gray-300 transition duration-200">
                                About
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/services" legacyBehavior>
                            <a className="text-white text-lg font-medium hover:text-gray-300 transition duration-200">
                                Services
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" legacyBehavior>
                            <a className="text-white text-lg font-medium hover:text-gray-300 transition duration-200">
                                Contact
                            </a>
                        </Link>
                    </li>
                </ul>

                {/* Call to Action Button */}
                <Link href="/get-started" legacyBehavior>
                    <a className="hidden sm:block bg-white text-purple-600 font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition duration-200">
                        Get Started
                    </a>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
