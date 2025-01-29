import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow m-4">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm sm:text-center">
                © 2024{' '}
                <Link href="#" className="hover:underline text-blue-200">
                    Rachmanullah
                </Link>
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-blue-200 sm:mt-0">
                <li>
                    <Link href="#" className="hover:underline me-4 md:me-6">
                        About
                    </Link>
                </li>
                <li>
                    <Link href="#" className="hover:underline me-4 md:me-6">
                        Privacy Policy
                    </Link>
                </li>
                <li>
                    <Link href="#" className="hover:underline me-4 md:me-6">
                        Licensing
                    </Link>
                </li>
                <li>
                    <Link href="#" className="hover:underline">
                        Contact
                    </Link>
                </li>
            </ul>
        </div>
        <div className="flex justify-center space-x-6 mt-4 p-5">
            <Link
                href="#"
                className="text-blue-300 hover:text-blue-100 transition duration-300"
            >
                <FaFacebook size={24} />
            </Link>
            <Link
                href="#"
                className="text-blue-300 hover:text-blue-100 transition duration-300"
            >
                <FaTwitter size={24} />
            </Link>
            <Link
                href="#"
                className="text-blue-300 hover:text-blue-100 transition duration-300"
            >
                <FaLinkedin size={24} />
            </Link>
        </div>
    </footer>
);

export default Footer;
