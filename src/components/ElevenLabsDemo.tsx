import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic, Settings, Play, Pause, Loader } from 'lucide-react';
import { VoiceInterface } from './VoiceInterface';
import { elevenLabsService } from '../lib/elevenlabs';

export const ElevenLabsDemo: React.FC = () => {
  const [inputText, setInputText] = useState('Hello! Welcome to PeerHeal. I\'m here to provide you with compassionate support using advanced AI voice technology. How can I help you today?');
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');

  const handleSpeak = async () => {
    if (!inputText.trim()) return;
    
    setIsPlaying(true);
    try {
      await elevenLabsService.speakText(inputText);
    } catch (error) {
      console.error('Error speaking text:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleVoiceInput = (text: string) => {
    setTranscribedText(text);
    setInputText(text);
  };

  const sampleTexts = [
    "I understand you're going through a difficult time. You're not alone, and it's okay to ask for help.",
    "Let's try a breathing exercise together. Breathe in slowly for 4 counts, hold for 4, then exhale for 4.",
    "Your feelings are valid, and seeking support shows incredible strength and self-awareness.",
    "Remember, healing isn't linear. Some days will be harder than others, and that's completely normal.",
    "I'm here to listen without judgment and provide you with the support you need."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl shadow-lg">
              <Volume2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-poppins">
            ElevenLabs AI Voice Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience natural, empathetic AI voice synthesis powered by ElevenLabs technology. 
            Perfect for compassionate support conversations.
          </p>
        </motion.div>

        {/* Voice Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Voice Controls</h2>
          <VoiceInterface 
            onTextReceived={handleVoiceInput}
            onSpeakText={(text) => console.log('Speaking:', text)}
            className="mb-6"
          />
          
          {transcribedText && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Voice Input Received:</h3>
              <p className="text-blue-700">{transcribedText}</p>
            </div>
          )}
        </motion.div>

        {/* Text Input and Playback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Text to Speech</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter text to speak:
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={4}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter the text you want to hear spoken..."
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleSpeak}
                disabled={isPlaying || !inputText.trim()}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlaying ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Speaking...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    <span>Speak Text</span>
                  </>
                )}
              </button>

              <div className="text-sm text-gray-500">
                {inputText.length} characters
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sample Texts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Sample Support Messages</h2>
          <p className="text-gray-600 mb-6">Try these compassionate support messages to hear how natural the AI voice sounds:</p>
          
          <div className="grid grid-cols-1 gap-4">
            {sampleTexts.map((text, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                onClick={() => setInputText(text)}
                className="text-left p-4 bg-gradient-to-r from-gray-50 to-purple-50 hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-300 border border-gray-200 hover:border-purple-300 group"
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Volume2 className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{text}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Volume2,
              title: 'Natural Voice',
              description: 'High-quality, human-like speech synthesis'
            },
            {
              icon: Settings,
              title: 'Customizable',
              description: 'Adjust voice settings for optimal experience'
            },
            {
              icon: Mic,
              title: 'Voice Input',
              description: 'Speak naturally and get instant transcription'
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                  <Icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default ElevenLabsDemo;