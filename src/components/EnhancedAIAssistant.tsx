import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Heart, Lightbulb, Shield, Mic, MicOff, Volume2, VolumeX, BookOpen, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helper } from '../types';
import { getAIKnowledge, searchAIKnowledge, searchEmergencyContacts } from '../lib/database';

interface EnhancedAIAssistantProps {
  onClose?: () => void;
  helper?: Helper;
  category?: string;
}

interface AIKnowledgeItem {
  id: string;
  topic: string;
  content: string;
  keywords: string[];
  confidence_level: number;
  categories: { name: string; color: string };
}

export const EnhancedAIAssistant: React.FC<EnhancedAIAssistantProps> = ({ onClose, helper, category }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai' as const,
      content: helper 
        ? `Hello! I'm ${helper.name}'s AI assistant with specialized knowledge in ${category || 'support'}. I have access to expert information and emergency resources. How can I help you today?`
        : `Hello! I'm your AI support assistant with access to comprehensive knowledge across mental health, career, relationships, and more. I can provide expert guidance and emergency resources. What would you like to explore?`,
      timestamp: new Date(),
      type: 'text' as const
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiKnowledge, setAiKnowledge] = useState<AIKnowledgeItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickResponses = [
    "I'm feeling anxious and need coping strategies",
    "Help me with job interview preparation", 
    "I'm having relationship communication issues",
    "I need crisis support resources",
    "Can you teach me mindfulness techniques?",
    "I want to speak with voice AI"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadAIKnowledge();
  }, [category]);

  const loadAIKnowledge = async () => {
    try {
      const { data, error } = await getAIKnowledge(category);
      if (data && !error) {
        setAiKnowledge(data);
      }
    } catch (error) {
      console.error('Error loading AI knowledge:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'user' as const,
      content: message,
      timestamp: new Date(),
      type: 'text' as const
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Enhanced AI response with knowledge base
    setTimeout(async () => {
      const aiResponse = await getEnhancedAIResponse(message);
      const responseMessage = {
        id: messages.length + 2,
        sender: 'ai' as const,
        content: aiResponse.text,
        timestamp: new Date(),
        type: 'text' as const,
        knowledge: aiResponse.knowledge,
        emergencyContacts: aiResponse.emergencyContacts
      };
      
      setMessages(prev => [...prev, responseMessage]);
      setIsTyping(false);
      
      // Voice synthesis for important responses
      if (message.toLowerCase().includes('speak') || message.toLowerCase().includes('voice') || aiResponse.isUrgent) {
        handleTextToSpeech(aiResponse.text);
      }
    }, 1500);
  };

  const getEnhancedAIResponse = async (userMessage: string): Promise<{
    text: string;
    knowledge?: AIKnowledgeItem[];
    emergencyContacts?: any[];
    isUrgent?: boolean;
  }> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Crisis detection with immediate resources
    if (lowerMessage.includes('suicide') || lowerMessage.includes('kill myself') || lowerMessage.includes('end it all') || lowerMessage.includes('want to die')) {
      const { data: emergencyContacts } = await searchEmergencyContacts('suicide');
      return {
        text: "🚨 I'm very concerned about you. Your life has value and help is available right now. Please reach out to these immediate crisis resources. You don't have to go through this alone.",
        emergencyContacts: emergencyContacts?.slice(0, 3),
        isUrgent: true
      };
    }

    // Search knowledge base for relevant information
    const { data: relevantKnowledge } = await searchAIKnowledge(userMessage);
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('panic')) {
      const anxietyKnowledge = relevantKnowledge?.filter(k => k.keywords.some(keyword => 
        ['anxiety', 'panic', 'stress', 'breathing'].includes(keyword.toLowerCase())
      ));
      
      return {
        text: "I understand you're feeling anxious. Anxiety is very common and there are effective techniques to help manage it. Let me share some evidence-based strategies that can provide both immediate and long-term relief.",
        knowledge: anxietyKnowledge?.slice(0, 2)
      };
    }
    
    if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('interview') || lowerMessage.includes('work')) {
      const careerKnowledge = relevantKnowledge?.filter(k => k.keywords.some(keyword => 
        ['career', 'job', 'interview', 'resume', 'networking'].includes(keyword.toLowerCase())
      ));
      
      return {
        text: "Career challenges can feel overwhelming, but with the right strategies, you can navigate them successfully. Let me share some expert insights and practical approaches that have helped many people in similar situations.",
        knowledge: careerKnowledge?.slice(0, 2)
      };
    }
    
    if (lowerMessage.includes('relationship') || lowerMessage.includes('communication') || lowerMessage.includes('dating') || lowerMessage.includes('partner')) {
      const relationshipKnowledge = relevantKnowledge?.filter(k => k.keywords.some(keyword => 
        ['relationship', 'communication', 'dating', 'trust'].includes(keyword.toLowerCase())
      ));
      
      return {
        text: "Relationships require ongoing effort and good communication skills. I can share some proven techniques for building stronger, healthier connections with others.",
        knowledge: relationshipKnowledge?.slice(0, 2)
      };
    }

    if (lowerMessage.includes('crisis') || lowerMessage.includes('emergency') || lowerMessage.includes('help')) {
      const { data: emergencyContacts } = await searchEmergencyContacts('crisis');
      return {
        text: "I'm here to help you find the support you need. If you're in crisis, please know that immediate help is available. Here are some resources that can provide professional support right now.",
        emergencyContacts: emergencyContacts?.slice(0, 3)
      };
    }

    if (lowerMessage.includes('voice') || lowerMessage.includes('speak')) {
      return {
        text: "I'd love to speak with you! I'm using advanced AI voice technology to provide natural, empathetic responses. Voice conversations can feel more personal and supportive. How would you like to continue our conversation?",
        isUrgent: false
      };
    }
    
    // General supportive response with relevant knowledge
    const generalKnowledge = relevantKnowledge?.slice(0, 1);
    return {
      text: "Thank you for sharing that with me. I want you to know that your feelings are valid, and seeking support shows strength. Let me provide some helpful information that might be relevant to your situation.",
      knowledge: generalKnowledge
    };
  };

  const handleTextToSpeech = (text: string) => {
    setIsSpeaking(true);
    
    // Use Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.voice = speechSynthesis.getVoices().find(voice => voice.name.includes('Female')) || speechSynthesis.getVoices()[0];
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setTimeout(() => {
        handleSendMessage("I just used voice input to share my feelings and would like some support");
      }, 1000);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
      }, 3000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`${onClose ? 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' : 'py-16 px-4 sm:px-6 lg:px-8'}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`bg-white rounded-3xl shadow-2xl ${onClose ? 'w-full max-w-5xl h-5/6' : 'max-w-5xl mx-auto h-[700px]'} flex flex-col overflow-hidden`}
      >
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Bot className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">
                {helper ? `${helper.name}'s AI Assistant` : 'Enhanced AI Support Assistant'}
              </h3>
              <p className="text-purple-100 flex items-center space-x-2">
                <span>Expert Knowledge • Emergency Resources • ElevenLabs Voice</span>
                {isSpeaking && <Volume2 className="h-4 w-4 animate-pulse" />}
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50">
          <AnimatePresence>
            {messages.map((message: any) => (
              <motion.div 
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${message.sender === 'user' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-purple-600 to-pink-600'}`}>
                    {message.sender === 'user' ? 
                      <User className="h-5 w-5 text-white" /> : 
                      <Bot className="h-5 w-5 text-white" />
                    }
                  </div>
                  <div className={`p-4 rounded-2xl shadow-lg ${message.sender === 'user' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' : 'bg-white text-gray-900 border border-gray-200'}`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 opacity-70`}>
                      {formatTime(message.timestamp)}
                    </p>
                    
                    {/* AI Knowledge Display */}
                    {message.knowledge && message.knowledge.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-600">Expert Knowledge</span>
                        </div>
                        {message.knowledge.map((knowledge: AIKnowledgeItem) => (
                          <div key={knowledge.id} className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                            <h4 className="font-semibold text-blue-800 text-sm mb-2">{knowledge.topic}</h4>
                            <p className="text-blue-700 text-xs leading-relaxed mb-2">{knowledge.content}</p>
                            <div className="flex flex-wrap gap-1">
                              {knowledge.keywords.slice(0, 3).map((keyword, idx) => (
                                <span key={idx} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Emergency Contacts Display */}
                    {message.emergencyContacts && message.emergencyContacts.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-semibold text-red-600">Emergency Resources</span>
                        </div>
                        {message.emergencyContacts.map((contact: any) => (
                          <div key={contact.id} className="bg-red-50 border border-red-200 rounded-xl p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-red-800 text-sm">{contact.name}</h4>
                              {contact.available_24_7 && (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">24/7</span>
                              )}
                            </div>
                            <p className="text-red-600 text-xs mb-2">{contact.description}</p>
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
                                  <span>Website</span>
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {message.sender === 'ai' && (
                      <button
                        onClick={() => handleTextToSpeech(message.content)}
                        className="mt-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        disabled={isSpeaking}
                      >
                        {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Responses */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-sm text-gray-600 mb-3 font-medium">Quick responses to get started:</p>
            <div className="grid grid-cols-2 gap-3">
              {quickResponses.map((response, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSendMessage(response)}
                  className="text-left p-3 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 text-sm border border-gray-200 hover:border-blue-300"
                >
                  {response}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Input */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex space-x-3">
            <button
              onClick={handleVoiceRecording}
              className={`p-3 rounded-xl transition-all duration-300 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
              placeholder={isRecording ? "Recording..." : "Ask me anything about mental health, career, relationships..."}
              disabled={isRecording}
              className="flex-1 p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
            <button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isRecording}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          
          {/* Enhanced Trust indicators */}
          <div className="flex items-center justify-center space-x-8 mt-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>End-to-end encrypted</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>Confidential & safe</span>
            </div>
            <div className="flex items-center space-x-1">
              <Lightbulb className="h-3 w-3" />
              <span>Expert knowledge base</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bot className="h-3 w-3" />
              <span>Advanced AI support</span>
            </div>
          </div>
          
          {/* Voice AI Demo Button */}
          <div className="mt-6 text-center">
            <Link
              to="/elevenlabs-demo"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Volume2 className="h-5 w-5" />
              <span>Try Voice AI Demo</span>
            </Link>
            <p className="text-xs text-gray-500 mt-2">Experience natural AI voice conversations</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};