import Link from 'next/link';
import { ROUTES } from '../../routes/routes';

const NavbarHome = () => (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 fixed w-full z-20 top-0 left-0 border-b border-blue-700">
        <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link href={ROUTES.landingPage} className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="self-center text-2xl font-bold whitespace-nowrap text-white">
                    Sistem Absensi
                </span>
            </Link>
            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <Link
                    href={ROUTES.login}
                    className="text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:from-blue-400 dark:to-blue-600 dark:hover:from-blue-500 dark:hover:to-blue-700"
                >
                    Login
                </Link>
                <button
                    data-collapse-toggle="navbar-sticky"
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-300 rounded-lg md:hidden hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:text-gray-400 dark:hover:bg-blue-600 dark:focus:ring-blue-500"
                    aria-controls="navbar-sticky"
                    aria-expanded="false"
                >
                    <span className="sr-only">Open main menu</span>
                    <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 17 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1h15M1 7h15M1 13h15"
                        />
                    </svg>
                </button>
            </div>
            <div
                className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                id="navbar-sticky"
            >
                <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-blue-700 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 dark:border-gray-700">
                    <li>
                        <Link
                            href={ROUTES.landingPage}
                            className="block py-2 px-3 text-white bg-blue-600 rounded md:bg-transparent md:text-white md:p-0 hover:bg-blue-800 md:hover:text-blue-300 dark:hover:text-blue-500"
                            aria-current="page"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#"
                            className="block py-2 px-3 text-white rounded hover:bg-blue-800 md:hover:bg-transparent md:hover:text-blue-300 md:p-0 dark:hover:text-blue-500"
                        >
                            About
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={ROUTES.presensiPage}
                            className="block py-2 px-3 text-white rounded hover:bg-blue-800 md:hover:bg-transparent md:hover:text-blue-300 md:p-0 dark:hover:text-blue-500"
                        >
                            Presensi
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
);

export default NavbarHome;
