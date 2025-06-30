import React from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  const footerLinks = {
    platform: [
      { label: 'How It Works', href: '#' },
      { label: 'Find Helpers', href: '#' },
      { label: 'Become a Helper', href: '#' },
      { label: 'AI Support', href: '#' },
      { label: 'Pricing', href: '#' }
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Crisis Resources', href: '#' },
      { label: 'Safety Guidelines', href: '#' },
      { label: 'Contact Support', href: '#' },
      { label: 'Community Guidelines', href: '#' }
    ],
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Our Mission', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Blog', href: '#' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Trust & Safety', href: '#' },
      { label: 'Accessibility', href: '#' },
      { label: 'Cookie Policy', href: '#' }
    ]
  };

  const socialLinks = [
    { Icon: Facebook, href: '#', label: 'Facebook' },
    { Icon: Twitter, href: '#', label: 'Twitter' },
    { Icon: Instagram, href: '#', label: 'Instagram' },
    { Icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">PeerHeal</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Connecting people with trusted peer support and AI-powered assistance for mental health, career, and life challenges.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@peerheal.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>1-800-PEER-HEAL</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Global Community</span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-300 hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-300 hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-300 hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-300 hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Crisis Resources Banner */}
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-8">
          <h4 className="font-semibold text-red-200 mb-2">Crisis Resources - Available 24/7</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-red-300">National Suicide Prevention Lifeline:</span>
              <div className="text-white font-mono">988</div>
            </div>
            <div>
              <span className="text-red-300">Crisis Text Line:</span>
              <div className="text-white font-mono">Text HOME to 741741</div>
            </div>
            <div>
              <span className="text-red-300">International:</span>
              <div className="text-white">befrienders.org</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-300 mb-4 md:mb-0">
            <p>&copy; 2025 PeerHeal. All rights reserved. Built with care for mental health support.</p>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                className="text-gray-300 hover:text-blue-400 transition-colors p-2 hover:bg-gray-800 rounded-lg"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};