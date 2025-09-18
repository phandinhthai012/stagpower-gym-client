import React from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { PackagesSection } from '../components/PackagesSection';
import { GymInfoSection } from '../components/GymInfoSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FAQSection } from '../components/FAQSection';
import { Footer } from '../components/Footer';

interface LandingPageProps {
  onNavigate?: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen">
      <Header onNavigate={onNavigate} />
      <HeroSection onNavigate={onNavigate} />
      <FeaturesSection />
      <PackagesSection onNavigate={onNavigate} />
      <GymInfoSection />
      <TestimonialsSection onNavigate={onNavigate} />
      <FAQSection />
      <Footer />
    </div>
  );
};
