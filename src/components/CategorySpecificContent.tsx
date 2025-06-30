import React, { useState, useEffect } from 'react';
import { Brain, Briefcase, Heart, Home, GraduationCap, Users, Lightbulb, Phone, ExternalLink, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { getEmergencyContacts } from '../lib/database';

interface CategorySpecificContentProps {
  category: string;
  onClose?: () => void;
}

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

interface AIKnowledge {
  topic: string;
  content: string;
  keywords: string[];
}

export const CategorySpecificContent: React.FC<CategorySpecificContentProps> = ({ category, onClose }) => {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryData();
  }, [category]);

  const loadCategoryData = async () => {
    setLoading(true);
    try {
      // Load emergency contacts for this category
      const { data: contacts } = await getEmergencyContacts();
      if (contacts) {
        // Filter contacts relevant to this category
        const relevantContacts = contacts.filter(contact => 
          contact.category === getCategoryEmergencyType(category) || 
          contact.category === 'general' ||
          contact.category === 'crisis'
        );
        setEmergencyContacts(relevantContacts);
      }
    } catch (error) {
      console.error('Error loading category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryEmergencyType = (cat: string): string => {
    const mapping: Record<string, string> = {
      'mental-health': 'mental_health',
      'relationships': 'domestic_violence',
      'career': 'general',
      'life-transitions': 'crisis',
      'education': 'general',
      'community': 'general'
    };
    return mapping[cat] || 'general';
  };

  const getCategoryInfo = (cat: string) => {
    const categoryData: Record<string, any> = {
      'mental-health': {
        icon: Brain,
        title: 'Mental Health Support',
        color: 'blue',
        aiKnowledge: [
          {
            topic: 'Anxiety Management',
            content: 'Anxiety is a normal stress response, but when it becomes overwhelming, there are effective techniques to manage it. Deep breathing exercises, grounding techniques (5-4-3-2-1 method), and progressive muscle relaxation can provide immediate relief.',
            keywords: ['anxiety', 'panic', 'stress', 'breathing', 'grounding']
          },
          {
            topic: 'Depression Support',
            content: 'Depression affects millions and is highly treatable. Key strategies include maintaining routine, staying connected with others, engaging in physical activity, and practicing self-compassion.',
            keywords: ['depression', 'sadness', 'hopelessness', 'therapy']
          },
          {
            topic: 'Mindfulness Techniques',
            content: 'Mindfulness involves paying attention to the present moment without judgment. Start with 5-10 minutes daily of focused breathing, body scans, or mindful walking.',
            keywords: ['mindfulness', 'meditation', 'present moment']
          }
        ],
        quickTips: [
          '🧘‍♀️ Practice 5-minute daily meditation',
          '🚶‍♂️ Take regular walks in nature',
          '📱 Limit social media before bed',
          '💤 Maintain consistent sleep schedule',
          '🤝 Stay connected with supportive people'
        ]
      },
      'career': {
        icon: Briefcase,
        title: 'Career Development',
        color: 'green',
        aiKnowledge: [
          {
            topic: 'Job Search Strategy',
            content: 'Effective job searching involves multiple channels: networking (70% of jobs are never posted), online applications, recruitment agencies, and direct company outreach. Tailor your resume for each application.',
            keywords: ['job search', 'networking', 'resume', 'interview']
          },
          {
            topic: 'Career Transition',
            content: 'Career changes are increasingly common. Start by assessing your transferable skills, researching target industries, and building relevant experience through volunteering or side projects.',
            keywords: ['career change', 'transition', 'transferable skills']
          },
          {
            topic: 'Salary Negotiation',
            content: 'Research market rates using sites like Glassdoor and PayScale. Practice your pitch, focus on value you bring, and be prepared to negotiate beyond salary.',
            keywords: ['salary', 'negotiation', 'compensation', 'benefits']
          }
        ],
        quickTips: [
          '🔗 Network actively - 70% of jobs aren\'t posted',
          '📄 Tailor your resume for each application',
          '🎯 Use the STAR method for interviews',
          '💰 Research salary ranges before negotiating',
          '📚 Keep learning new skills continuously'
        ]
      },
      'relationships': {
        icon: Heart,
        title: 'Relationship Support',
        color: 'pink',
        aiKnowledge: [
          {
            topic: 'Communication Skills',
            content: 'Effective communication involves active listening, using "I" statements, and avoiding blame language. Practice empathy by trying to understand your partner\'s perspective.',
            keywords: ['communication', 'active listening', 'empathy']
          },
          {
            topic: 'Building Healthy Relationships',
            content: 'Healthy relationships require mutual respect, trust, and support. Maintain your individual identity while building together. Set healthy boundaries and express appreciation regularly.',
            keywords: ['healthy relationships', 'boundaries', 'trust', 'respect']
          },
          {
            topic: 'Dating Confidence',
            content: 'Building dating confidence starts with self-acceptance and clear communication of your values. Focus on genuine connections rather than trying to impress.',
            keywords: ['dating', 'confidence', 'self-acceptance', 'authenticity']
          }
        ],
        quickTips: [
          '👂 Practice active listening daily',
          '💬 Use "I" statements instead of "you" statements',
          '🚧 Set and respect healthy boundaries',
          '💝 Express appreciation regularly',
          '🤝 Maintain your individual interests'
        ]
      },
      'life-transitions': {
        icon: Home,
        title: 'Life Transitions',
        color: 'purple',
        aiKnowledge: [
          {
            topic: 'Managing Change',
            content: 'Life transitions, whether planned or unexpected, can be challenging. Accept that change is difficult, maintain routines where possible, and seek support from others who\'ve experienced similar transitions.',
            keywords: ['change', 'transition', 'adaptation', 'support']
          },
          {
            topic: 'Building Resilience',
            content: 'Resilience is the ability to bounce back from challenges. Develop coping strategies, maintain perspective, practice self-care, and remember that difficult times are temporary.',
            keywords: ['resilience', 'coping', 'adaptation', 'growth']
          }
        ],
        quickTips: [
          '📅 Maintain some familiar routines',
          '🎯 Set small, achievable goals',
          '🤝 Connect with others in similar situations',
          '📝 Journal about your experiences',
          '🌱 Focus on personal growth opportunities'
        ]
      },
      'education': {
        icon: GraduationCap,
        title: 'Educational Support',
        color: 'indigo',
        aiKnowledge: [
          {
            topic: 'Study Strategies',
            content: 'Effective studying involves active learning techniques like summarizing, teaching others, and spaced repetition. Create a dedicated study space and break large tasks into smaller chunks.',
            keywords: ['study', 'learning', 'memory', 'focus']
          },
          {
            topic: 'Test Anxiety',
            content: 'Test anxiety is common and manageable. Practice relaxation techniques, prepare thoroughly, get adequate sleep, and use positive self-talk. Remember that one test doesn\'t define you.',
            keywords: ['test anxiety', 'stress', 'preparation', 'confidence']
          }
        ],
        quickTips: [
          '📚 Use active learning techniques',
          '⏰ Practice spaced repetition',
          '🎯 Break large tasks into smaller ones',
          '😌 Practice relaxation before tests',
          '👥 Form study groups with peers'
        ]
      },
      'community': {
        icon: Users,
        title: 'Community & Social',
        color: 'teal',
        aiKnowledge: [
          {
            topic: 'Building Social Connections',
            content: 'Building meaningful social connections takes time and effort. Start with shared interests, be genuinely interested in others, and practice active listening. Quality matters more than quantity.',
            keywords: ['social connections', 'friendship', 'community', 'belonging']
          },
          {
            topic: 'Overcoming Social Anxiety',
            content: 'Social anxiety is common and treatable. Start with small social interactions, practice deep breathing, challenge negative thoughts, and gradually increase social exposure.',
            keywords: ['social anxiety', 'confidence', 'exposure', 'practice']
          }
        ],
        quickTips: [
          '🎯 Join groups based on your interests',
          '👂 Practice active listening skills',
          '🤝 Volunteer for causes you care about',
          '💬 Start with small social interactions',
          '🌟 Be genuinely interested in others'
        ]
      }
    };

    return categoryData[cat] || categoryData['mental-health'];
  };

  const categoryInfo = getCategoryInfo(category);
  const Icon = categoryInfo.icon;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl p-8 max-w-4xl w-full h-5/6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-5/6 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r from-${categoryInfo.color}-500 to-${categoryInfo.color}-600 text-white p-6 flex items-center justify-between`}>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{categoryInfo.title}</h2>
              <p className="text-blue-100">AI Knowledge • Emergency Resources • Expert Tips</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Knowledge Base */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
                <h3 className="text-2xl font-bold text-gray-900">AI Knowledge Base</h3>
              </div>
              
              <div className="space-y-6">
                {categoryInfo.aiKnowledge.map((knowledge: AIKnowledge, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200"
                  >
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{knowledge.topic}</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">{knowledge.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {knowledge.keywords.map((keyword, kidx) => (
                        <span
                          key={kidx}
                          className={`bg-${categoryInfo.color}-100 text-${categoryInfo.color}-700 px-3 py-1 rounded-full text-sm font-medium`}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Tips */}
              <div className="mt-8">
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="h-5 w-5 text-green-500" />
                  <h4 className="text-xl font-bold text-gray-900">Quick Tips</h4>
                </div>
                <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                  <ul className="space-y-3">
                    {categoryInfo.quickTips.map((tip: string, index: number) => (
                      <li key={index} className="text-gray-700 font-medium">{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Emergency Resources */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Phone className="h-6 w-6 text-red-500" />
                <h3 className="text-xl font-bold text-gray-900">Emergency Resources</h3>
              </div>
              
              <div className="space-y-4">
                {emergencyContacts.slice(0, 6).map((contact) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-red-800 text-sm">{contact.name}</h4>
                      {contact.available_24_7 && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">24/7</span>
                      )}
                    </div>
                    <p className="text-red-600 text-xs mb-3">{contact.description}</p>
                    <div className="flex flex-col space-y-2">
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex items-center space-x-2 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
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
                          className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Website</span>
                        </a>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {contact.country} • {contact.languages.join(', ')}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Crisis Warning */}
              <div className="mt-6 bg-red-100 border-2 border-red-300 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="h-5 w-5 text-red-600" />
                  <h4 className="font-bold text-red-800">Crisis Support</h4>
                </div>
                <p className="text-red-700 text-sm mb-3">
                  If you're in immediate danger or having thoughts of self-harm, please contact emergency services or a crisis hotline immediately.
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:988"
                    className="block bg-red-600 text-white text-center py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
                  >
                    Call 988 - Suicide & Crisis Lifeline
                  </a>
                  <a
                    href="sms:741741"
                    className="block bg-blue-600 text-white text-center py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                  >
                    Text HOME to 741741
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};