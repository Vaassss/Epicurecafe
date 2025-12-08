import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Award, Gift, Trophy, LogOut, Star, Coffee, ChevronRight, Menu, Home, Scan, History } from 'lucide-react';
import { MenuSection } from './MenuSection';
import { BillScanner } from './BillScanner';
import { PurchaseHistory } from './PurchaseHistory';
import { api } from '../utils/api';
import { logger } from '../utils/logger';
import { toast } from 'sonner@2.0.3';

// Logo path - using PNG
const logoImage = '/epicure-logo.png';

interface CustomerDashboardProps {
  userId: string;
  userName: string;
  onLogout: () => void;
}

interface Roadmap {
  id: string;
  title: string;
  description: string;
  requiredItems: string[];
  badge: string;
  reward: string;
  icon: any;
}

interface PurchaseRecord {
  id: string;
  items: string[];
  timestamp: string;
  source: 'scanner' | 'barista' | 'manual';
  billId?: string;
}

const roadmaps: Roadmap[] = [
  {
    id: 'hot_drinks_explorer',
    title: 'Hot Drinks Explorer',
    description: 'Try our classic hot coffee selection',
    requiredItems: ['Latte', 'Cappuccino Med', 'Americano'],
    badge: '☕ Hot Drinks Explorer',
    reward: 'Free Latte',
    icon: Coffee
  },
  {
    id: 'cold_drinks_fan',
    title: 'Cold Drinks Fan',
    description: 'Explore our refreshing cold beverages',
    requiredItems: ['Cold Brew', 'Iced Americano', 'Iced Tea'],
    badge: '🧊 Cold Drinks Fan',
    reward: 'Free Cold Brew',
    icon: Star
  },
  {
    id: 'sweet_tooth',
    title: 'Sweet Tooth',
    description: 'Try our delicious milkshakes',
    requiredItems: ['Chocolate Shake', 'Strawberry Milk Shakes', 'Mango'],
    badge: '🍦 Sweet Tooth',
    reward: 'Free Milkshake',
    icon: Trophy
  },
  {
    id: 'epicure_master',
    title: 'Epicure Master',
    description: 'Try drinks from all categories!',
    requiredItems: ['Latte', 'Cappuccino Med', 'Cold Brew', 'Iced Tea', 'Chocolate Shake', 'Green Tea', 'Affogato', 'Matcha OG'],
    badge: '👑 Epicure Master',
    reward: 'Free drink of your choice',
    icon: Award
  }
];

