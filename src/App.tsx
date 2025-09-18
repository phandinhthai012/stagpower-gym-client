import React, { useState } from 'react';
import { AuthPage } from './pages/AuthPage';
import { RegistrationSuccessPage } from './pages/RegistrationSuccessPage';
import { MemberPage } from './pages/MemberPage';
import { Button } from './components/ui/button';
import { Dumbbell } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
      case 'register':
        return <AuthPage onNavigate={setCurrentPage} />;
      case 'registration-success':
        return <RegistrationSuccessPage onNavigate={setCurrentPage} />;
      case 'member':
        return <MemberPage onNavigate={setCurrentPage} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-8">
                <div className="flex items-center justify-center mb-6">
                  <Dumbbell className="h-16 w-16 text-blue-600" />
                  <span className="ml-3 text-3xl font-bold text-gray-800">StagPower</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Gym Management System
                </h1>
                <p className="text-xl text-gray-600">
                  Hệ thống quản lý phòng gym hiện đại
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                <p className="text-gray-600 mb-6">
                  Chào mừng bạn đến với hệ thống quản lý phòng gym StagPower!
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setCurrentPage('login')}
                    className="w-full"
                  >
                    Đăng nhập
                  </Button>
                  <Button 
                    onClick={() => setCurrentPage('register')}
                    variant="outline"
                    className="w-full"
                  >
                    Đăng ký thành viên
                  </Button>
                  <Button 
                    onClick={() => setCurrentPage('member')}
                    variant="secondary"
                    className="w-full"
                  >
                    Xem Demo (Member)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderPage();
}

export default App;
