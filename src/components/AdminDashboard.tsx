import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  LogOut, Users, ShoppingBag, Shield, Trash2, Plus, 
  Search, X, Calendar, Award, Menu as MenuIcon
} from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { menuItems } from '../data/menuData';

// Logo
let logoImage: string;
try {
  // @ts-ignore
  logoImage = require('figma:asset/762ed7196ef3144613d2ad9faab91ae5aa71f45d.png').default;
} catch {
  logoImage = '/epicure-logo.png';
}

interface AdminDashboardProps {
  userId: string;
  userName: string;
  userMobile: string;
  onLogout: () => void;
}

interface CustomerData {
  id: string;
  name: string;
  mobile: string;
  purchases: string[];
  purchaseHistory: PurchaseRecord[];
  completedRoadmaps: string[];
  badges: string[];
  createdAt: string;
  lastPurchaseAt?: string;
  isAdmin?: boolean;
}

interface PurchaseRecord {
  id: string;
  items: string[];
  timestamp: string;
  source: 'scanner' | 'barista' | 'manual';
  billId?: string;
}

export function AdminDashboard({ userId, userName, userMobile, onLogout }: AdminDashboardProps) {
  const [currentTab, setCurrentTab] = useState<'customers' | 'admins' | 'menu'>('customers');
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAdminMobile, setNewAdminMobile] = useState('');
  const [loading, setLoading] = useState(false);

  // State for adding items
  const [showAddItems, setShowAddItems] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [currentTab]);

  const loadData = async () => {
    setLoading(true);
    if (currentTab === 'customers') {
      const response = await api.admin.getAllCustomers(userMobile);
      if (response.customers) {
        setCustomers(response.customers);
      }
    } else if (currentTab === 'admins') {
      const response = await api.admin.getAdmins(userMobile);
      if (response.admins) {
        setAdmins(response.admins);
      }
    }
    setLoading(false);
  };

  const handleAddPurchase = async () => {
    if (!selectedCustomer || selectedItems.length === 0) {
      toast.error('Please select items to add');
      return;
    }

    const response = await api.admin.addPurchase(userMobile, selectedCustomer.mobile, selectedItems);
    
    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success(`Added ${selectedItems.length} items to ${selectedCustomer.name}'s account`);
    setShowAddItems(false);
    setSelectedItems([]);
    loadData();
    
    // Refresh selected customer data
    const updatedCustomers = customers.map(c => 
      c.mobile === selectedCustomer.mobile ? response.customer : c
    );
    setCustomers(updatedCustomers);
    setSelectedCustomer(response.customer);
  };

  const handleRemovePurchase = async (purchaseId: string) => {
    if (!selectedCustomer) return;

    if (!confirm('Are you sure you want to remove this purchase?')) return;

    const response = await api.admin.removePurchase(userMobile, selectedCustomer.mobile, purchaseId);
    
    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success('Purchase removed successfully');
    loadData();
    
    // Refresh selected customer data
    const updatedCustomers = customers.map(c => 
      c.mobile === selectedCustomer.mobile ? response.customer : c
    );
    setCustomers(updatedCustomers);
    setSelectedCustomer(response.customer);
  };

  const handleAddAdmin = async () => {
    if (!/^\d{10}$/.test(newAdminMobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    const response = await api.admin.addAdmin(userMobile, newAdminMobile);
    
    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success('Admin added successfully');
    setNewAdminMobile('');
    loadData();
  };

  const handleRemoveAdmin = async (mobile: string) => {
    if (!confirm(`Remove admin access for ${mobile}?`)) return;

    const response = await api.admin.removeAdmin(userMobile, mobile);
    
    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success('Admin removed successfully');
    loadData();
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.mobile.includes(searchQuery)
  );

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#1a2f2a]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#243832]/80 to-[#1a2f2a]/80 backdrop-blur-xl border-b border-[#a8c5a0]/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
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
                Admin Dashboard
              </h1>
              <p className="text-[#a8c5a0]/70 text-sm">{userName}</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-[#a8c5a0]/30 text-[#a8c5a0] hover:bg-[#a8c5a0]/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <Button
            onClick={() => setCurrentTab('customers')}
            className={`${
              currentTab === 'customers'
                ? 'bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a]'
                : 'bg-[#243832]/40 text-[#a8c5a0] hover:bg-[#243832]/60'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Customers
          </Button>
          <Button
            onClick={() => setCurrentTab('admins')}
            className={`${
              currentTab === 'admins'
                ? 'bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a]'
                : 'bg-[#243832]/40 text-[#a8c5a0] hover:bg-[#243832]/60'
            }`}
          >
            <Shield className="w-4 h-4 mr-2" />
            Admins
          </Button>
          <Button
            onClick={() => setCurrentTab('menu')}
            className={`${
              currentTab === 'menu'
                ? 'bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a]'
                : 'bg-[#243832]/40 text-[#a8c5a0] hover:bg-[#243832]/60'
            }`}
          >
            <MenuIcon className="w-4 h-4 mr-2" />
            Menu Management
          </Button>
        </div>

        {/* Customers Tab */}
        {currentTab === 'customers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer List */}
            <div>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a8c5a0]/60" />
                  <Input
                    type="text"
                    placeholder="Search by name or mobile..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#243832]/40 border-[#a8c5a0]/30 text-[#d4e4d0]"
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredCustomers.map((customer) => (
                  <motion.div
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedCustomer?.id === customer.id
                        ? 'bg-gradient-to-br from-[#a8c5a0]/30 to-[#8fb088]/20 border-2 border-[#a8c5a0]'
                        : 'bg-[#243832]/40 border border-[#a8c5a0]/20 hover:border-[#a8c5a0]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg text-[#d4e4d0]">{customer.name}</h3>
                        <p className="text-[#a8c5a0]/70 text-sm">{customer.mobile}</p>
                        <p className="text-[#a8c5a0]/50 text-xs mt-1">
                          {customer.purchases?.length || 0} total purchases
                        </p>
                      </div>
                      {customer.isAdmin && (
                        <span className="px-2 py-1 bg-[#a8c5a0]/20 text-[#a8c5a0] rounded-full text-xs">
                          Admin
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div>
              {selectedCustomer ? (
                <div className="bg-gradient-to-br from-[#243832]/60 to-[#1a2f2a]/60 border border-[#a8c5a0]/30 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl text-[#d4e4d0] mb-1">{selectedCustomer.name}</h2>
                      <p className="text-[#a8c5a0]/70">{selectedCustomer.mobile}</p>
                    </div>
                    <Button
                      onClick={() => setShowAddItems(true)}
                      size="sm"
                      className="bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Items
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#a8c5a0]/10 rounded-xl p-4">
                      <p className="text-[#a8c5a0]/70 text-sm">Total Purchases</p>
                      <p className="text-2xl text-[#d4e4d0]">{selectedCustomer.purchases?.length || 0}</p>
                    </div>
                    <div className="bg-[#a8c5a0]/10 rounded-xl p-4">
                      <p className="text-[#a8c5a0]/70 text-sm">Badges Earned</p>
                      <p className="text-2xl text-[#d4e4d0]">{selectedCustomer.badges?.length || 0}</p>
                    </div>
                  </div>

                  {/* Purchase History */}
                  <h3 className="text-xl text-[#d4e4d0] mb-4">Purchase History</h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {selectedCustomer.purchaseHistory?.length > 0 ? (
                      selectedCustomer.purchaseHistory
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map((purchase) => (
                          <div
                            key={purchase.id}
                            className="bg-[#1a2f2a]/50 border border-[#a8c5a0]/20 rounded-xl p-4"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#a8c5a0]" />
                                <span className="text-[#d4e4d0] text-sm">
                                  {formatDate(purchase.timestamp)}
                                </span>
                              </div>
                              <Button
                                onClick={() => handleRemovePurchase(purchase.id)}
                                size="sm"
                                variant="outline"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-8 px-2"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="space-y-1">
                              {purchase.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#a8c5a0]" />
                                  <span className="text-[#d4e4d0]/90 text-sm">{item}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 text-xs text-[#a8c5a0]/50">
                              Source: {purchase.source}
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-[#a8c5a0]/50 text-center py-8">No purchases yet</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-[#243832]/40 border border-[#a8c5a0]/20 rounded-2xl p-12 text-center">
                  <Users className="w-16 h-16 text-[#a8c5a0]/30 mx-auto mb-4" />
                  <p className="text-[#a8c5a0]/60">Select a customer to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admins Tab */}
        {currentTab === 'admins' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-[#243832]/60 to-[#1a2f2a]/60 border border-[#a8c5a0]/30 rounded-2xl p-6 mb-6">
              <h3 className="text-xl text-[#d4e4d0] mb-4">Add New Admin</h3>
              <div className="flex gap-3">
                <Input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={newAdminMobile}
                  onChange={(e) => setNewAdminMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="flex-1 bg-[#1a2f2a]/50 border-[#a8c5a0]/30 text-[#d4e4d0]"
                  maxLength={10}
                />
                <Button
                  onClick={handleAddAdmin}
                  disabled={newAdminMobile.length !== 10}
                  className="bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Admin
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl text-[#d4e4d0] mb-4">Admin Users</h3>
              {admins.map((admin) => (
                <div
                  key={admin.mobile}
                  className="bg-[#243832]/40 border border-[#a8c5a0]/20 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-[#d4e4d0]">{admin.mobile}</p>
                    <p className="text-[#a8c5a0]/50 text-xs">
                      Added: {formatDate(admin.addedAt)}
                    </p>
                  </div>
                  {admin.mobile !== userMobile && (
                    <Button
                      onClick={() => handleRemoveAdmin(admin.mobile)}
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Management Tab */}
        {currentTab === 'menu' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#243832]/60 to-[#1a2f2a]/60 border border-[#a8c5a0]/30 rounded-2xl p-6">
              <h3 className="text-2xl text-[#d4e4d0] mb-6">Current Menu</h3>
              <p className="text-[#a8c5a0]/70 mb-4">
                Total Items: {menuItems.length}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1a2f2a]/50 border border-[#a8c5a0]/20 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-[#d4e4d0]">{item.name}</h4>
                        <p className="text-[#a8c5a0]/60 text-sm">{item.category}</p>
                        <p className="text-[#a8c5a0] mt-1">{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-[#a8c5a0]/10 rounded-xl">
                <p className="text-[#a8c5a0]/70 text-sm text-center">
                  Menu editing features coming soon. Currently displaying read-only menu.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Items Modal */}
      {showAddItems && selectedCustomer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddItems(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-gradient-to-br from-[#243832] to-[#1a2f2a] border border-[#a8c5a0]/30 rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-[#d4e4d0]">Add Items for {selectedCustomer.name}</h3>
              <button
                onClick={() => setShowAddItems(false)}
                className="text-[#a8c5a0] hover:text-[#d4e4d0]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
              {menuItems.map((item) => {
                const isSelected = selectedItems.includes(item.name);
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedItems(selectedItems.filter(i => i !== item.name));
                      } else {
                        setSelectedItems([...selectedItems, item.name]);
                      }
                    }}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-[#a8c5a0]/20 border-2 border-[#a8c5a0]'
                        : 'bg-[#243832]/50 border border-[#a8c5a0]/20 hover:border-[#a8c5a0]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#d4e4d0]">{item.name}</p>
                        <p className="text-[#a8c5a0]/60 text-sm">{item.category} • {item.price}</p>
                      </div>
                      {isSelected && <Award className="w-5 h-5 text-[#a8c5a0]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowAddItems(false);
                  setSelectedItems([]);
                }}
                variant="outline"
                className="flex-1 border-[#a8c5a0]/30 text-[#a8c5a0]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPurchase}
                disabled={selectedItems.length === 0}
                className="flex-1 bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a]"
              >
                Add {selectedItems.length} Items
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
