import React from 'react';
import { Shield, CheckCircle, Eye, Lock, Users, Award } from 'lucide-react';

export const TrustSystem: React.FC = () => {
  const trustFeatures = [
    {
      icon: Shield,
      title: 'Blockchain Verification',
      description: 'Every helper is verified through our transparent blockchain system',
      details: 'Immutable trust scores and verified credentials'
    },
    {
      icon: CheckCircle,
      title: 'Identity Verification',
      description: 'Multi-layer identity checks including background verification',
      details: 'Government ID, professional credentials, and reference checks'
    },
    {
      icon: Eye,
      title: 'Transparent Reviews',
      description: 'All reviews are public and cryptographically signed',
      details: 'Tamper-proof feedback system with verified interactions'
    },
    {
      icon: Lock,
      title: 'Privacy Protection',
      description: 'Advanced encryption keeps your conversations secure',
      details: 'Zero-knowledge architecture with end-to-end encryption'
    }
  ];

  const stats = [
    { label: 'Verified Helpers', value: '5,000+', icon: Users },
    { label: 'Trust Score Average', value: '4.8/5', icon: Award },
    { label: 'Successful Sessions', value: '50K+', icon: CheckCircle },
    { label: 'Privacy Incidents', value: '0', icon: Lock }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Built on Trust & Transparency
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our blockchain-powered trust system ensures you connect with verified, qualified helpers in a safe environment
          </p>
        </div>

        {/* Trust Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="bg-blue-100 p-3 rounded-xl w-fit mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <p className="text-blue-600 text-xs font-medium">
                  {feature.details}
                </p>
              </div>
            );
          })}
        </div>

        {/* Trust Stats */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Trust by the Numbers
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-green-100 p-3 rounded-xl w-fit mx-auto mb-3">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-6">
              How Our Trust System Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-white/20 p-4 rounded-full mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Verify</h4>
                <p className="text-blue-100 text-sm">
                  Helpers submit credentials and undergo thorough background checks
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white/20 p-4 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Track</h4>
                <p className="text-blue-100 text-sm">
                  Every interaction is logged on blockchain for transparency
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white/20 p-4 rounded-full mb-4">
                  <Award className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Rate</h4>
                <p className="text-blue-100 text-sm">
                  Community ratings build immutable trust scores
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};