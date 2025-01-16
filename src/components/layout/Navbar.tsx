import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="border-b bg-white/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">iTeach</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-6">
                  <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                    Dashboard
                  </Link>
                  <Link to="/exercises" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                    Exercices
                  </Link>
                  <Link to="/pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                    Tarifs
                  </Link>
                </div>
                <UserMenu />
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Tarifs
                </Link>
                <Link to="/login">
                  <Button className="bg-primary">
                    <LogIn className="mr-2 h-4 w-4" />
                    Connexion
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}