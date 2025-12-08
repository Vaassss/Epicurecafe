import { motion } from 'motion/react';
import { X, ShoppingBag, Calendar, MapPin } from 'lucide-react';
import { Button } from './ui/button';

interface PurchaseRecord {
  id: string;
  items: string[];
  timestamp: string;
  source: 'scanner' | 'barista' | 'manual';
  billId?: string;
}

interface PurchaseHistoryProps {
  purchaseHistory: PurchaseRecord[];
  onClose: () => void;
}

export function PurchaseHistory({ purchaseHistory, onClose }: PurchaseHistoryProps) {
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

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'scanner':
        return '📱 Scanned Bill';
      case 'barista':
        return '☕ Added by Barista';
      case 'manual':
        return '✋ Manual Entry';
      default:
        return source;
    }
  };

  const sortedHistory = [...purchaseHistory].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-[#243832] to-[#1a2f2a] border border-[#a8c5a0]/30 rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-[#a8c5a0]" />
            <h2 className="text-3xl text-[#d4e4d0]">Purchase History</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#a8c5a0] hover:text-[#d4e4d0] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Empty State */}
        {sortedHistory.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-[#a8c5a0]/30 mx-auto mb-4" />
            <p className="text-[#a8c5a0]/60 text-lg">No purchases yet</p>
            <p className="text-[#a8c5a0]/40 text-sm mt-2">
              Scan your bills or make purchases to see them here
            </p>
          </div>
        )}

        {/* Purchase List */}
        {sortedHistory.length > 0 && (
          <div className="space-y-4">
            <p className="text-[#a8c5a0]/70 text-sm mb-4">
              Total Purchases: {sortedHistory.length}
            </p>
            
            {sortedHistory.map((purchase, index) => (
              <motion.div
                key={purchase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-[#243832]/60 to-[#1a2f2a]/60 backdrop-blur-sm border border-[#a8c5a0]/20 rounded-2xl p-5 hover:border-[#a8c5a0]/40 transition-all"
              >
                {/* Purchase Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-[#a8c5a0]" />
                      <span className="text-[#d4e4d0]">
                        {formatDate(purchase.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#a8c5a0]/70">
                      <MapPin className="w-4 h-4" />
                      <span>{getSourceLabel(purchase.source)}</span>
                    </div>
                  </div>
                  <div className="bg-[#a8c5a0]/20 px-3 py-1 rounded-full">
                    <span className="text-[#a8c5a0] text-sm">
                      {purchase.items.length} {purchase.items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-1.5 pt-3 border-t border-[#a8c5a0]/10">
                  {purchase.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center gap-2 text-[#d4e4d0]/90"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#a8c5a0]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Bill ID if available */}
                {purchase.billId && (
                  <div className="mt-3 pt-3 border-t border-[#a8c5a0]/10">
                    <span className="text-xs text-[#a8c5a0]/50">
                      Bill ID: {purchase.billId}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Close Button */}
        <div className="mt-6">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a] hover:shadow-lg hover:shadow-[#a8c5a0]/50"
          >
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
