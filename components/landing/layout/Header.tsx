import React, { useState } from 'react';
import { Menu, X, Smartphone, Apple } from 'lucide-react';

interface HeaderProps {
  scrolled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
        scrolled || mobileMenuOpen ? 'bg-background/90 backdrop-blur-md shadow-sm border-border' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 z-50">
            <span className={`text-2xl font-serif font-bold tracking-tighter ${scrolled || mobileMenuOpen ? 'text-primary' : 'text-primary md:text-white'}`}>
              Spacall
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Sanctuary', 'Experience', 'Therapists', 'Concierge'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                  scrolled ? 'text-foreground/80' : 'text-white/90'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Desktop Actions - Icons for Android/iOS */}
          <div className="hidden md:flex items-center space-x-4">
             <a href="#" className={`p-2 rounded-full transition-all hover:scale-110 ${scrolled ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/20'}`}>
                <Apple size={20} />
             </a>
             <a href="#" className={`p-2 rounded-full transition-all hover:scale-110 ${scrolled ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/20'}`}>
                <Smartphone size={20} />
             </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden z-50 p-2 text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} className={scrolled ? 'text-foreground' : 'text-primary md:text-white'} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-background z-40 flex flex-col items-center justify-center space-y-8 transition-transform duration-300 md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col items-center space-y-6">
          {['Sanctuary', 'Experience', 'Therapists', 'Concierge'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-2xl font-serif text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 pt-8">
           <div className="flex items-center space-x-6 mb-4">
              <Apple size={28} className="text-foreground" />
              <Smartphone size={28} className="text-foreground" />
           </div>
           <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-lg font-medium shadow-lg hover:shadow-primary/20 transition-all w-full max-w-xs">
             Download App
           </button>
        </div>
      </div>
    </header>
  );
};