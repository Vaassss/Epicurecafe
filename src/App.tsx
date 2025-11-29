import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Button } from './components/ui/button';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { LoginPage } from './components/LoginPage';
import { CustomerDashboard } from './components/CustomerDashboard';
import { BaristaDashboard } from './components/BaristaDashboard';
import { Toaster } from './components/ui/sonner';
import { Users } from 'lucide-react';

type Page = 'landing' | 'login' | 'customer' | 'barista';

// Logo - Try to import from figma, fallback to public folder for local development
let logoImage: string;
try {
  // @ts-ignore - This works in Figma Make environment
  logoImage = require('figma:asset/762ed7196ef3144613d2ad9faab91ae5aa71f45d.png').default;
} catch {
  // Fallback for local development - logo should be in /public folder
  logoImage = '/epicure-logo.png';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [showHero, setShowHero] = useState(false);
  const mottoRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: mottoRef,
    offset: ["start end", "end start"]
  });

  const mottoScale = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 1.5, 2]);
  const mottoOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 0.7, 0]);

  useEffect(() => {
    setShowHero(true);
  }, []);

  const handleLoginSuccess = (id: string, name: string) => {
    setUserId(id);
    setUserName(name);
    setCurrentPage('customer');
  };

  const handleLogout = () => {
    setUserId('');
    setUserName('');
    setCurrentPage('landing');
  };

  // Show different pages based on state
  if (currentPage === 'login') {
    return (
      <>
        <LoginPage 
          onBack={() => setCurrentPage('landing')}
          onLoginSuccess={handleLoginSuccess}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'customer') {
    return (
      <>
        <CustomerDashboard 
          userId={userId}
          userName={userName}
          onLogout={handleLogout}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'barista') {
    return (
      <>
        <BaristaDashboard 
          onBack={() => setCurrentPage('landing')}
        />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a2f2a]">
      <Toaster />
      {/* Login & Barista Buttons - Fixed Top Right */}
      <motion.div 
        className="fixed top-6 right-6 z-50 flex gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <Button 
          onClick={() => setCurrentPage('barista')}
          variant="outline" 
          className="bg-[#1a2f2a]/90 border-[#a8c5a0] text-[#d4e4d0] hover:bg-[#a8c5a0] hover:text-[#1a2f2a] backdrop-blur-sm"
          title="Barista Dashboard"
        >
          <Users className="w-4 h-4" />
        </Button>
        <Button 
          onClick={() => setCurrentPage('login')}
          variant="outline" 
          className="bg-[#1a2f2a]/90 border-[#a8c5a0] text-[#d4e4d0] hover:bg-[#a8c5a0] hover:text-[#1a2f2a] backdrop-blur-sm"
          data-login-btn
        >
          Login
        </Button>
      </motion.div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.03, 0.06, 0.03]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#a8c5a0] rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.03, 0.06, 0.03]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#d4e4d0] rounded-full blur-3xl"
          />
        </div>

        {/* Logo - Circular with Blend */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12 relative z-10"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Background circle for contrast */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#a8c5a0]/30 to-[#d4e4d0]/20 rounded-full" />
            <img 
              src={logoImage} 
              alt="Epicure Cafe Logo" 
              className="w-full h-full object-contain rounded-full relative z-10"
              style={{ 
                filter: 'brightness(1.3) contrast(1.1)',
                opacity: 0.95
              }}
            />
            {/* Glow effect */}
            <motion.div
              animate={{ 
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-[#a8c5a0]/20 rounded-full blur-2xl -z-10"
            />
          </div>
        </motion.div>

        {/* Cafe Name with Split Animation - Staggered */}
        <div className="relative mb-16 z-10">
          <div className="flex flex-col items-center gap-0 overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, x: -100 }}
              animate={showHero ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className="text-[#d4e4d0] relative"
              style={{ 
                fontFamily: "'Mr Stalwart', cursive",
                fontSize: 'clamp(4rem, 15vw, 10rem)',
                fontWeight: '400',
                letterSpacing: '0.02em',
                textShadow: '3px 3px 8px rgba(168, 197, 160, 0.4)',
                lineHeight: '0.9'
              }}
            >
              Epicure
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, x: 100 }}
              animate={showHero ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
              className="text-[#a8c5a0] relative -mt-6"
              style={{ 
                fontFamily: "'Mr Stalwart', cursive",
                fontSize: 'clamp(4rem, 15vw, 10rem)',
                fontWeight: '400',
                letterSpacing: '0.02em',
                textShadow: '3px 3px 8px rgba(26, 47, 42, 0.6)',
                lineHeight: '0.9'
              }}
            >
              Cafe
            </motion.h1>
          </div>
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-6 h-1 bg-gradient-to-r from-transparent via-[#a8c5a0] to-transparent"
          />
        </div>
      </section>

      {/* Motto Section with Scroll Animation */}
      <section 
        ref={mottoRef}
        className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      >
        <motion.div
          style={{ 
            scale: mottoScale, 
            opacity: mottoOpacity 
          }}
          className="text-center"
        >
          <h2 className="text-[#d4e4d0] text-4xl md:text-6xl lg:text-7xl max-w-4xl mx-auto">
            Where Every Cup Tells a Story
          </h2>
          <p className="text-[#a8c5a0] mt-6 text-xl md:text-3xl">
            Savor the Journey
          </p>
        </motion.div>

        {/* Scroll Indicator - Appears after motto */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          viewport={{ once: false }}
          className="absolute bottom-12"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[#a8c5a0] text-sm tracking-wider uppercase">Explore Menu</span>
            <svg 
              className="w-6 h-6 text-[#a8c5a0]" 
              fill="none" 
              strokeWidth="2" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Menu Section */}
      <MenuSection />

      {/* About Us Section */}
      <AboutSection />

      {/* Location Section */}
      <section className="py-20 px-4 bg-[#0f1f1b]">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-[#d4e4d0] text-5xl md:text-6xl mb-4">Visit Us</h2>
            <p className="text-[#a8c5a0] text-xl">Find us at our location</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 items-start"
          >
            {/* Map */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-[#a8c5a0]/30 h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.2649937!2d76.28546!3d9.9706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwNTgnMTQuMiJOIDc2wrAxNycwNy43IkU!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Epicure Cafe Location"
              ></iframe>
            </div>

            {/* Address Details */}
            <div className="flex flex-col justify-center space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-[#1a2f2a]/50 backdrop-blur-sm p-8 rounded-2xl border border-[#a8c5a0]/20"
              >
                <h3 className="text-[#d4e4d0] text-2xl mb-4">Epicure Cafe</h3>
                <p className="text-[#a8c5a0] leading-relaxed">
                  W8VP+46F, Mini Bypass Tripunithura Rd,<br />
                  Gandhi Square, Poonithura,<br />
                  Maradu, Ernakulam,<br />
                  Kochi, Kerala 682038
                </p>
              </motion.div>

              <motion.a
                href="https://maps.google.com/?q=9.970618,76.285462"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block bg-[#a8c5a0] text-[#1a2f2a] px-8 py-4 rounded-xl text-center hover:bg-[#d4e4d0] transition-colors duration-300 shadow-lg"
              >
                Get Directions
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f1f1b] border-t border-[#a8c5a0]/20 py-8">
        <div className="container mx-auto px-4 text-center text-[#a8c5a0]">
          <p>&copy; 2025 Epicure Cafe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
