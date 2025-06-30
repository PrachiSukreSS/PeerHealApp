import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Camera,
  Shield,
  Star,
  Clock,
  Heart,
  Award,
  Settings
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    timezone: 'UTC',
    avatar: null as string | null
  });

  const [stats] = useState({
    totalSessions: 12,
    helpersConnected: 8,
    hoursOfSupport: 24.5,
    trustScore: 4.9,
    memberSince: 'January 2024'
  });

  const handleSave = () => {
    // Save profile data
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, avatar: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-poppins">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="professional-card p-8 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mx-auto overflow-hidden">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-16 w-16 text-white" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-gray-600 mb-4">{profileData.email}</p>
              
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-semibold">Verified Member</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Trust Score</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{stats.trustScore}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">{stats.memberSince}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="professional-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 font-poppins">Profile Information</h3>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    isEditing 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl">{profileData.firstName}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl">{profileData.lastName}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-600">
                    {profileData.email}
                    <span className="text-xs text-gray-500 block">Email cannot be changed</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl">{profileData.phone || 'Not provided'}</div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, State, Country"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl">{profileData.location || 'Not provided'}</div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl min-h-[100px]">
                      {profileData.bio || 'No bio provided'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="professional-card p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Your Journey</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-2xl w-fit mx-auto mb-3">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1 font-poppins">{stats.totalSessions}</div>
                <div className="text-gray-600 text-sm">Sessions Completed</div>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-2xl w-fit mx-auto mb-3">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1 font-poppins">{stats.hoursOfSupport}</div>
                <div className="text-gray-600 text-sm">Hours of Support</div>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-3">
                  <User className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1 font-poppins">{stats.helpersConnected}</div>
                <div className="text-gray-600 text-sm">Helpers Connected</div>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-100 p-4 rounded-2xl w-fit mx-auto mb-3">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1 font-poppins">{stats.trustScore}</div>
                <div className="text-gray-600 text-sm">Trust Score</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};