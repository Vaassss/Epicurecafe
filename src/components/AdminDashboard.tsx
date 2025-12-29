import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  LogOut, Users, ShoppingBag, Shield, Trash2, Plus, 
  Search, X, Calendar, Award, Menu as MenuIcon, Edit2, Save, Loader2
} from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { menuItems as initialMenuItems } from '../data/menuData';

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

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: string;
  image?: string;
}

export function AdminDashboard({ userId, userName, userMobile, onLogout }: AdminDashboardProps) {
  const [currentTab, setCurrentTab] = useState<'customers' | 'admins' | 'menu'>('customers');
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAdminMobile, setNewAdminMobile] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for adding items
  const [showAddItems, setShowAddItems] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Menu editing states
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({});
  const [showAddMenuItem, setShowAddMenuItem] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentTab]);

  // Load menu from localStorage
  useEffect(() => {
    const savedMenu = localStorage.getItem('epicure-menu');
    if (savedMenu) {
      try {
        setMenuItems(JSON.parse(savedMenu));
      } catch (e) {
        console.error('Failed to load menu from localStorage:', e);
      }
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (currentTab === 'customers') {
        const response = await api.admin.getAllCustomers(userMobile);
        if (response.error) {
          setError(response.error);
          toast.error(response.error);
        } else if (response.customers) {
          setCustomers(response.customers);
        }
      } else if (currentTab === 'admins') {
        const response = await api.admin.getAdmins(userMobile);
        if (response.error) {
          setError(response.error);
          toast.error(response.error);
        } else if (response.admins) {
          setAdmins(response.admins);
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPurchase = async () => {
    if (!selectedCustomer || selectedItems.length === 0) {
      toast.error('Please select items to add');
      return;
    }

    setLoading(true);
    try {
      const response = await api.admin.addPurchase(userMobile, selectedCustomer.mobile, selectedItems);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(`Added ${selectedItems.length} items to ${selectedCustomer.name}'s account`);
      setShowAddItems(false);
      setSelectedItems([]);
      
      // Refresh data
      await loadData();
      
      // Refresh selected customer data
      if (response.customer) {
        const updatedCustomers = customers.map(c => 
          c.mobile === selectedCustomer.mobile ? response.customer : c
        );
        setCustomers(updatedCustomers);
        setSelectedCustomer(response.customer);
      }
    } catch (err) {
      toast.error('Failed to add purchase');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePurchase = async (purchaseId: string) => {
    if (!selectedCustomer) return;

    if (!confirm('Are you sure you want to remove this purchase?')) return;

    setLoading(true);
    try {
      const response = await api.admin.removePurchase(userMobile, selectedCustomer.mobile, purchaseId);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success('Purchase removed successfully');
      await loadData();
      
      // Refresh selected customer data
      if (response.customer) {
        const updatedCustomers = customers.map(c => 
          c.mobile === selectedCustomer.mobile ? response.customer : c
        );
        setCustomers(updatedCustomers);
        setSelectedCustomer(response.customer);
      }
    } catch (err) {
      toast.error('Failed to remove purchase');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!/^\d{10}$/.test(newAdminMobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!newAdminName.trim()) {
      toast.error('Please enter admin name');
      return;
    }

    setLoading(true);
    try {
      const response = await api.admin.addAdmin(userMobile, newAdminMobile, newAdminName.trim());
      
      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success('Admin added successfully');
      setNewAdminMobile('');
      setNewAdminName('');
      await loadData();
    } catch (err) {
      toast.error('Failed to add admin. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (mobile: string) => {
    if (!confirm(`Remove admin access for ${mobile}?`)) return;

    setLoading(true);
    try {
      const response = await api.admin.removeAdmin(userMobile, mobile);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success('Admin removed successfully');
      await loadData();
    } catch (err) {
      toast.error('Failed to remove admin');
    } finally {
      setLoading(false);
    }
  };

  // Menu editing functions
  const handleEditMenuItem = (item: MenuItem) => {
    setEditingItem(item.id);
    setEditForm(item);
  };

  const handleSaveMenuItem = () => {
    if (!editingItem || !editForm.name || !editForm.category || !editForm.price) {
      toast.error('Please fill all fields');
      return;
    }

    const updatedMenu = menuItems.map(item => 
      item.id === editingItem ? { ...item, ...editForm } : item
    );
    
    setMenuItems(updatedMenu);
    localStorage.setItem('epicure-menu', JSON.stringify(updatedMenu));
    setEditingItem(null);
    setEditForm({});
    toast.success('Menu item updated successfully');
  };

  const handleAddNewMenuItem = () => {
    if (!editForm.name || !editForm.category || !editForm.price) {
      toast.error('Please fill all fields');
      return;
    }

    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      name: editForm.name,
      category: editForm.category,
      price: editForm.price,
      image: editForm.image || ''
    };

    const updatedMenu = [...menuItems, newItem];
    setMenuItems(updatedMenu);
    localStorage.setItem('epicure-menu', JSON.stringify(updatedMenu));
    setShowAddMenuItem(false);
    setEditForm({});
    toast.success('Menu item added successfully');
  };

  const handleDeleteMenuItem = (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const updatedMenu = menuItems.filter(item => item.id !== itemId);
    setMenuItems(updatedMenu);
    localStorage.setItem('epicure-menu', JSON.stringify(updatedMenu));
    toast.success('Menu item deleted successfully');
  };

  const handleResetMenu = () => {
    if (!confirm('Reset menu to default? This will remove all custom items.')) return;
    
    setMenuItems(initialMenuItems);
    localStorage.removeItem('epicure-menu');
    toast.success('Menu reset to default');
  };

  // Memoized filtered customers for performance
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    
    const query = searchQuery.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.mobile.includes(query)
    );
  }, [customers, searchQuery]);

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
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <img 
              src={logoImage} 
              alt="Epicure Cafe" 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
              style={{ filter: 'brightness(1.2) contrast(1.1)' }}
            />
            <div className="min-w-0">
              <h1 
                className="text-lg sm:text-2xl text-[#d4e4d0] truncate"
                style={{ fontFamily: "'Mr Stalwart', cursive" }}
              >
                Admin Dashboard
              </h1>
              <p className="text-[#a8c5a0]/70 text-xs sm:text-sm truncate">{userName}</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="border-[#a8c5a0]/30 text-[#a8c5a0] hover:bg-[#a8c5a0]/10 flex-shrink-0"
          >
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2">
          <Button
            onClick={() => setCurrentTab('customers')}
            size="sm"
            className={`flex-shrink-0 ${
              currentTab === 'customers'
                ? 'bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a]'
                : 'bg-[#243832]/40 text-[#a8c5a0] hover:bg-[#243832]/60'
            }`}
          >
            <Users className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Customers</span>
          </Button>
          <Button
            onClick={() => setCurrentTab('admins')}
            size="sm"
            className={`flex-shrink-0 ${
              currentTab === 'admins'
                ? 'bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a]'
                : 'bg-[#243832]/40 text-[#a8c5a0] hover:bg-[#243832]/60'
            }`}
          >
            <Shield className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Admins</span>
          </Button>
          <Button
            onClick={() => setCurrentTab('menu')}
            size="sm"
            className={`flex-shrink-0 ${
              currentTab === 'menu'
                ? 'bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a]'
                : 'bg-[#243832]/40 text-[#a8c5a0] hover:bg-[#243832]/60'
            }`}
          >
            <MenuIcon className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Menu</span>
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-[#a8c5a0] animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
            <Button 
              onClick={loadData} 
              size="sm" 
              className="mt-2 bg-red-500/20 hover:bg-red-500/30 text-red-400"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Customers Tab */}
        {currentTab === 'customers' && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Customer List */}
            <div>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#a8c5a0]/60" />
                  <Input
                    type="text"
                    placeholder="Search by name or mobile..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 sm:pl-10 bg-[#243832]/40 border-[#a8c5a0]/30 text-[#d4e4d0] text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-1">
                {filteredCustomers.length === 0 ? (
                  <div className="text-center py-8 text-[#a8c5a0]/50">
                    {searchQuery ? 'No customers found' : 'No customers yet'}
                  </div>
                ) : (
                  filteredCustomers.map((customer) => (
                    <motion.div
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`p-3 sm:p-4 rounded-xl cursor-pointer transition-all ${
                        selectedCustomer?.id === customer.id
                          ? 'bg-gradient-to-br from-[#a8c5a0]/30 to-[#8fb088]/20 border-2 border-[#a8c5a0]'
                          : 'bg-[#243832]/40 border border-[#a8c5a0]/20 hover:border-[#a8c5a0]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm sm:text-lg text-[#d4e4d0] truncate">{customer.name}</h3>
                          <p className="text-[#a8c5a0]/70 text-xs sm:text-sm">{customer.mobile}</p>
                          <p className="text-[#a8c5a0]/50 text-xs mt-1">
                            {customer.purchases?.length || 0} purchases
                          </p>
                        </div>
                        {customer.isAdmin && (
                          <span className="px-2 py-1 bg-[#a8c5a0]/20 text-[#a8c5a0] rounded-full text-xs flex-shrink-0">
                            Admin
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Customer Details */}
            <div>
              {selectedCustomer ? (
                <div className="bg-gradient-to-br from-[#243832]/60 to-[#1a2f2a]/60 border border-[#a8c5a0]/30 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4 sm:mb-6 gap-2">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl sm:text-2xl text-[#d4e4d0] mb-1 truncate">{selectedCustomer.name}</h2>
                      <p className="text-[#a8c5a0]/70 text-sm">{selectedCustomer.mobile}</p>
                    </div>
                    <Button
                      onClick={() => setShowAddItems(true)}
                      size="sm"
                      className="bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a] flex-shrink-0"
                    >
                      <Plus className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Add Items</span>
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-[#a8c5a0]/10 rounded-xl p-3 sm:p-4">
                      <p className="text-[#a8c5a0]/70 text-xs sm:text-sm">Total Purchases</p>
                      <p className="text-xl sm:text-2xl text-[#d4e4d0]">{selectedCustomer.purchases?.length || 0}</p>
                    </div>
                    <div className="bg-[#a8c5a0]/10 rounded-xl p-3 sm:p-4">
                      <p className="text-[#a8c5a0]/70 text-xs sm:text-sm">Badges Earned</p>
                      <p className="text-xl sm:text-2xl text-[#d4e4d0]">{selectedCustomer.badges?.length || 0}</p>
                    </div>
                  </div>

                  {/* Purchase History */}
                  <h3 className="text-lg sm:text-xl text-[#d4e4d0] mb-3 sm:mb-4">Purchase History</h3>
                  <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1">
                    {selectedCustomer.purchaseHistory?.length > 0 ? (
                      selectedCustomer.purchaseHistory
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map((purchase) => (
                          <div
                            key={purchase.id}
                            className="bg-[#1a2f2a]/50 border border-[#a8c5a0]/20 rounded-xl p-3 sm:p-4"
                          >
                            <div className="flex items-start justify-between mb-2 gap-2">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#a8c5a0] flex-shrink-0" />
                                <span className="text-[#d4e4d0] text-xs sm:text-sm truncate">
                                  {formatDate(purchase.timestamp)}
                                </span>
                              </div>
                              <Button
                                onClick={() => handleRemovePurchase(purchase.id)}
                                size="sm"
                                variant="outline"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-7 px-2 flex-shrink-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="space-y-1">
                              {purchase.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#a8c5a0] flex-shrink-0" />
                                  <span className="text-[#d4e4d0]/90 text-xs sm:text-sm">{item}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 text-xs text-[#a8c5a0]/50">
                              Source: {purchase.source}
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-[#a8c5a0]/50 text-center py-8 text-sm">No purchases yet</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-[#243832]/40 border border-[#a8c5a0]/20 rounded-2xl p-8 sm:p-12 text-center">
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 text-[#a8c5a0]/30 mx-auto mb-4" />
                  <p className="text-[#a8c5a0]/60 text-sm">Select a customer to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admins Tab */}
        {currentTab === 'admins' && !loading && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-[#243832]/60 to-[#1a2f2a]/60 border border-[#a8c5a0]/30 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl text-[#d4e4d0] mb-4">Add New Admin</h3>
              <div className="flex flex-col gap-3">
                <Input
                  type="text"
                  placeholder="Admin name"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="bg-[#1a2f2a]/50 border-[#a8c5a0]/30 text-[#d4e4d0]"
                />
                <div className="flex flex-col sm:flex-row gap-3">
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
                    disabled={newAdminMobile.length !== 10 || !newAdminName.trim() || loading}
                    className="bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a] w-full sm:w-auto"
                  >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    Add Admin
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl text-[#d4e4d0] mb-4">Admin Users ({admins.length})</h3>
              {admins.length === 0 ? (
                <div className="text-center py-8 text-[#a8c5a0]/50">
                  No admins found
                </div>
              ) : (
                admins.map((admin) => (
                  <div
                    key={admin.mobile}
                    className="bg-[#243832]/40 border border-[#a8c5a0]/20 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      {admin.name && (
                        <p className="text-[#d4e4d0] text-base sm:text-lg truncate">{admin.name}</p>
                      )}
                      <p className="text-[#a8c5a0]/70 text-sm sm:text-base truncate">{admin.mobile}</p>
                      <p className="text-[#a8c5a0]/50 text-xs">
                        Added: {formatDate(admin.addedAt)}
                      </p>
                    </div>
                    {admin.mobile !== userMobile && (
                      <Button
                        onClick={() => handleRemoveAdmin(admin.mobile)}
                        size="sm"
                        variant="outline"
                        disabled={loading}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Remove</span>
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Menu Management Tab */}
        {currentTab === 'menu' && !loading && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#243832]/60 to-[#1a2f2a]/60 border border-[#a8c5a0]/30 rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl text-[#d4e4d0]">Menu Management</h3>
                  <p className="text-[#a8c5a0]/70 text-sm mt-1">
                    Total Items: {menuItems.length}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    onClick={() => {
                      setShowAddMenuItem(true);
                      setEditForm({});
                    }}
                    size="sm"
                    className="bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a] flex-1 sm:flex-initial"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                  <Button
                    onClick={handleResetMenu}
                    size="sm"
                    variant="outline"
                    className="border-[#a8c5a0]/30 text-[#a8c5a0] flex-1 sm:flex-initial"
                  >
                    Reset
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-1">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1a2f2a]/50 border border-[#a8c5a0]/20 rounded-xl p-3 sm:p-4"
                  >
                    {editingItem === item.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="Item name"
                          className="bg-[#243832]/40 border-[#a8c5a0]/30 text-[#d4e4d0] text-sm"
                        />
                        <Input
                          value={editForm.category || ''}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          placeholder="Category"
                          className="bg-[#243832]/40 border-[#a8c5a0]/30 text-[#d4e4d0] text-sm"
                        />
                        <Input
                          value={editForm.price || ''}
                          onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                          placeholder="Price (e.g., ₹120)"
                          className="bg-[#243832]/40 border-[#a8c5a0]/30 text-[#d4e4d0] text-sm"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveMenuItem}
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a]"
                          >
                            <Save className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingItem(null);
                              setEditForm({});
                            }}
                            size="sm"
                            variant="outline"
                            className="border-[#a8c5a0]/30 text-[#a8c5a0]"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-[#d4e4d0] text-sm sm:text-base truncate">{item.name}</h4>
                            <p className="text-[#a8c5a0]/60 text-xs sm:text-sm">{item.category}</p>
                            <p className="text-[#a8c5a0] mt-1 text-sm">{item.price}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditMenuItem(item)}
                            size="sm"
                            variant="outline"
                            className="flex-1 border-[#a8c5a0]/30 text-[#a8c5a0] text-xs"
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            size="sm"
                            variant="outline"
                            className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Items Modal */}
      <AnimatePresence>
        {showAddItems && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={() => setShowAddItems(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-[#243832] to-[#1a2f2a] border border-[#a8c5a0]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-2xl text-[#d4e4d0] truncate pr-2">
                  Add Items for {selectedCustomer.name}
                </h3>
                <button
                  onClick={() => setShowAddItems(false)}
                  className="text-[#a8c5a0] hover:text-[#d4e4d0] flex-shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-2 mb-4 sm:mb-6 max-h-[50vh] overflow-y-auto pr-1">
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
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-[#d4e4d0] text-sm sm:text-base truncate">{item.name}</p>
                          <p className="text-[#a8c5a0]/60 text-xs sm:text-sm">{item.category} • {item.price}</p>
                        </div>
                        {isSelected && <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#a8c5a0] flex-shrink-0" />}
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
                  disabled={selectedItems.length === 0 || loading}
                  className="flex-1 bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a]"
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Add {selectedItems.length} Items
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Menu Item Modal */}
      <AnimatePresence>
        {showAddMenuItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={() => setShowAddMenuItem(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-[#243832] to-[#1a2f2a] border border-[#a8c5a0]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-2xl text-[#d4e4d0]">Add New Menu Item</h3>
                <button
                  onClick={() => setShowAddMenuItem(false)}
                  className="text-[#a8c5a0] hover:text-[#d4e4d0]"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div>
                  <label className="text-[#a8c5a0]/70 text-sm mb-2 block">Item Name</label>
                  <Input
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="e.g., Cappuccino"
                    className="bg-[#243832]/40 border-[#a8c5a0]/30 text-[#d4e4d0]"
                  />
                </div>
                <div>
                  <label className="text-[#a8c5a0]/70 text-sm mb-2 block">Category</label>
                  <Input
                    value={editForm.category || ''}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    placeholder="e.g., Hot Drinks"
                    className="bg-[#243832]/40 border-[#a8c5a0]/30 text-[#d4e4d0]"
                  />
                </div>
                <div>
                  <label className="text-[#a8c5a0]/70 text-sm mb-2 block">Price</label>
                  <Input
                    value={editForm.price || ''}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    placeholder="e.g., ₹120"
                    className="bg-[#243832]/40 border-[#a8c5a0]/30 text-[#d4e4d0]"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowAddMenuItem(false);
                    setEditForm({});
                  }}
                  variant="outline"
                  className="flex-1 border-[#a8c5a0]/30 text-[#a8c5a0]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddNewMenuItem}
                  disabled={!editForm.name || !editForm.category || !editForm.price}
                  className="flex-1 bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
