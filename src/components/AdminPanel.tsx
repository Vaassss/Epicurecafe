import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Activity, Database, Users, Award, ArrowLeft } from 'lucide-react';
import { checkBackendHealth } from '../utils/healthCheck';
import type { HealthStatus } from '../utils/healthCheck';

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    const status = await checkBackendHealth();
    setHealthStatus(status);
    setLoading(false);
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a2f2a] p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-[#a8c5a0]/30 text-[#a8c5a0] hover:bg-[#a8c5a0]/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl text-[#d4e4d0]" style={{ fontFamily: "'Mr Stalwart', cursive" }}>
            System Admin
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Backend Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#243832]/40 to-[#1a2f2a]/40 backdrop-blur-sm border border-[#a8c5a0]/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Activity className={`w-6 h-6 ${healthStatus?.isHealthy ? 'text-green-400' : 'text-red-400'}`} />
              <h3 className="text-[#d4e4d0]">Backend Status</h3>
            </div>
            <p className={`text-2xl ${healthStatus?.isHealthy ? 'text-green-400' : 'text-red-400'}`}>
              {loading ? 'Checking...' : healthStatus?.isHealthy ? 'Healthy' : 'Offline'}
            </p>
            <p className="text-[#a8c5a0]/60 text-sm mt-2">
              {healthStatus?.message || 'Not checked yet'}
            </p>
            <Button
              onClick={checkHealth}
              disabled={loading}
              className="mt-4 w-full bg-[#a8c5a0]/20 text-[#a8c5a0] hover:bg-[#a8c5a0]/30"
              size="sm"
            >
              Refresh
            </Button>
          </motion.div>

          {/* Database */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#243832]/40 to-[#1a2f2a]/40 backdrop-blur-sm border border-[#a8c5a0]/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-6 h-6 text-[#a8c5a0]" />
              <h3 className="text-[#d4e4d0]">Database</h3>
            </div>
            <p className="text-2xl text-[#d4e4d0]">Connected</p>
            <p className="text-[#a8c5a0]/60 text-sm mt-2">
              Supabase KV Store
            </p>
          </motion.div>

          {/* API Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#243832]/40 to-[#1a2f2a]/40 backdrop-blur-sm border border-[#a8c5a0]/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-[#a8c5a0]" />
              <h3 className="text-[#d4e4d0]">API Version</h3>
            </div>
            <p className="text-2xl text-[#d4e4d0]">v1.0.0</p>
            <p className="text-[#a8c5a0]/60 text-sm mt-2">
              Production Ready
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#243832]/40 to-[#1a2f2a]/40 backdrop-blur-sm border border-[#a8c5a0]/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-6 h-6 text-[#a8c5a0]" />
              <h3 className="text-[#d4e4d0]">Features</h3>
            </div>
            <p className="text-2xl text-[#d4e4d0]">4 Roadmaps</p>
            <p className="text-[#a8c5a0]/60 text-sm mt-2">
              43 menu items
            </p>
          </motion.div>
        </div>

        {/* System Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#243832]/40 to-[#1a2f2a]/40 backdrop-blur-sm border border-[#a8c5a0]/30 rounded-2xl p-8"
        >
          <h2 className="text-2xl text-[#d4e4d0] mb-6">System Information</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-[#a8c5a0]/10">
              <span className="text-[#a8c5a0]">Environment</span>
              <span className="text-[#d4e4d0]">Production</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-[#a8c5a0]/10">
              <span className="text-[#a8c5a0]">Server Location</span>
              <span className="text-[#d4e4d0]">Supabase Edge Functions</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-[#a8c5a0]/10">
              <span className="text-[#a8c5a0]">Authentication</span>
              <span className="text-[#d4e4d0]">OTP (Mobile)</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-[#a8c5a0]/10">
              <span className="text-[#a8c5a0]">Data Storage</span>
              <span className="text-[#d4e4d0]">PostgreSQL (Supabase)</span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-[#a8c5a0]">Last Updated</span>
              <span className="text-[#d4e4d0]">{healthStatus?.timestamp || 'N/A'}</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-br from-[#243832]/40 to-[#1a2f2a]/40 backdrop-blur-sm border border-[#a8c5a0]/30 rounded-2xl p-8"
        >
          <h2 className="text-2xl text-[#d4e4d0] mb-6">Quick Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/DEPLOYMENT.md"
              target="_blank"
              className="block p-4 bg-[#a8c5a0]/10 hover:bg-[#a8c5a0]/20 border border-[#a8c5a0]/20 rounded-xl transition-colors"
            >
              <h3 className="text-[#d4e4d0] mb-1">📄 Deployment Guide</h3>
              <p className="text-[#a8c5a0]/60 text-sm">View deployment documentation</p>
            </a>
            
            <div className="block p-4 bg-[#a8c5a0]/10 border border-[#a8c5a0]/20 rounded-xl">
              <h3 className="text-[#d4e4d0] mb-1">🔍 View Logs</h3>
              <p className="text-[#a8c5a0]/60 text-sm">Check browser console (F12)</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
