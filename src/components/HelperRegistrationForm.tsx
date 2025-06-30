import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Clock,
  Award,
  Upload,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Star,
  Globe,
  Calendar,
  FileText,
  Camera
} from 'lucide-react';

interface HelperRegistrationFormProps {
  onBack: () => void;
}

const helperSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  location: z.string().min(2, 'Please enter your location'),
  
  // Professional Information
  title: z.string().min(5, 'Professional title must be at least 5 characters'),
  bio: z.string().min(100, 'Bio must be at least 100 characters'),
  specialties: z.array(z.string()).min(1, 'Please select at least one specialty'),
  categories: z.array(z.string()).min(1, 'Please select at least one category'),
  experience: z.number().min(0, 'Experience cannot be negative').max(50, 'Experience cannot exceed 50 years'),
  
  // Certifications and Qualifications
  certifications: z.string().optional(),
  education: z.string().optional(),
  
  // Service Details
  hourlyRate: z.number().min(10, 'Minimum rate is $10/hour').max(500, 'Maximum rate is $500/hour'),
  availability: z.array(z.string()).min(1, 'Please select at least one availability slot'),
  languages: z.array(z.string()).min(1, 'Please select at least one language'),
  
  // Service Preferences
  videoEnabled: z.boolean(),
  voiceEnabled: z.boolean(),
  chatEnabled: z.boolean(),
  
  // Terms
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  agreeToBackground: z.boolean().refine(val => val === true, 'You must agree to background verification')
});

type HelperFormData = z.infer<typeof helperSchema>;

