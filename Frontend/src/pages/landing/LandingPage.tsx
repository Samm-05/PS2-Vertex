import React, { useState } from 'react';
import LandingLoader from '../../components/landing/LandingLoader';
import Navbar from '../../components/landing/Navbar';
import HeroSection from './HeroSection';
import PipelineSection from './PipelineSection';
import ComparisonSection from './ComparisonSection';
import AlgorithmsSection from './AlgorithmsSection';
import ScrollStorySection from './ScrollStorySection';
import FeaturesSection from './FeaturesSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';
import Footer from '../../components/landing/Footer';

const LandingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LandingLoader onComplete={() => setIsLoading(false)} />}

      <div className="min-h-screen bg-secondary-950 text-white selection:bg-primary-500 selection:text-white">
        <Navbar />
        <HeroSection />
        <PipelineSection />
        <ComparisonSection />
        <AlgorithmsSection />
        <ScrollStorySection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
