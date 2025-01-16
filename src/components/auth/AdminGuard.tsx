import { useAuth } from "@/hooks/useAuth";
import { isAdmin } from "@/lib/services/adminService";
import { Navigate } from "react-router-dom";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user || !isAdmin(user.email || '')) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}