export const HelperRegistrationForm: React.FC<HelperRegistrationFormProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm<HelperFormData>({
    resolver: zodResolver(helperSchema),
    defaultValues: {
      specialties: [],
      categories: [],
      availability: [],
      languages: [],
      videoEnabled: true,
      voiceEnabled: true,
      chatEnabled: true
    }
  });

  const totalSteps = 5;

  const categories = [
    { id: 'mental-health', name: 'Mental Health', icon: '🧠' },
    { id: 'career', name: 'Career Development', icon: '💼' },
    { id: 'relationships', name: 'Relationships', icon: '❤️' },
    { id: 'life-transitions', name: 'Life Transitions', icon: '🏠' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'community', name: 'Community & Social', icon: '👥' }
  ];

  const specialties = {
    'mental-health': ['Anxiety', 'Depression', 'Trauma', 'PTSD', 'Grief', 'Stress Management', 'Mindfulness', 'Addiction Recovery'],
    'career': ['Job Search', 'Interview Prep', 'Career Change', 'Leadership', 'Networking', 'Salary Negotiation', 'Entrepreneurship', 'Work-Life Balance'],
    'relationships': ['Dating', 'Marriage', 'Family', 'Communication', 'Conflict Resolution', 'Divorce Support', 'Parenting', 'Social Skills'],
    'life-transitions': ['Moving', 'Retirement', 'Empty Nest', 'Divorce', 'Loss', 'New Parent', 'Career Change', 'Health Changes'],
    'education': ['Study Skills', 'Test Anxiety', 'Learning Disabilities', 'Academic Planning', 'College Prep', 'Adult Learning', 'Skill Development'],
    'community': ['Social Anxiety', 'Making Friends', 'Community Involvement', 'Volunteering', 'Cultural Adaptation', 'Loneliness', 'Social Skills']
  };

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese (Mandarin)',
    'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish', 'Norwegian', 'Other'
  ];

  const availabilitySlots = [
    'Monday Morning', 'Monday Afternoon', 'Monday Evening',
    'Tuesday Morning', 'Tuesday Afternoon', 'Tuesday Evening',
    'Wednesday Morning', 'Wednesday Afternoon', 'Wednesday Evening',
    'Thursday Morning', 'Thursday Afternoon', 'Thursday Evening',
    'Friday Morning', 'Friday Afternoon', 'Friday Evening',
    'Saturday Morning', 'Saturday Afternoon', 'Saturday Evening',
    'Sunday Morning', 'Sunday Afternoon', 'Sunday Evening'
  ];

  const selectedCategories = watch('categories') || [];
  const selectedSpecialties = watch('specialties') || [];
  const selectedLanguages = watch('languages') || [];
  const selectedAvailability = watch('availability') || [];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleArrayValue = (array: string[], value: string, fieldName: keyof HelperFormData) => {
    const newArray = array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
    setValue(fieldName, newArray);
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof HelperFormData)[] => {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone', 'location'];
      case 2:
        return ['title', 'bio', 'experience'];
      case 3:
        return ['categories', 'specialties'];
      case 4:
        return ['hourlyRate', 'availability', 'languages'];
      case 5:
        return ['agreeToTerms', 'agreeToBackground'];
      default:
        return [];
    }
  };

  const onSubmit = async (data: HelperFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Helper registration data:', data);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableSpecialties = () => {
    return selectedCategories.flatMap(category => 
      specialties[category as keyof typeof specialties] || []
    );
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-2xl"
        >
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 font-poppins">
            Application Submitted Successfully!
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Thank you for applying to become a PeerHeal helper. We'll review your application and 
            get back to you within 2-3 business days with next steps.
          </p>
          <div className="space-y-4 text-left bg-blue-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-blue-900">What happens next:</h3>
            <div className="space-y-2 text-blue-800">
              <p>✅ Application review (1-2 days)</p>
              <p>✅ Background verification (2-3 days)</p>
              <p>✅ Helper training program (1 week)</p>
              <p>✅ Profile activation and first bookings</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 font-poppins">Become a Helper</h1>
            <p className="text-gray-600">Step {currentStep} of {totalSteps}</p>
          </div>
          <div className="w-16"></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  i + 1 <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i + 1 <= currentStep ? <CheckCircle className="h-5 w-5" /> : i + 1}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
              >
                <div className="text-center mb-8">
                  <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 font-poppins">Personal Information</h2>
                  <p className="text-gray-600">Tell us about yourself</p>
                </div>

                {/* Profile Photo Upload */}
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <Upload className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">Upload a professional profile photo</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      {...register('firstName')}
                      className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      {...register('lastName')}
                      className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <input
                        {...register('email')}
                        type="email"
                        className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <input
                        {...register('phone')}
                        type="tel"
                        className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <input
                        {...register('location')}
                        className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.location ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="City, State/Province, Country"
                      />
                    </div>
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Professional Information */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
              >
                <div className="text-center mb-8">
                  <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 font-poppins">Professional Background</h2>
                  <p className="text-gray-600">Share your expertise and experience</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Title *
                    </label>
                    <input
                      {...register('title')}
                      className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Licensed Therapist, Career Coach, Life Coach"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience *
                    </label>
                    <input
                      {...register('experience', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      max="50"
                      className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.experience ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="5"
                    />
                    {errors.experience && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.experience.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Bio *
                    </label>
                    <textarea
                      {...register('bio')}
                      rows={6}
                      className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.bio ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Tell potential clients about your background, approach, and what makes you unique as a helper. Include your qualifications, experience, and what you're passionate about helping with."
                    />
                    {errors.bio && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.bio.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certifications & Qualifications
                    </label>
                    <textarea
                      {...register('certifications')}
                      rows={3}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="List your relevant certifications, licenses, degrees, or training programs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education Background
                    </label>
                    <textarea
                      {...register('education')}
                      rows={3}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Share your educational background relevant to your helping expertise"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Categories & Specialties */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
              >
                <div className="text-center mb-8">
                  <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 font-poppins">Areas of Expertise</h2>
                  <p className="text-gray-600">Select the categories and specialties you can help with</p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Service Categories * (Select all that apply)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => toggleArrayValue(selectedCategories, category.id, 'categories')}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                            selectedCategories.includes(category.id)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{category.icon}</span>
                            <span className="font-semibold">{category.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.categories && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.categories.message}
                      </p>
                    )}
                  </div>

                  {selectedCategories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Specific Specialties * (Select all that apply)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {getAvailableSpecialties().map((specialty) => (
                          <button
                            key={specialty}
                            type="button"
                            onClick={() => toggleArrayValue(selectedSpecialties, specialty, 'specialties')}
                            className={`p-3 rounded-lg border text-sm transition-all duration-300 ${
                              selectedSpecialties.includes(specialty)
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            {specialty}
                          </button>
                        ))}
                      </div>
                      {errors.specialties && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.specialties.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4: Service Details */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
              >
                <div className="text-center mb-8">
                  <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 font-poppins">Service Details</h2>
                  <p className="text-gray-600">Set your rates, availability, and preferences</p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate (USD) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <input
                        {...register('hourlyRate', { valueAsNumber: true })}
                        type="number"
                        min="10"
                        max="500"
                        className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.hourlyRate ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="75"
                      />
                    </div>
                    {errors.hourlyRate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.hourlyRate.message}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Recommended range: $30-150/hour based on experience and specialization
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Languages * (Select all you're fluent in)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {languages.map((language) => (
                        <button
                          key={language}
                          type="button"
                          onClick={() => toggleArrayValue(selectedLanguages, language, 'languages')}
                          className={`p-3 rounded-lg border text-sm transition-all duration-300 ${
                            selectedLanguages.includes(language)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                    {errors.languages && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.languages.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Availability * (Select your preferred time slots)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {availabilitySlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => toggleArrayValue(selectedAvailability, slot, 'availability')}
                          className={`p-3 rounded-lg border text-sm transition-all duration-300 ${
                            selectedAvailability.includes(slot)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    {errors.availability && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.availability.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Service Preferences
                    </label>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          {...register('chatEnabled')}
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span>Text/Chat Sessions</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          {...register('voiceEnabled')}
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span>Voice Calls</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          {...register('videoEnabled')}
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span>Video Calls</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Terms & Verification */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
              >
                <div className="text-center mb-8">
                  <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 font-poppins">Terms & Verification</h2>
                  <p className="text-gray-600">Final step to complete your application</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <h3 className="font-bold text-blue-900 mb-4">Application Review Process</h3>
                    <div className="space-y-3 text-blue-800">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <span>Application review (1-2 business days)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <span>Background verification (2-3 business days)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <span>Helper training program (1 week, online)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <span>Profile activation and first bookings</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start space-x-3">
                      <input
                        {...register('agreeToTerms')}
                        type="checkbox"
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-1"
                      />
                      <span className="text-gray-700">
                        I agree to the{' '}
                        <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>,{' '}
                        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>, and{' '}
                        <a href="#" className="text-blue-600 hover:underline">Helper Guidelines</a>
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.agreeToTerms.message}
                      </p>
                    )}

                    <label className="flex items-start space-x-3">
                      <input
                        {...register('agreeToBackground')}
                        type="checkbox"
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-1"
                      />
                      <span className="text-gray-700">
                        I consent to background verification checks as required for helper approval. 
                        This may include identity verification, professional credential checks, and reference verification.
                      </span>
                    </label>
                    {errors.agreeToBackground && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.agreeToBackground.message}
                      </p>
                    )}
                  </div>

                  <div className="bg-green-50 rounded-2xl p-6">
                    <h3 className="font-bold text-green-900 mb-2">Ready to Submit?</h3>
                    <p className="text-green-800 text-sm">
                      Once you submit your application, you'll receive a confirmation email with next steps. 
                      Our team will review your application and get back to you within 2-3 business days.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                <span>Next</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <CheckCircle className="h-5 w-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};