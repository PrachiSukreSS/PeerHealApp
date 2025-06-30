import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  MessageCircle, 
  Calendar, 
  Star, 
  Shield, 
  Settings,
  Check,
  X,
  Clock,
  User,
  Heart,
  AlertTriangle
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'message' | 'session' | 'review' | 'system' | 'emergency';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'New message from Dr. Sarah Chen',
      message: 'Thank you for our session today. Here are some resources I mentioned...',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
      priority: 'medium'
    },
    {
      id: '2',
      type: 'session',
      title: 'Session reminder',
      message: 'Your session with Jennifer Rodriguez starts in 1 hour',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      priority: 'high'
    },
    {
      id: '3',
      type: 'review',
      title: 'Please review your session',
      message: 'How was your session with Marcus Williams? Your feedback helps our community.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      priority: 'low'
    },
    {
      id: '4',
      type: 'system',
      title: 'Profile verification complete',
      message: 'Your identity has been verified. You now have access to premium features.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true,
      priority: 'medium'
    },
    {
      id: '5',
      type: 'emergency',
      title: 'Crisis resources available',
      message: 'If you need immediate support, our crisis resources are available 24/7.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      read: true,
      priority: 'high'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'messages' | 'sessions'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return MessageCircle;
      case 'session':
        return Calendar;
      case 'review':
        return Star;
      case 'system':
        return Shield;
      case 'emergency':
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (type === 'emergency') return 'border-red-200 bg-red-50';
    if (priority === 'high') return 'border-orange-200 bg-orange-50';
    if (priority === 'medium') return 'border-blue-200 bg-blue-50';
    return 'border-gray-200 bg-gray-50';
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread':
        return !notif.read;
      case 'messages':
        return notif.type === 'message';
      case 'sessions':
        return notif.type === 'session';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
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
          <div className="flex items-center justify-center mb-4">
            <Bell className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 font-poppins">Notifications</h1>
            {unreadCount > 0 && (
              <span className="ml-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-gray-600">Stay updated with your support journey</p>
        </motion.div>

        {/* Filters and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="professional-card p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'all', label: 'All', count: notifications.length },
                { key: 'unread', label: 'Unread', count: unreadCount },
                { key: 'messages', label: 'Messages', count: notifications.filter(n => n.type === 'message').length },
                { key: 'sessions', label: 'Sessions', count: notifications.filter(n => n.type === 'session').length }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    filter === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up!</p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`professional-card p-6 border-l-4 ${
                    !notification.read ? 'border-l-blue-500' : 'border-l-gray-300'
                  } ${getNotificationColor(notification.type, notification.priority)}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${
                      notification.type === 'emergency' ? 'bg-red-100' :
                      notification.priority === 'high' ? 'bg-orange-100' :
                      notification.priority === 'medium' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        notification.type === 'emergency' ? 'text-red-600' :
                        notification.priority === 'high' ? 'text-orange-600' :
                        notification.priority === 'medium' ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          <p className={`mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>{formatTimestamp(notification.timestamp)}</span>
                            </div>
                            {!notification.read && (
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete notification"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 professional-card p-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="h-6 w-6 text-gray-600" />
            <h3 className="text-xl font-bold text-gray-900 font-poppins">Notification Preferences</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'New messages from helpers', enabled: true },
              { label: 'Session reminders', enabled: true },
              { label: 'Review requests', enabled: true },
              { label: 'System updates', enabled: false },
              { label: 'Marketing emails', enabled: false },
              { label: 'Emergency alerts', enabled: true }
            ].map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700">{setting.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={setting.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};