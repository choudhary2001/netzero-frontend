import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers,
  FiUser,
  FiHome,
  FiBook,
  FiCalendar,
  FiGrid,
  FiLogOut,
  FiSettings,
  FiBell,
  FiClock,
  FiClipboard,
  FiSun,
  FiGift,
  FiCheckSquare,
  FiBarChart2,
  FiMessageSquare,
  FiUmbrella
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { logout as logoutAction } from '../../store/authSlice';
import authService from '../../services/authService';
import api from '../../services/api';
import socketService from '../../services/socketService';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Initial fetch of unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/chat/unread');
      if (response.data && response.data.totalUnread !== undefined) {
        console.log('Fetched unread count:', response.data.totalUnread);
        setUnreadCount(response.data.totalUnread);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Set up socket connection and unread count handling
  useEffect(() => {
    socketService.connect();
    // Fetch initially
    fetchUnreadCount();

    // Set up socket event handlers for unread counts
    const unsubscribeMessage = socketService.onMessage(async (message) => {
      console.log('Message received in sidebar:', message);
      // Update unread count based on the message
      if (message.unreadCount !== undefined) {
        console.log('Updating unread count from message:', message.unreadCount);
        setUnreadCount(message.unreadCount);
      } else {
        // If unread count not in message, fetch it
        fetchUnreadCount();
      }
    });

    const unsubscribeConversationUpdate = socketService.onConversationUpdate(async (data) => {
      console.log('Conversation update in sidebar:', data);
      // Update unread count based on the conversation update
      if (data.conversation && data.conversation.unreadCount !== undefined) {
        const totalUnread = data.conversation.unreadCount[user?.role] || 0;
        console.log('Updating unread count from conversation:', totalUnread);
        setUnreadCount(totalUnread);
      } else {
        // If unread count not in update, fetch it
        fetchUnreadCount();
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribeMessage();
      unsubscribeConversationUpdate();
      socketService.disconnect();
    };
  }, [user?.role]);

  // Fetch unread message count
  useEffect(() => {
    // Fetch initially
    fetchUnreadCount();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchUnreadCount, 1000);

    return () => clearInterval(interval);
  }, []);


  // Close sidebar on route change for mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location.pathname, setIsOpen]);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Improved logout handler
  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutAction());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      dispatch(logoutAction());
      navigate('/login');
    }
  };

  const handleProfile = async () => {
    try {
      navigate('/profile');
    } catch (error) {
      navigate('/profile');
    }
  };


  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          {
            name: 'Dashboard',
            path: '/admin/dashboard',
            icon: <FiHome className="h-5 w-5" />
          },
          {
            name: 'User Management',
            path: '/admin/user-management',
            icon: <FiGrid className="h-5 w-5" />
          },

          {
            name: 'Company Info',
            path: '/admin/company-info',
            icon: <FiUser className="h-5 w-5" />
          },
          {
            name: 'Chat',
            path: '/admin/chat',
            icon: <FiMessageSquare className="h-5 w-5" />,
            badge: unreadCount > 0 ? unreadCount : null
          },
          {
            name: 'Contact Management',
            path: '/admin/contact-management',
            icon: <FiMessageSquare className="h-5 w-5" />,
          },

        ];
      case 'company':
        return [

          {
            name: 'Dashboard',
            path: '/company/dashboard',
            icon: <FiHome className="h-5 w-5" />
          },
          {
            name: 'Company Info',
            path: '/supplier/company-info',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            )
          },
          {
            name: 'Environment',
            path: '/supplier/environment',
            icon: <FiUmbrella className="h-5 w-5" />
          },
          {
            name: 'Social',
            path: '/supplier/social',
            icon: <FiUsers className="h-5 w-5" />
          },
          {
            name: 'Governance',
            path: '/supplier/governance',
            icon: <FiBell className="h-5 w-5" />
          },
          {
            name: 'Carbon Emission',
            path: '/supplier/carbon-emission',
            icon: <FiClock className="h-5 w-5" />
          },
          {
            name: 'Message',
            path: '/supplier/chat',
            icon: <FiMessageSquare className="h-5 w-5" />,
            badge: unreadCount > 0 ? unreadCount : null
          },
          {
            name: 'Help & Support',
            path: '/supplier/help-support',
            icon: <FiGift className="h-5 w-5" />
          },
          {
            name: 'Account Settings',
            path: '/supplier/account-settings',
            icon: <FiSettings className="h-5 w-5" />
          },

        ];

      case 'supplier':
        return [

          {
            name: 'Dashboard',
            path: '/supplier/dashboard',
            icon: <FiHome className="h-5 w-5" />
          },
          {
            name: 'Company Info',
            path: '/supplier/company-info',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            )
          },
          {
            name: 'Environment',
            path: '/supplier/environment',
            icon: <FiUmbrella className="h-5 w-5" />
          },
          {
            name: 'Social',
            path: '/supplier/social',
            icon: <FiUsers className="h-5 w-5" />
          },
          {
            name: 'Quality',
            path: '/supplier/quality',
            icon: <FiCheckSquare className="h-5 w-5" />
          },
          {
            name: 'Governance',
            path: '/supplier/governance',
            icon: <FiBell className="h-5 w-5" />
          },
          {
            name: 'Carbon Emission',
            path: '/supplier/carbon-emission',
            icon: <FiClock className="h-5 w-5" />
          },
          {
            name: 'Message',
            path: '/supplier/chat',
            icon: <FiMessageSquare className="h-5 w-5" />,
            badge: unreadCount > 0 ? unreadCount : null
          },
          {
            name: 'Help & Support',
            path: '/supplier/help-support',
            icon: <FiGift className="h-5 w-5" />
          },
          {
            name: 'Account Settings',
            path: '/supplier/account-settings',
            icon: <FiSettings className="h-5 w-5" />
          },

        ];

      default:
        return [];
    }
  };

  const navItems = getMenuItems();

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white transform border-r border-gray-200
        transition-transform duration-300 ease-in-out lg:translate-x-0 
        lg:static lg:inset-0 flex flex-col h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar content wrapper - full height with flex column */}
        <div className="flex flex-col h-full">
          {/* Logo section - visible only on mobile */}
          <div className="lg:hidden flex items-center justify-between px-4 h-16 bg-green-600">
            <span className="text-xl font-bold text-white">AMS</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation - scrollable */}
          <div className="flex-1 overflow-y-auto">
            <nav className="px-4 py-6">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-lg 
                      transition-colors duration-150 hover:bg-green-50 hover:text-green-600
                      ${isActive(item.path) ? 'bg-green-50 text-green-600' : 'text-gray-600'}
                    `}
                  >
                    {item.icon}
                    <span className="ml-3 flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="ml-2 bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* User Info and Footer - fixed at bottom */}
          <div className="mt-auto border-t border-gray-200 p-4">
            {/* User Info */}
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 cursor-pointer" onClick={handleProfile}>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FiUser className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-3 flex-1 cursor-pointer" onClick={handleProfile}>
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'supplier' ? 'Value Chain Partner' : user?.role === 'company' ? 'Company' : user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg"
                title="Logout"
              >
                <FiLogOut className="h-5 w-5" />
              </button>
            </div>

            {/* Company Footer */}

          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 