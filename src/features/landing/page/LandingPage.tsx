import React from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { PackagesSection } from '../components/PackagesSection';
import { GymInfoSection } from '../components/GymInfoSection';
import { RegistrationForm } from '../components/RegistrationForm';
import { Footer } from '../components/Footer';

interface LandingPageProps {
  onNavigate?: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen">
      <Header onNavigate={onNavigate} />
      <HeroSection />
      <FeaturesSection />
      <PackagesSection />
      <GymInfoSection />
      <RegistrationForm />
      <Footer />
    </div>
  );
};
