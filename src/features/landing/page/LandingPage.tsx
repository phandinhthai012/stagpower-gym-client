import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { PackagesSection } from '../components/PackagesSection';
import { GymInfoSection } from '../components/GymInfoSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FAQSection } from '../components/FAQSection';
import { Footer } from '../components/Footer';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PackagesSection />
      <GymInfoSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};
