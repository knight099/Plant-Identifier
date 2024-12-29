import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Brand Logo */}
                <Link href="/" legacyBehavior>
                    <a className="text-white text-2xl font-bold hover:text-gray-300">
                        Plant Identifier
                    </a>
                </Link>
                {/* Navigation Links */}
                <ul className="flex space-x-8">
                    <li>
                        <Link href="/" legacyBehavior>
                            <a className="text-white text-lg font-medium hover:text-gray-300 transition duration-200">
                                Home
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/" legacyBehavior>
                            <a className="text-white text-lg font-medium hover:text-gray-300 transition duration-200">
                                About
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/" legacyBehavior>
                            <a className="text-white text-lg font-medium hover:text-gray-300 transition duration-200">
                                Services
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/" legacyBehavior>
                            <a className="text-white text-lg font-medium hover:text-gray-300 transition duration-200">
                                Contact
                            </a>
                        </Link>
                    </li>
                </ul>
                {/* Call to Action Button */}
                <Link href="/" legacyBehavior>
                    <a className="bg-white text-purple-600 font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition duration-200">
                        Get Started
                    </a>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
