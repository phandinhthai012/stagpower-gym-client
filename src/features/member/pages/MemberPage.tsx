import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/button';
import { MemberTable } from '../components/MemberTable';

export function MemberPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Member Dashboard</h1>
              <p className="text-gray-600">Xin chào, {user?.fullName}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="px-4 py-2"
              >
                Trang Chủ
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2"
              >
                Đăng Xuất
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MemberTable />
      </div>
    </div>
  );
}
             