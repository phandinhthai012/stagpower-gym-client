import { useState } from 'react';
import { AuthPage } from './pages/AuthPage';
import { RegistrationSuccessPage } from './pages/RegistrationSuccessPage';
import { MemberPage } from './pages/MemberPage';
import { LandingPage } from './features/landing/page';
import { useDocumentTitle } from './hooks/useDocumentTitle';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  
  // Set dynamic title based on current page
  useDocumentTitle('StagPower - Hệ Thống Phòng Gym Thông Minh');

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'login':
      case 'register':
        return <AuthPage onNavigate={setCurrentPage} />;
      case 'registration-success':
        return <RegistrationSuccessPage onNavigate={setCurrentPage} />;
      case 'member':
        return <MemberPage onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return renderPage();
}

export default App;