export function CustomerDashboard({ userId, userName, onLogout }: CustomerDashboardProps) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'menu' | 'scanner' | 'history'>('dashboard');
  const [userProgress, setUserProgress] = useState<{ [key: string]: string[] }>({});
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [availableRewards, setAvailableRewards] = useState<string[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseRecord[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load customer data from backend
    loadCustomerData();
  }, [userId]);

  const loadCustomerData = async () => {
    const response = await api.getCustomer(userId);
    
    if (response.error) {
      console.error('Error loading customer data:', response.error);
      toast.error('Failed to load your data');
      return;
    }

    if (response.customer) {
      const customer = response.customer;
      
      // Build progress from purchases
      const progress: { [key: string]: string[] } = {};
      roadmaps.forEach(roadmap => {
        progress[roadmap.id] = roadmap.requiredItems.filter(item => 
          customer.purchases.includes(item)
        );
      });
      
      setUserProgress(progress);
      setEarnedBadges(customer.completedRoadmaps || []);
      setAvailableRewards(customer.badges || []);
      setPurchaseHistory(customer.purchaseHistory || []);
    }
  };

  // Handle view changes
  useEffect(() => {
    if (currentView === 'scanner') {
      setShowScanner(true);
      setCurrentView('dashboard');
    } else if (currentView === 'history') {
      setShowHistory(true);
      setCurrentView('dashboard');
    }
  }, [currentView]);

  const calculateProgress = (roadmap: Roadmap) => {
    const purchased = userProgress[roadmap.id] || [];
    return (purchased.length / roadmap.requiredItems.length) * 100;
  };

  const isPurchased = (roadmapId: string, item: string) => {
    const purchased = userProgress[roadmapId] || [];
    return purchased.includes(item);
  };

  const hasBadge = (roadmapId: string) => {
    return earnedBadges.includes(roadmapId);
  };

  return (
    <div className="min-h-screen bg-[#1a2f2a]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#243832]/80 to-[#1a2f2a]/80 backdrop-blur-xl border-b border-[#a8c5a0]/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <img 
              src={logoImage} 
              alt="Epicure Cafe" 
              className="w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0"
              style={{ filter: 'brightness(1.2) contrast(1.1)' }}
            />
            <div className="min-w-0">
              <h1 
                className="text-lg md:text-2xl text-[#d4e4d0] truncate"
                style={{ fontFamily: "'Mr Stalwart', cursive" }}
              >
                {userName}
              </h1>
              <p className="text-[#a8c5a0]/70 text-xs md:text-sm hidden sm:block">Member Dashboard</p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
            <Button
              onClick={() => setCurrentView(currentView === 'dashboard' ? 'menu' : 'dashboard')}
              variant="outline"
              size="sm"
              className="border-[#a8c5a0]/30 text-[#a8c5a0] hover:bg-[#a8c5a0]/10 hidden md:flex"
            >
              {currentView === 'dashboard' ? (
                <>
                  <Menu className="w-4 h-4 mr-2" />
                  Menu
                </>
              ) : (
                <>
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </>
              )}
            </Button>
            <Button
              onClick={() => setCurrentView(currentView === 'dashboard' ? 'menu' : 'dashboard')}
              variant="outline"
              size="sm"
              className="border-[#a8c5a0]/30 text-[#a8c5a0] hover:bg-[#a8c5a0]/10 md:hidden p-2"
            >
              {currentView === 'dashboard' ? <Menu className="w-4 h-4" /> : <Home className="w-4 h-4" />}
            </Button>
            <Button
              onClick={() => setCurrentView('scanner')}
              variant="outline"
              size="sm"
              className="border-[#a8c5a0]/30 text-[#a8c5a0] hover:bg-[#a8c5a0]/10 hidden md:flex"
            >
              <Scan className="w-4 h-4 mr-2" />
              Scan Bill
            </Button>
            <Button
              onClick={() => setCurrentView('scanner')}
              variant="outline"
              size="sm"
              className="border-[#a8c5a0]/30 text-[#a8c5a0] hover:bg-[#a8c5a0]/10 md:hidden p-2"
            >
              <Scan className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setCurrentView('history')}
              variant="outline"
              size="sm"
              className="border-[#a8c5a0]/30 text-[#a8c5a0] hover:bg-[#a8c5a0]/10 hidden md:flex"
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button
              onClick={() => setCurrentView('history')}
              variant="outline"
              size="sm"
              className="border-[#a8c5a0]/30 text-[#a8c5a0] hover:bg-[#a8c5a0]/10 md:hidden p-2"
            >
              <History className="w-4 h-4" />
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="border-[#a8c5a0]/30 text-[#a8c5a0] hover:bg-[#a8c5a0]/10 hidden md:flex"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="border-[#a8c5a0]/30 text-[#a8c5a0] hover:bg-[#a8c5a0]/10 md:hidden p-2"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Show Menu if in menu view */}
        {currentView === 'menu' ? (
          <MenuSection />
        ) : (
          <>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl md:text-5xl text-[#d4e4d0] mb-3">
            Your Journey
          </h2>
          <p className="text-[#a8c5a0] text-lg">
            Complete roadmaps to earn badges and unlock rewards!
          </p>
        </motion.div>

        {/* Earned Badges Section */}
        {earnedBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-[#243832]/40 to-[#1a2f2a]/40 backdrop-blur-sm border border-[#a8c5a0]/30 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-[#a8c5a0]" />
                <h3 className="text-2xl text-[#d4e4d0]">Your Badges</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {earnedBadges.map((badgeId) => {
                  const roadmap = roadmaps.find(r => r.id === badgeId);
                  return roadmap ? (
                    <motion.div
                      key={badgeId}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-gradient-to-r from-[#a8c5a0]/20 to-[#8fb088]/20 border border-[#a8c5a0] rounded-full text-[#d4e4d0]"
                    >
                      {roadmap.badge}
                    </motion.div>
                  ) : null;
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Available Rewards Section */}
        {availableRewards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-[#a8c5a0]/20 to-[#8fb088]/10 border-2 border-[#a8c5a0] rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-6 h-6 text-[#1a2f2a]" />
                <h3 className="text-2xl text-[#1a2f2a]">Available Rewards</h3>
              </div>
              <div className="space-y-2">
                {availableRewards.map((reward, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white/20 rounded-xl p-4"
                  >
                    <span className="text-[#1a2f2a]">{reward}</span>
                    <Button
                      size="sm"
                      className="bg-[#1a2f2a] text-[#a8c5a0] hover:bg-[#0f1f1b]"
                    >
                      Redeem
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Roadmaps */}
        <div className="space-y-6">
          <h3 className="text-3xl text-[#d4e4d0] mb-4">Roadmaps</h3>
          {roadmaps.map((roadmap, index) => {
            const progress = calculateProgress(roadmap);
            const completed = hasBadge(roadmap.id);

            return (
              <motion.div
                key={roadmap.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className={`bg-gradient-to-br from-[#243832]/40 to-[#1a2f2a]/40 backdrop-blur-sm border rounded-3xl p-6 md:p-8 transition-all duration-300 ${
                  completed 
                    ? 'border-[#a8c5a0] shadow-lg shadow-[#a8c5a0]/30' 
                    : 'border-[#a8c5a0]/20 hover:border-[#a8c5a0]/40'
                }`}>
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`p-4 rounded-2xl ${
                      completed 
                        ? 'bg-[#a8c5a0]/30' 
                        : 'bg-[#a8c5a0]/10'
                    }`}>
                      <roadmap.icon className={`w-8 h-8 ${
                        completed ? 'text-[#a8c5a0]' : 'text-[#a8c5a0]/60'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-2xl text-[#d4e4d0]">{roadmap.title}</h4>
                        {completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-3 py-1 bg-[#a8c5a0] text-[#1a2f2a] rounded-full text-sm"
                          >
                            ✓ Completed
                          </motion.div>
                        )}
                      </div>
                      <p className="text-[#a8c5a0]/80 mb-4">{roadmap.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#a8c5a0] text-sm">
                            Progress: {userProgress[roadmap.id]?.length || 0} / {roadmap.requiredItems.length}
                          </span>
                          <span className="text-[#a8c5a0] text-sm">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-[#1a2f2a]/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              completed ? 'bg-[#a8c5a0]' : 'bg-gradient-to-r from-[#a8c5a0]/50 to-[#a8c5a0]'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Required Items */}
                      <div className="space-y-2 mb-4">
                        {roadmap.requiredItems.map((item) => (
                          <div
                            key={item}
                            className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
                              isPurchased(roadmap.id, item)
                                ? 'bg-[#a8c5a0]/20 text-[#d4e4d0]'
                                : 'bg-[#1a2f2a]/30 text-[#a8c5a0]/50'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isPurchased(roadmap.id, item)
                                ? 'border-[#a8c5a0] bg-[#a8c5a0]'
                                : 'border-[#a8c5a0]/30'
                            }`}>
                              {isPurchased(roadmap.id, item) && (
                                <ChevronRight className="w-3 h-3 text-[#1a2f2a]" />
                              )}
                            </div>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* Reward */}
                      <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-[#a8c5a0]/10 to-transparent rounded-xl border border-[#a8c5a0]/20">
                        <Gift className="w-5 h-5 text-[#a8c5a0]" />
                        <div>
                          <span className="text-[#a8c5a0]/70 text-sm">Reward: </span>
                          <span className="text-[#d4e4d0]">{roadmap.reward}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        </>
        )}
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <BillScanner
          userId={userId}
          onClose={() => setShowScanner(false)}
          onSuccess={loadCustomerData}
        />
      )}

      {/* History Modal */}
      {showHistory && (
        <PurchaseHistory
          purchaseHistory={purchaseHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}