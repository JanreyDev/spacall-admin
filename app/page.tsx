"use client";
import { Experience } from '@/components/landing/Experience';
import Features from '@/components/landing/Features';
import Footer from '@/components/landing/layout/Footer';
import { Hero } from '@/components/landing/Hero';
import { useEffect, useState } from 'react';
import { Testimonials } from '@/components/landing/Testimonials';
import { AppShowcase } from '@/components/landing/AppShowcase';
import { Header } from '@/components/landing/layout/Header';
import HowItWorks from '@/components/landing/HowItWorks';
import BeOurTherapist from '@/components/landing/BeOurTherapist';




function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      <Header scrolled={scrolled} />
      <main className="flex-1">
        <Hero />
        <Features />
        <Experience />
        <HowItWorks />
        <BeOurTherapist />
        <AppShowcase />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

export default App;