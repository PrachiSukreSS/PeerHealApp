// ElevenLabs API integration
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Default voice ID (Rachel - a pleasant female voice)
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
}

export interface SpeechOptions {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

class ElevenLabsService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = ELEVENLABS_API_KEY || '';
    this.baseUrl = ELEVENLABS_API_URL;
  }

  async getVoices(): Promise<ElevenLabsVoice[]> {
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not found, using fallback voices');
      return this.getFallbackVoices();
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      return this.getFallbackVoices();
    }
  }

  async synthesizeSpeech(
    text: string, 
    options: SpeechOptions = {}
  ): Promise<ArrayBuffer | null> {
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not found, using Web Speech API fallback');
      return this.fallbackTextToSpeech(text);
    }

    const voiceId = options.voiceId || DEFAULT_VOICE_ID;
    
    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: options.stability || 0.5,
            similarity_boost: options.similarityBoost || 0.5,
            style: options.style || 0.0,
            use_speaker_boost: options.useSpeakerBoost || true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error synthesizing speech with ElevenLabs:', error);
      return this.fallbackTextToSpeech(text);
    }
  }

  async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBufferDecoded = await audioContext.decodeAudioData(audioBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBufferDecoded;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  async speakText(text: string, options: SpeechOptions = {}): Promise<void> {
    try {
      const audioBuffer = await this.synthesizeSpeech(text, options);
      if (audioBuffer) {
        await this.playAudio(audioBuffer);
      }
    } catch (error) {
      console.error('Error in speakText:', error);
      // Fallback to Web Speech API
      this.fallbackTextToSpeech(text);
    }
  }

  private getFallbackVoices(): ElevenLabsVoice[] {
    return [
      {
        voice_id: 'web-speech-female',
        name: 'System Female Voice',
        category: 'generated',
        description: 'Browser built-in female voice'
      },
      {
        voice_id: 'web-speech-male',
        name: 'System Male Voice', 
        category: 'generated',
        description: 'Browser built-in male voice'
      }
    ];
  }

  private fallbackTextToSpeech(text: string): Promise<ArrayBuffer | null> {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        // Try to use a female voice if available
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('karen')
        );
        
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }

        utterance.onend = () => resolve(null);
        utterance.onerror = () => resolve(null);
        
        speechSynthesis.speak(utterance);
      } else {
        console.warn('Speech synthesis not supported');
        resolve(null);
      }
    });
  }

  isAvailable(): boolean {
    return !!this.apiKey || 'speechSynthesis' in window;
  }

  getStatus(): string {
    if (this.apiKey) {
      return 'ElevenLabs API Connected';
    } else if ('speechSynthesis' in window) {
      return 'Using Browser Speech API (Fallback)';
    } else {
      return 'Speech synthesis not available';
    }
  }
}

export const elevenLabsService = new ElevenLabsService();
export default elevenLabsService;