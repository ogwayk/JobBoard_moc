import { useState } from 'react';
import { Toaster } from '@/app/components/ui/sonner';
import LoginPage from '@/app/components/LoginPage';
import AdminDashboard from '@/app/components/admin/AdminDashboard';
import WorkerDashboard from '@/app/components/worker/WorkerDashboard';

type UserRole = 'admin' | 'worker' | null;

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userId, setUserId] = useState<string>('');

  const handleLogin = (role: UserRole, id: string) => {
    setUserRole(role);
    setUserId(id);
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserId('');
  };

  if (!userRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {userRole === 'admin' ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <WorkerDashboard userId={userId} onLogout={handleLogout} />
      )}
      <Toaster />
    </div>
  );
}
