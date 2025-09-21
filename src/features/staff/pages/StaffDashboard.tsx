import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/button';

export function StaffDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Check-ins Hôm Nay</h3>
            <p className="text-3xl font-bold text-blue-600">45</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Thanh Toán Chờ</h3>
            <p className="text-3xl font-bold text-yellow-600">12</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Hội Viên Mới</h3>
            <p className="text-3xl font-bold text-green-600">8</p>
          </div>
        </div>
      </div>
    </div>
  );
}
