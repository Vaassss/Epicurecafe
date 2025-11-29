import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Phone, KeyRound, ArrowLeft } from 'lucide-react';

// Logo - Try to import from figma, fallback to public folder for local development
let logoImage: string;
try {
  // @ts-ignore - This works in Figma Make environment
  logoImage = require('figma:asset/762ed7196ef3144613d2ad9faab91ae5aa71f45d.png').default;
} catch {
  // Fallback for local development - logo should be in /public folder
  logoImage = '/epicure-logo.png';
}

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: (userId: string, userName: string) => void;
}

export function LoginPage({ onBack, onLoginSuccess }: LoginPageProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    setError('');
    setLoading(true);
    
    // For demo purposes, we'll simulate OTP sending
    // In production, this would integrate with Supabase phone auth
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    setError('');
    setLoading(true);

    // Demo: Accept any 6-digit OTP
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      setLoading(false);
      return;
    }

    // Check if user exists (demo: check localStorage)
    const existingUser = localStorage.getItem(`user_${phoneNumber}`);
    
    setTimeout(() => {
      if (existingUser) {
        const userData = JSON.parse(existingUser);
        onLoginSuccess(phoneNumber, userData.name);
      } else {
        // New user - go to registration
        setStep('register');
      }
      setLoading(false);
    }, 1000);
  };

  const handleRegister = async () => {
    setError('');
    setLoading(true);

    if (!name.trim()) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    // Demo: Save to localStorage
    const userData = {
      phone: phoneNumber,
      name: name.trim(),
      badges: [],
      rewards: [],
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(`user_${phoneNumber}`, JSON.stringify(userData));

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(phoneNumber, name.trim());
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#1a2f2a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
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

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={onBack}
        className="absolute top-6 left-6 z-50 text-[#a8c5a0] hover:text-[#d4e4d0] transition-colors"
      >
        <ArrowLeft className="w-8 h-8" />
      </motion.button>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-gradient-to-br from-[#243832]/80 to-[#1a2f2a]/80 backdrop-blur-xl border border-[#a8c5a0]/30 rounded-3xl p-8 md:p-10 shadow-2xl shadow-[#a8c5a0]/20">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <img 
                src={logoImage} 
                alt="Epicure Cafe" 
                className="w-full h-full object-contain rounded-full"
                style={{ filter: 'brightness(1.2) contrast(1.1)' }}
              />
            </div>
          </div>

          {/* Title */}
          <h2 
            className="text-4xl text-center text-[#d4e4d0] mb-2"
            style={{
              fontFamily: "'Mr Stalwart', cursive"
            }}
          >
            Welcome Back
          </h2>
          <p className="text-center text-[#a8c5a0]/80 mb-8">
            {step === 'phone' && 'Enter your phone number to continue'}
            {step === 'otp' && 'Enter the OTP sent to your phone'}
            {step === 'register' && 'Complete your profile'}
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Phone Step */}
          {step === 'phone' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a8c5a0]/60" />
                <Input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-12 bg-[#1a2f2a]/50 border-[#a8c5a0]/30 text-[#d4e4d0] placeholder:text-[#a8c5a0]/40 focus:border-[#a8c5a0] h-14 text-lg"
                />
              </div>
              <Button
                onClick={handleSendOtp}
                disabled={loading || phoneNumber.length < 10}
                className="w-full h-14 bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a] hover:shadow-lg hover:shadow-[#a8c5a0]/50 transition-all text-lg"
                style={{
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  letterSpacing: '0.05em'
                }}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            </motion.div>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a8c5a0]/60" />
                <Input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="pl-12 bg-[#1a2f2a]/50 border-[#a8c5a0]/30 text-[#d4e4d0] placeholder:text-[#a8c5a0]/40 focus:border-[#a8c5a0] h-14 text-lg text-center tracking-widest"
                  maxLength={6}
                />
              </div>
              <Button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full h-14 bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a] hover:shadow-lg hover:shadow-[#a8c5a0]/50 transition-all text-lg"
                style={{
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  letterSpacing: '0.05em'
                }}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <button
                onClick={() => setStep('phone')}
                className="w-full text-[#a8c5a0] text-sm hover:text-[#d4e4d0] transition-colors"
              >
                Change phone number
              </button>
            </motion.div>
          )}

          {/* Register Step */}
          {step === 'register' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#1a2f2a]/50 border-[#a8c5a0]/30 text-[#d4e4d0] placeholder:text-[#a8c5a0]/40 focus:border-[#a8c5a0] h-14 text-lg"
                />
              </div>
              <Button
                onClick={handleRegister}
                disabled={loading || !name.trim()}
                className="w-full h-14 bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a] hover:shadow-lg hover:shadow-[#a8c5a0]/50 transition-all text-lg"
                style={{
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  letterSpacing: '0.05em'
                }}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            </motion.div>
          )}

          {/* Demo Note */}
          <div className="mt-6 p-4 bg-[#a8c5a0]/10 border border-[#a8c5a0]/20 rounded-xl">
            <p className="text-[#a8c5a0]/80 text-sm text-center">
              <strong>Demo Mode:</strong> Use any phone number and enter any 6-digit code
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
