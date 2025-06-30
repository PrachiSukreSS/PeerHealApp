import React, { useState } from 'react';
import { Shield, Coins, Lock, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const AlgorandIntegration: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [balance, setBalance] = useState(0);

  const handleConnectWallet = () => {
    // Simulate Algorand wallet connection
    setWalletConnected(true);
    setBalance(Math.random() * 1000);
    alert('Connected to Algorand wallet! You can now make secure payments and earn trust tokens.');
  };

  const handlePayment = (amount: number) => {
    if (!walletConnected) {
      alert('Please connect your Algorand wallet first');
      return;
    }
    alert(`Processing payment of ${amount} ALGO via Algorand blockchain...`);
  };

  const trustFeatures = [
    {
      icon: Shield,
      title: 'Blockchain Verification',
      description: 'All helper credentials verified on Algorand blockchain',
      color: 'blue'
    },
    {
      icon: Coins,
      title: 'ALGO Payments',
      description: 'Fast, secure payments with minimal fees',
      color: 'green'
    },
    {
      icon: Lock,
      title: 'Smart Contracts',
      description: 'Automated escrow and dispute resolution',
      color: 'purple'
    },
    {
      icon: TrendingUp,
      title: 'Trust Tokens',
      description: 'Earn tokens for positive interactions',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Powered by Algorand Blockchain
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of trust and payments with Algorand's fast, secure, and sustainable blockchain technology
          </p>
        </motion.div>

        {/* Wallet Connection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {walletConnected ? 'Wallet Connected' : 'Connect Your Algorand Wallet'}
              </h3>
              <p className="text-gray-600">
                {walletConnected 
                  ? `Balance: ${balance.toFixed(2)} ALGO` 
                  : 'Connect to enable secure payments and earn trust tokens'
                }
              </p>
            </div>
            <button
              onClick={handleConnectWallet}
              disabled={walletConnected}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                walletConnected 
                  ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:shadow-lg'
              }`}
            >
              {walletConnected ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Connected</span>
                </div>
              ) : (
                'Connect Wallet'
              )}
            </button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trustFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className={`p-4 rounded-2xl w-fit mb-6 ${getColorClasses(feature.color)}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Demo */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-8 text-white"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6">
              Try Algorand Payments
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Experience lightning-fast, low-cost payments for peer support sessions
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => handlePayment(25)}
                className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/30 transition-all duration-300"
              >
                <div className="text-2xl font-bold mb-2">25 ALGO</div>
                <div className="text-blue-100">1 Hour Session</div>
              </button>
              <button
                onClick={() => handlePayment(100)}
                className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/30 transition-all duration-300"
              >
                <div className="text-2xl font-bold mb-2">100 ALGO</div>
                <div className="text-blue-100">Monthly Package</div>
              </button>
              <button
                onClick={() => handlePayment(10)}
                className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/30 transition-all duration-300"
              >
                <div className="text-2xl font-bold mb-2">10 ALGO</div>
                <div className="text-blue-100">Quick Chat</div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};