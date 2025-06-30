import React, { useState } from 'react';
import { Check, Crown, Zap, Shield, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const SubscriptionPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'basic',
      name: 'Basic Support',
      price: 0,
      period: 'forever',
      description: 'Essential peer support for everyone',
      features: [
        'AI Assistant (limited)',
        'Text chat with helpers',
        'Basic crisis resources',
        'Community forums',
        'Email support'
      ],
      color: 'gray',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro Support',
      price: 19.99,
      period: 'month',
      description: 'Enhanced support with premium features',
      features: [
        'Unlimited AI Assistant',
        'Video & voice calls',
        'Priority helper matching',
        'ElevenLabs voice AI',
        'Tavus AI avatars',
        'Advanced analytics',
        '24/7 priority support',
        'Blockchain verification'
      ],
      color: 'blue',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium Care',
      price: 49.99,
      period: 'month',
      description: 'Complete mental health ecosystem',
      features: [
        'Everything in Pro',
        'Personal AI therapist',
        'Dedicated helper team',
        'Family account sharing',
        'Advanced mood tracking',
        'Personalized insights',
        'White-glove onboarding',
        'Custom AI training'
      ],
      color: 'purple',
      popular: false
    }
  ];

  const handleRevenueCatSubscription = (planId: string) => {
    // Simulate RevenueCat subscription flow
    alert(`Processing subscription to ${plans.find(p => p.id === planId)?.name} via RevenueCat...`);
  };

  const getColorClasses = (color: string, selected: boolean) => {
    const colorMap = {
      gray: selected 
        ? 'border-gray-500 bg-gray-50' 
        : 'border-gray-200 hover:border-gray-300',
      blue: selected 
        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
        : 'border-blue-200 hover:border-blue-400',
      purple: selected 
        ? 'border-purple-500 bg-purple-50' 
        : 'border-purple-200 hover:border-purple-400'
    };
    return colorMap[color as keyof typeof colorMap];
  };

  const getButtonClasses = (color: string) => {
    const colorMap = {
      gray: 'bg-gray-600 hover:bg-gray-700',
      blue: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
      purple: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Support Level
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Flexible pricing powered by RevenueCat. Pay what works for your situation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative p-8 rounded-3xl border-2 transition-all duration-300 cursor-pointer ${getColorClasses(plan.color, selectedPlan === plan.id)} ${plan.popular ? 'transform scale-105 shadow-2xl' : 'shadow-lg hover:shadow-xl'}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Crown className="h-4 w-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.color === 'gray' ? 'bg-gray-200' : plan.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                      <Check className={`h-3 w-3 ${plan.color === 'gray' ? 'text-gray-600' : plan.color === 'blue' ? 'text-blue-600' : 'text-purple-600'}`} />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleRevenueCatSubscription(plan.id)}
                className={`w-full py-4 px-6 rounded-xl text-white font-bold transition-all duration-300 ${getButtonClasses(plan.color)}`}
              >
                {plan.price === 0 ? 'Get Started Free' : 'Start Subscription'}
              </button>

              {plan.id === 'pro' && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">Powered by RevenueCat</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* RevenueCat Features */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Subscription Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-xl w-fit mx-auto mb-3">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Secure Payments</h4>
              <p className="text-sm text-gray-600">RevenueCat handles all payment processing securely</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-xl w-fit mx-auto mb-3">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Instant Access</h4>
              <p className="text-sm text-gray-600">Immediate activation of premium features</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-xl w-fit mx-auto mb-3">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Cancel Anytime</h4>
              <p className="text-sm text-gray-600">No long-term commitments or hidden fees</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-3 rounded-xl w-fit mx-auto mb-3">
                <Crown className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">Premium Support</h4>
              <p className="text-sm text-gray-600">Priority access to our best helpers</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};