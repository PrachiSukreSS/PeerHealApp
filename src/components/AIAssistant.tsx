import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Heart, Lightbulb, Shield, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helper } from '../types';

interface AIAssistantProps {
  onClose?: () => void;
  helper?: Helper;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onClose, helper }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai' as const,
      content: helper 
        ? `Hello! I'm ${helper.name}'s AI assistant. I'm here to provide immediate support while you wait to connect. How are you feeling today?`
        : "Hello! I'm here to provide immediate support and guidance. How are you feeling today?",
      timestamp: new Date(),
      type: 'text' as const
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickResponses = [
    "I'm feeling anxious",
    "I need career advice", 
    "I'm going through a difficult time",
    "I need help with relationships",
    "I want to try voice chat",
    "Can you speak to me?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    // Simulate AI response with ElevenLabs integration
    setTimeout(() => {
      const aiResponse = getAIResponse(message);
      const responseMessage = {
        id: messages.length + 2,
        sender: 'ai' as const,
        content: aiResponse,
        timestamp: new Date(),
        type: 'text' as const
      };
      
      setMessages(prev => [...prev, responseMessage]);
      setIsTyping(false);
      
      // Simulate ElevenLabs voice synthesis
      if (message.toLowerCase().includes('speak') || message.toLowerCase().includes('voice')) {
        handleTextToSpeech(aiResponse);
      }
    }, 1500);
  };

  const handleTextToSpeech = (text: string) => {
    setIsSpeaking(true);
    // Simulate ElevenLabs API call
    console.log('ElevenLabs TTS:', text);
    
    // Use Web Speech API as fallback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate voice processing
      setTimeout(() => {
        handleSendMessage("I just used voice input to share my feelings");
      }, 1000);
    } else {
      setIsRecording(true);
      // Simulate recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
      }, 3000);
    }
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('voice') || lowerMessage.includes('speak')) {
      return "I'd love to speak with you! I'm using ElevenLabs AI voice technology to provide natural, empathetic voice responses. This can make our conversation feel more personal and supportive. How would you like to continue our conversation?";
    }
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      return "I understand you're feeling anxious. That's a very common experience, and you're not alone. Let's try a quick grounding exercise: Can you name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste? This can help bring you back to the present moment.";
    }
    
    if (lowerMessage.includes('career') || lowerMessage.includes('job')) {
      return "Career challenges can feel overwhelming, but every step forward is progress. What specific aspect of your career situation would you like to explore? I can help you break it down into manageable steps, or I can connect you with one of our career specialists who has walked a similar path.";
    }
    
    if (lowerMessage.includes('difficult') || lowerMessage.includes('hard')) {
      return "I hear that you're going through something difficult right now. It takes courage to reach out for support, and I'm proud of you for taking this step. Remember that difficult times don't last, but resilient people like you do. Would you like to talk about what's making things challenging, or would you prefer some coping strategies?";
    }
    
    if (lowerMessage.includes('relationship')) {
      return "Relationships can be complex and emotionally challenging. Whether it's family, romantic, or friendships, healthy communication is often key. What aspect of your relationships would you like to explore? I'm here to listen without judgment and help you navigate these important connections.";
    }
    
    return "Thank you for sharing that with me. I want you to know that your feelings are valid, and it's completely normal to seek support. Every person's journey is unique, and there's no shame in asking for help. Would you like to explore this topic more deeply, or would you prefer to connect with one of our peer helpers who might have similar experiences?";
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
        className={`bg-white rounded-3xl shadow-2xl ${onClose ? 'w-full max-w-4xl h-5/6' : 'max-w-4xl mx-auto h-[700px]'} flex flex-col overflow-hidden`}
      >
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Bot className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">
                {helper ? `${helper.name}'s AI Assistant` : 'AI Support Assistant'}
              </h3>
              <p className="text-purple-100 flex items-center space-x-2">
                <span>Powered by advanced AI • ElevenLabs Voice</span>
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
            {messages.map((message) => (
              <motion.div 
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
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
              placeholder={isRecording ? "Recording..." : "Type your message..."}
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
              <span>ElevenLabs AI voice</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bot className="h-3 w-3" />
              <span>Advanced AI support</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};