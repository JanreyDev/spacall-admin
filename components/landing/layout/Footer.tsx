import { Apple, Smartphone, Instagram, Twitter, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-lg">S</span>
            </div>
            <span className="font-serif text-xl font-semibold text-background tracking-wide">
              Spacall
            </span>
          </div>

          {/* App Store Buttons - Compact */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/10 hover:bg-background/20 transition-colors duration-300"
              aria-label="Download on iOS"
            >
              <Apple className="w-5 h-5" />
              <span className="text-sm font-medium">App Store</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/10 hover:bg-background/20 transition-colors duration-300"
              aria-label="Download on Android"
            >
              <Smartphone className="w-5 h-5" />
              <span className="text-sm font-medium">Google Play</span>
            </a>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-background/70">
            <a href="#" className="hover:text-background transition-colors">About</a>
            <a href="#" className="hover:text-background transition-colors">Careers</a>
            <a href="#" className="hover:text-background transition-colors">Press</a>
            <a href="#" className="hover:text-background transition-colors">Privacy</a>
            <a href="#" className="hover:text-background transition-colors">Terms</a>
            <a href="#" className="hover:text-background transition-colors">Support</a>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors duration-300"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors duration-300"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-background/50">
          © {new Date().getFullYear()} Spacall. All rights reserved. Sanctuary, Delivered.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
