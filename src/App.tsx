import React, { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RegistrationSuccessPage } from './pages/RegistrationSuccessPage';
import { MemberPage } from './pages/MemberPage';
import { Button } from './components/ui/button';
import { Dumbbell } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} />;
      case 'registration-success':
        return <RegistrationSuccessPage onNavigate={setCurrentPage} />;
      case 'member':
        return <MemberPage onNavigate={setCurrentPage} />;
      default:
        return (
          <div className="tw-min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="tw-text-center">
              <div className="tw-mb-8">
                <div className="tw-flex items-center justify-center mb-6">
                  <Dumbbell className="tw-h-16 w-16 text-blue-600" />
                  <span className="tw-ml-3 text-3xl font-bold text-gray-800">StagPower</span>
                </div>
                <h1 className="tw-text-4xl font-bold text-gray-800 mb-4">
                  Gym Management System
                </h1>
                <p className="tw-text-xl text-gray-600">
                  Hệ thống quản lý phòng gym hiện đại
                </p>
              </div>
              
              <div className="tw-bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                <p className="tw-text-gray-600 mb-6">
                  Chào mừng bạn đến với hệ thống quản lý phòng gym StagPower!
                </p>
                <div className="tw-space-y-3">
                  <Button 
                    onClick={() => setCurrentPage('login')}
                    className="tw-w-full"
                  >
                    Đăng nhập
                  </Button>
                  <Button 
                    onClick={() => setCurrentPage('register')}
                    variant="outline"
                    className="tw-w-full"
                  >
                    Đăng ký thành viên
                  </Button>
                  <Button 
                    onClick={() => setCurrentPage('member')}
                    variant="secondary"
                    className="tw-w-full"
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
