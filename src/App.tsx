import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CreateExercise } from './pages/CreateExercise';
import { Exercises } from './pages/Exercises';
import { Admin } from './pages/Admin';
import { ExerciseDetails } from './pages/ExerciseDetails';
import { Profile } from './pages/Profile';
import { About } from './pages/About';
import { Pricing } from './pages/Pricing';
import { SubscriptionConfirmation } from './pages/SubscriptionConfirmation';
import { Navbar } from './components/layout/Navbar';
import { AuthGuard } from './components/auth/AuthGuard';
import { AdminGuard } from './components/auth/AdminGuard';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route
              path="/subscription/confirmation"
              element={
                <AuthGuard>
                  <SubscriptionConfirmation />
                </AuthGuard>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/create-exercise"
              element={
                <AuthGuard>
                  <CreateExercise />
                </AuthGuard>
              }
            />
            <Route
              path="/exercises"
              element={
                <AuthGuard>
                  <Exercises />
                </AuthGuard>
              }
            />
            <Route
              path="/exercises/:id"
              element={
                <AuthGuard>
                  <ExerciseDetails />
                </AuthGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <Admin />
                </AdminGuard>
              }
            />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}