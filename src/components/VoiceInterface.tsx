import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { elevenLabsService, ElevenLabsVoice, SpeechOptions } from '../lib/elevenlabs';

interface VoiceInterfaceProps {
  onTextReceived?: (text: string) => void;
  onSpeakText?: (text: string) => void;
  className?: string;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  onTextReceived,
  onSpeakText,
  className = ''
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [voiceSettings, setVoiceSettings] = useState<SpeechOptions>({
    stability: 0.5,
    similarityBoost: 0.5,
    style: 0.0,
    useSpeakerBoost: true
  });
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [serviceStatus, setServiceStatus] = useState<string>('');

  useEffect(() => {
    initializeVoiceService();
    initializeSpeechRecognition();
  }, []);

  const initializeVoiceService = async () => {
    setIsLoading(true);
    try {
      const availableVoices = await elevenLabsService.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].voice_id);
      }
      setServiceStatus(elevenLabsService.getStatus());
    } catch (error) {
      console.error('Error initializing voice service:', error);
      setServiceStatus('Voice service unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (onTextReceived) {
          onTextReceived(transcript);
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const speakText = async (text: string) => {
    if (!text.trim()) return;

    setIsSpeaking(true);
    setIsLoading(true);

    try {
      await elevenLabsService.speakText(text, {
        voiceId: selectedVoice,
        ...voiceSettings
      });
      
      if (onSpeakText) {
        onSpeakText(text);
      }
    } catch (error) {
      console.error('Error speaking text:', error);
    } finally {
      setIsSpeaking(false);
      setIsLoading(false);
    }
  };

  const testVoice = async () => {
    await speakText("Hello! This is a test of the ElevenLabs voice synthesis. How does this sound?");
  };

  return (
    <div className={`voice-interface ${className}`}>
      <div className="flex items-center space-x-4">
        {/* Voice Input Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isListening ? stopListening : startListening}
          disabled={!recognition}
          className={`p-4 rounded-full transition-all duration-300 ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } ${!recognition ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </motion.button>

        {/* Voice Output Status */}
        <div className="flex items-center space-x-2">
          {isSpeaking ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="p-3 bg-green-500 text-white rounded-full"
            >
              <Volume2 className="h-5 w-5" />
            </motion.div>
          ) : (
            <button
              onClick={testVoice}
              disabled={isLoading}
              className="p-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors disabled:opacity-50"
              title="Test voice"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
          title="Voice settings"
        >
          <Settings className="h-5 w-5" />
        </button>

        {/* Status Indicator */}
        <div className="text-sm text-gray-600">
          {serviceStatus}
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-6 bg-white rounded-xl border border-gray-200 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Voice Settings</h3>
            
            {/* Voice Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {voices.map((voice) => (
                  <option key={voice.voice_id} value={voice.voice_id}>
                    {voice.name} ({voice.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Settings Sliders */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stability: {voiceSettings.stability}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceSettings.stability}
                  onChange={(e) => setVoiceSettings(prev => ({
                    ...prev,
                    stability: parseFloat(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Similarity: {voiceSettings.similarityBoost}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceSettings.similarityBoost}
                  onChange={(e) => setVoiceSettings(prev => ({
                    ...prev,
                    similarityBoost: parseFloat(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style: {voiceSettings.style}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceSettings.style}
                  onChange={(e) => setVoiceSettings(prev => ({
                    ...prev,
                    style: parseFloat(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={voiceSettings.useSpeakerBoost}
                    onChange={(e) => setVoiceSettings(prev => ({
                      ...prev,
                      useSpeakerBoost: e.target.checked
                    }))}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Speaker Boost</span>
                </label>
              </div>
            </div>

            {/* Test Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={testVoice}
                disabled={isLoading || isSpeaking}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isLoading || isSpeaking ? 'Testing...' : 'Test Voice'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceInterface;