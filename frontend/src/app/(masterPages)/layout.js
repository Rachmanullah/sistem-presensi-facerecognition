'use client'
import { Navbar, Sidebar } from "../shared/components";
import { usePathname } from 'next/navigation';
import AbsensiChecker from "../shared/components/AbsensiChecker";
import { AuthProvider } from "../context/AuthContext";
export default function MainLayout({ children }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';
    return (
        <AuthProvider>
            <div>
                <AbsensiChecker />
                {!isLoginPage && <Navbar />}
                {!isLoginPage && <Sidebar />}
                <div className={`mt-20 ${!isLoginPage ? 'ml-64' : ''}`}>{children}</div>
            </div>
        </AuthProvider>
    )
}