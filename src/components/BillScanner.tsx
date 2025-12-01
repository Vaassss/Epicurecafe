import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Camera, Upload, X, CheckCircle, Loader2, Plus, Trash2 } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { menuItems } from '../data/menuData';
import { createWorker } from 'tesseract.js';

interface BillScannerProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function BillScanner({ userId, onClose, onSuccess }: BillScannerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedText, setScannedText] = useState<string>('');
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [manualItems, setManualItems] = useState<string[]>([]);
  const [showManualSelect, setShowManualSelect] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      processImage(file);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    try {
      // Use Tesseract.js for OCR
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      setScannedText(text);
      
      // Extract menu items from scanned text
      const foundItems = extractMenuItems(text);
      setDetectedItems(foundItems);

      if (foundItems.length === 0) {
        toast.info('No menu items detected. You can add items manually.');
        setShowManualSelect(true);
      } else {
        toast.success(`Found ${foundItems.length} items in the bill!`);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. You can add items manually.');
      setShowManualSelect(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const extractMenuItems = (text: string): string[] => {
    const found: string[] = [];
    const lowerText = text.toLowerCase();

    // Check each menu item name
    menuItems.forEach(item => {
      const itemNameLower = item.name.toLowerCase();
      // Check if item name appears in text (with some flexibility)
      if (lowerText.includes(itemNameLower)) {
        if (!found.includes(item.name)) {
          found.push(item.name);
        }
      } else {
        // Check partial matches (at least 70% of the word)
        const words = itemNameLower.split(' ');
        let matchCount = 0;
        words.forEach(word => {
          if (word.length > 3 && lowerText.includes(word)) {
            matchCount++;
          }
        });
        if (matchCount > 0 && matchCount / words.length >= 0.7) {
          if (!found.includes(item.name)) {
            found.push(item.name);
          }
        }
      }
    });

    return found;
  };

  const handleAddManualItem = (itemName: string) => {
    if (!manualItems.includes(itemName)) {
      setManualItems([...manualItems, itemName]);
    }
  };

  const handleRemoveManualItem = (itemName: string) => {
    setManualItems(manualItems.filter(item => item !== itemName));
  };

  const handleRemoveDetectedItem = (itemName: string) => {
    setDetectedItems(detectedItems.filter(item => item !== itemName));
  };

  const handleSubmit = async () => {
    const allItems = [...detectedItems, ...manualItems];
    
    if (allItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    setIsProcessing(true);
    const response = await api.scanBill(userId, allItems, scannedText);
    setIsProcessing(false);

    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success(`Successfully added ${allItems.length} items to your purchase history!`);
    onSuccess();
    onClose();
  };

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
        className="bg-gradient-to-br from-[#243832] to-[#1a2f2a] border border-[#a8c5a0]/30 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl text-[#d4e4d0]">Scan Bill</h2>
          <button
            onClick={onClose}
            className="text-[#a8c5a0] hover:text-[#d4e4d0] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image Upload Section */}
        {!selectedImage && (
          <div className="space-y-4 mb-6">
            <p className="text-[#a8c5a0]/80">
              Scan or upload your bill to automatically detect purchased items
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => cameraInputRef.current?.click()}
                className="h-32 bg-gradient-to-br from-[#a8c5a0]/20 to-[#8fb088]/10 border-2 border-[#a8c5a0]/30 text-[#d4e4d0] hover:border-[#a8c5a0] hover:bg-[#a8c5a0]/10 flex-col gap-2"
              >
                <Camera className="w-12 h-12" />
                <span>Take Photo</span>
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="h-32 bg-gradient-to-br from-[#a8c5a0]/20 to-[#8fb088]/10 border-2 border-[#a8c5a0]/30 text-[#d4e4d0] hover:border-[#a8c5a0] hover:bg-[#a8c5a0]/10 flex-col gap-2"
              >
                <Upload className="w-12 h-12" />
                <span>Upload Image</span>
              </Button>
            </div>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelect(file);
              }}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelect(file);
              }}
            />
            
            <div className="text-center">
              <Button
                onClick={() => setShowManualSelect(true)}
                variant="outline"
                className="border-[#a8c5a0]/30 text-[#a8c5a0] hover:bg-[#a8c5a0]/10"
              >
                Or Add Items Manually
              </Button>
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && selectedImage && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="w-12 h-12 text-[#a8c5a0] animate-spin" />
            <p className="text-[#a8c5a0]">Processing your bill...</p>
          </div>
        )}

        {/* Image Preview */}
        {selectedImage && !isProcessing && (
          <div className="mb-6">
            <img
              src={selectedImage}
              alt="Bill"
              className="w-full max-h-64 object-contain rounded-xl border border-[#a8c5a0]/30"
            />
            <Button
              onClick={() => {
                setSelectedImage(null);
                setDetectedItems([]);
                setScannedText('');
              }}
              variant="outline"
              className="mt-4 w-full border-[#a8c5a0]/30 text-[#a8c5a0] hover:bg-[#a8c5a0]/10"
            >
              Scan Different Bill
            </Button>
          </div>
        )}

        {/* Detected Items */}
        {detectedItems.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl text-[#d4e4d0] mb-3">Detected Items</h3>
            <div className="space-y-2">
              {detectedItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between bg-[#a8c5a0]/10 rounded-xl p-3 border border-[#a8c5a0]/30"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#a8c5a0]" />
                    <span className="text-[#d4e4d0]">{item}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveDetectedItem(item)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Item Selection */}
        {showManualSelect && (
          <div className="mb-6">
            <h3 className="text-xl text-[#d4e4d0] mb-3">
              {manualItems.length > 0 ? 'Manually Added Items' : 'Add Items Manually'}
            </h3>
            
            {manualItems.length > 0 && (
              <div className="space-y-2 mb-4">
                {manualItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between bg-[#a8c5a0]/10 rounded-xl p-3 border border-[#a8c5a0]/30"
                  >
                    <span className="text-[#d4e4d0]">{item}</span>
                    <button
                      onClick={() => handleRemoveManualItem(item)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto bg-[#1a2f2a]/50 rounded-xl p-3 border border-[#a8c5a0]/20">
              {menuItems.map((item) => {
                const isAlreadyAdded = manualItems.includes(item.name) || detectedItems.includes(item.name);
                return (
                  <button
                    key={item.id}
                    onClick={() => !isAlreadyAdded && handleAddManualItem(item.name)}
                    disabled={isAlreadyAdded}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      isAlreadyAdded
                        ? 'bg-[#a8c5a0]/5 text-[#a8c5a0]/40 cursor-not-allowed'
                        : 'bg-[#243832]/50 hover:bg-[#a8c5a0]/10 text-[#d4e4d0] hover:border-[#a8c5a0]/50'
                    } border border-[#a8c5a0]/20`}
                  >
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-[#a8c5a0]/60">{item.category} • {item.price}</div>
                    </div>
                    {!isAlreadyAdded && <Plus className="w-5 h-5" />}
                    {isAlreadyAdded && <CheckCircle className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {(detectedItems.length > 0 || manualItems.length > 0) && (
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-[#a8c5a0]/30 text-[#a8c5a0] hover:bg-[#a8c5a0]/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a] hover:shadow-lg hover:shadow-[#a8c5a0]/50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Add ${detectedItems.length + manualItems.length} Items`
              )}
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
