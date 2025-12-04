// components/ProtectedAdminRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';



export const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }
    return <>{children}</>;
};