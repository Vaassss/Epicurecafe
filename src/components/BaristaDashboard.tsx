import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Check, X, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { menuItems } from '../data/menuData';
import { api } from '../utils/api';

// Logo - Try to import from figma, fallback to public folder for local development
let logoImage: string;
try {
  // @ts-ignore - This works in Figma Make environment
  logoImage = require('figma:asset/762ed7196ef3144613d2ad9faab91ae5aa71f45d.png').default;
} catch {
  // Fallback for local development - logo should be in /public folder
  logoImage = '/epicure-logo.png';
}

interface BaristaDashboardProps {
  onBack: () => void;
}

const drinkNames = menuItems.map(item => item.name);

const roadmaps = [
  {
    id: 'hot_drinks_explorer',
    requiredItems: ['Latte', 'Cappuccino Med', 'Americano'],
    badge: '☕ Hot Drinks Explorer',
    reward: 'Free Latte'
  },
  {
    id: 'cold_drinks_fan',
    requiredItems: ['Cold Brew', 'Iced Americano', 'Iced Tea'],
    badge: '🧊 Cold Drinks Fan',
    reward: 'Free Cold Brew'
  },
  {
    id: 'sweet_tooth',
    requiredItems: ['Chocolate Shake', 'Strawberry Milk Shakes', 'Mango'],
    badge: '🍦 Sweet Tooth',
    reward: 'Free Milkshake'
  },
  {
    id: 'epicure_master',
    requiredItems: ['Latte', 'Cappuccino Med', 'Cold Brew', 'Iced Tea', 'Chocolate Shake', 'Green Tea', 'Affogato', 'Matcha OG'],
    badge: '👑 Epicure Master',
    reward: 'Free drink of your choice'
  }
];

export function BaristaDashboard({ onBack }: BaristaDashboardProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const searchCustomer = async () => {
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    const response = await api.searchCustomer(phoneNumber);
    setLoading(false);

    if (response.error) {
      setCustomerName('');
      toast.error('Customer not found. They may need to register first.');
      return;
    }

    if (response.customer) {
      setCustomerName(response.customer.name);
      toast.success(`Customer found: ${response.customer.name}`);
    }
  };

  const toggleItem = (item: string) => {
    setSelectedItems(prev => 
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const savePurchase = async () => {
    if (!phoneNumber || !customerName) {
      toast.error('Please search for a customer first');
      return;
    }

    if (selectedItems.length === 0) {
      toast.error('Please select at least one item');
      return;
    }

    setLoading(true);

    // Add purchase via API
    const response = await api.baristaAddPurchase(phoneNumber, selectedItems);

    if (response.error) {
      toast.error(`Failed to save purchase: ${response.error}`);
      setLoading(false);
      return;
    }

    if (response.customer) {
      const customer = response.customer;
      
      // Check for newly completed roadmaps
      const newlyCompleted: string[] = [];
      
      roadmaps.forEach(async (roadmap) => {
        const hasAllItems = roadmap.requiredItems.every(item => 
          customer.purchases.includes(item)
        );
        
        const alreadyCompleted = customer.completedRoadmaps?.includes(roadmap.id);
        
        if (hasAllItems && !alreadyCompleted) {
          newlyCompleted.push(roadmap.id);
          // Mark roadmap as completed
          await api.completeRoadmap(customer.id, roadmap.id, roadmap.badge);
        }
      });

      setLoading(false);

      // Show success message
      if (newlyCompleted.length > 0) {
        const badgeNames = newlyCompleted.map(id => {
          const roadmap = roadmaps.find(r => r.id === id);
          return roadmap?.badge;
        }).join(', ');
        toast.success(`🎉 ${customerName} earned new badge(s): ${badgeNames}!`, { duration: 5000 });
      } else {
        toast.success(`Purchase recorded for ${customerName}`);
      }

      // Reset
      setSelectedItems([]);
    }
  };

  const clearAll = () => {
    setPhoneNumber('');
    setCustomerName('');
    setSelectedItems([]);
  };

  return (
    <div className="min-h-screen bg-[#1a2f2a]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#243832]/80 to-[#1a2f2a]/80 backdrop-blur-xl border-b border-[#a8c5a0]/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-[#a8c5a0] hover:text-[#d4e4d0] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <img 
              src={logoImage} 
              alt="Epicure Cafe" 
              className="w-12 h-12 rounded-full"
              style={{ filter: 'brightness(1.2) contrast(1.1)' }}
            />
            <div>
              <h1 
                className="text-2xl text-[#d4e4d0]"
                style={{ fontFamily: "'Mr Stalwart', cursive" }}
              >
                Barista Dashboard
              </h1>
              <p className="text-[#a8c5a0]/70 text-sm">Log customer purchases</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Customer Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-[#243832]/40 to-[#1a2f2a]/40 backdrop-blur-sm border border-[#a8c5a0]/30 rounded-3xl p-6 md:p-8">
            <h2 className="text-2xl text-[#d4e4d0] mb-4">Customer Lookup</h2>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  onKeyPress={(e) => e.key === 'Enter' && searchCustomer()}
                  className="bg-[#1a2f2a]/50 border-[#a8c5a0]/30 text-[#d4e4d0] placeholder:text-[#a8c5a0]/40 focus:border-[#a8c5a0] h-12"
                  maxLength={10}
                />
              </div>
              <Button
                onClick={searchCustomer}
                className="bg-[#a8c5a0] text-[#1a2f2a] hover:bg-[#8fb088] h-12 px-6"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
            {customerName && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-[#a8c5a0]/20 border border-[#a8c5a0] rounded-xl"
              >
                <p className="text-[#d4e4d0]">
                  Customer: <strong className="text-[#a8c5a0]">{customerName}</strong>
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Menu Items Selection */}
        {customerName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-[#243832]/40 to-[#1a2f2a]/40 backdrop-blur-sm border border-[#a8c5a0]/30 rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl text-[#d4e4d0] mb-4">Select Items Purchased</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2">
                {drinkNames.map((item) => (
                  <motion.button
                    key={item}
                    onClick={() => toggleItem(item)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedItems.includes(item)
                        ? 'bg-[#a8c5a0]/20 border-[#a8c5a0] text-[#d4e4d0]'
                        : 'bg-[#1a2f2a]/30 border-[#a8c5a0]/20 text-[#a8c5a0]/70 hover:border-[#a8c5a0]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item}</span>
                      {selectedItems.includes(item) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-[#a8c5a0] rounded-full flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-[#1a2f2a]" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Action Buttons */}
              {selectedItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex gap-3"
                >
                  <Button
                    onClick={savePurchase}
                    disabled={loading}
                    className="flex-1 h-14 bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a] hover:shadow-lg hover:shadow-[#a8c5a0]/50 transition-all text-lg"
                    style={{
                      fontFamily: 'Impact, Arial Black, sans-serif',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {loading ? 'Saving...' : `Save Purchase (${selectedItems.length} items)`}
                  </Button>
                  <Button
                    onClick={() => setSelectedItems([])}
                    variant="outline"
                    className="h-14 border-[#a8c5a0]/30 text-[#a8c5a0] hover:bg-[#a8c5a0]/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gradient-to-br from-[#243832]/40 to-[#1a2f2a]/40 backdrop-blur-sm border border-[#a8c5a0]/30 rounded-3xl p-6">
            <h2 className="text-2xl text-[#d4e4d0] mb-4">Quick Actions</h2>
            <Button
              onClick={clearAll}
              variant="outline"
              className="w-full border-[#a8c5a0]/30 text-[#a8c5a0] hover:bg-[#a8c5a0]/10"
            >
              Clear All & Start New Transaction
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
