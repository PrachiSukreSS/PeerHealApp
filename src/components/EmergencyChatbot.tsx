import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Phone, ExternalLink, AlertTriangle, Heart, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEmergencyContacts } from '../lib/database';

interface EmergencyContact {
  id: string;
  name: string;
  description: string;
  phone?: string;
  website?: string;
  country: string;
  category: string;
  available_24_7: boolean;
  languages: string[];
}

export const EmergencyChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot' as const,
      content: "Hi! I'm here to help you find emergency support resources. What kind of help do you need?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickOptions = [
    { label: 'Suicide Prevention', category: 'suicide', icon: '🆘' },
    { label: 'Crisis Support', category: 'crisis', icon: '🚨' },
    { label: 'Mental Health', category: 'mental_health', icon: '🧠' },
    { label: 'Domestic Violence', category: 'domestic_violence', icon: '🛡️' },
    { label: 'Substance Abuse', category: 'substance_abuse', icon: '💊' },
    { label: 'General Help', category: 'general', icon: '❤️' }
  ];

  useEffect(() => {
    loadEmergencyContacts();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadEmergencyContacts = async () => {
    const { data, error } = await getEmergencyContacts();
    if (data && !error) {
      setEmergencyContacts(data);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'user' as const,
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const response = generateBotResponse(message);
      const botMessage = {
        id: messages.length + 2,
        sender: 'bot' as const,
        content: response.text,
        timestamp: new Date(),
        contacts: response.contacts
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickOption = (category: string) => {
    handleSendMessage(`I need help with ${category.replace('_', ' ')}`);
  };

  const generateBotResponse = (userMessage: string): { text: string; contacts?: EmergencyContact[] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Detect emergency keywords
    if (lowerMessage.includes('suicide') || lowerMessage.includes('kill myself') || lowerMessage.includes('end it all')) {
      const suicideContacts = emergencyContacts.filter(c => c.category === 'suicide');
      return {
        text: "🚨 I'm very concerned about you. Please reach out to these immediate resources. You matter, and help is available right now:",
        contacts: suicideContacts
      };
    }
    
    if (lowerMessage.includes('crisis') || lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      const crisisContacts = emergencyContacts.filter(c => c.category === 'crisis' || c.available_24_7);
      return {
        text: "I understand you're in crisis. Here are immediate support resources available 24/7:",
        contacts: crisisContacts
      };
    }
    
    if (lowerMessage.includes('domestic violence') || lowerMessage.includes('abuse') || lowerMessage.includes('unsafe')) {
      const dvContacts = emergencyContacts.filter(c => c.category === 'domestic_violence');
      return {
        text: "Your safety is the priority. Here are confidential resources for domestic violence support:",
        contacts: dvContacts
      };
    }
    
    if (lowerMessage.includes('substance') || lowerMessage.includes('addiction') || lowerMessage.includes('drugs') || lowerMessage.includes('alcohol')) {
      const substanceContacts = emergencyContacts.filter(c => c.category === 'substance_abuse');
      return {
        text: "Recovery is possible. Here are resources for substance abuse support:",
        contacts: substanceContacts
      };
    }
    
    if (lowerMessage.includes('mental health') || lowerMessage.includes('depression') || lowerMessage.includes('anxiety')) {
      const mentalHealthContacts = emergencyContacts.filter(c => c.category === 'mental_health');
      return {
        text: "Mental health support is important. Here are resources that can help:",
        contacts: mentalHealthContacts
      };
    }
    
    // General response
    return {
      text: "I'm here to help you find the right support. Can you tell me more about what kind of help you need? You can also use the quick options below.",
      contacts: []
    };
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-full shadow-2xl z-50 hover:shadow-3xl transition-all duration-300"
      >
        <MessageCircle className="h-6 w-6" />
        <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          !
        </div>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Emergency Support</h3>
                    <p className="text-red-100 text-sm">24/7 Crisis Resources</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50 to-red-50">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-2xl ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">{formatTime(message.timestamp)}</p>
                      
                      {/* Emergency Contacts */}
                      {message.contacts && message.contacts.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.contacts.map((contact) => (
                            <div key={contact.id} className="bg-red-50 border border-red-200 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-red-800 text-sm">{contact.name}</h4>
                                {contact.available_24_7 && (
                                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">24/7</span>
                                )}
                              </div>
                              <p className="text-xs text-red-600 mb-2">{contact.description}</p>
                              <div className="flex space-x-2">
                                {contact.phone && (
                                  <a
                                    href={`tel:${contact.phone}`}
                                    className="flex items-center space-x-1 bg-red-600 text-white px-2 py-1 rounded-lg text-xs hover:bg-red-700 transition-colors"
                                  >
                                    <Phone className="h-3 w-3" />
                                    <span>{contact.phone}</span>
                                  </a>
                                )}
                                {contact.website && (
                                  <a
                                    href={contact.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-1 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs hover:bg-blue-700 transition-colors"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    <span>Website</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Options */}
              {messages.length === 1 && (
                <div className="p-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3 font-medium">Quick help options:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickOptions.map((option) => (
                      <button
                        key={option.category}
                        onClick={() => handleQuickOption(option.category)}
                        className="text-left p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-sm border border-red-200"
                      >
                        <span className="mr-2">{option.icon}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                    placeholder="Describe what help you need..."
                    className="flex-1 p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleSendMessage(inputMessage)}
                    disabled={!inputMessage.trim()}
                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>Confidential support</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Crisis resources</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};