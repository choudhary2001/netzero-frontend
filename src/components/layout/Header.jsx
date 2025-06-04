import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Refs for dropdown menus
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getNavLinks = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard' },
          { to: '/admin/users', label: 'Users' },
          { to: '/admin/departments', label: 'Departments' },
          { to: '/admin/classes', label: 'Classes' },
        ];
      case 'teacher':
        return [
          { to: '/teacher', label: 'Dashboard' },
          { to: '/teacher/attendance', label: 'Mark Attendance' },
          { to: '/teacher/schedule', label: 'Schedule' },
        ];
      case 'student':
        return [
          { to: '/student', label: 'Dashboard' },
          { to: '/student/attendance', label: 'View Attendance' },
          { to: '/student/schedule', label: 'Schedule' },
        ];
      case 'guardian':
        return [
          { to: '/guardian', label: 'Dashboard' },
          { to: '/guardian/attendance', label: 'Ward Attendance' },
        ];
      default:
        return [];
    }
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container-fluid mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 
                       hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 
                       focus:ring-inset focus:ring-green-500 lg:hidden"
            >
              <span className="sr-only">Open menu</span>
              <FiMenu className="block h-6 w-6" />
            </button>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <Link to="/" className="flex items-center">
                <div className="bg-green-600 text-white p-2 rounded-lg mr-2 flex items-center">
                  <FaLeaf className={`text-2xl mr-2 text-white`} />
                  <span className="font-bold">NETZERO</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            {/* Search - Hidden on mobile */}
            <div className="hidden md:block relative hidden">
              <input
                type="text"
                placeholder="Search..."
                className="w-48 lg:w-64 pl-10 pr-4 py-2 text-sm rounded-lg border 
                                     border-gray-300 focus:outline-none focus:ring-2 
                                     focus:ring-green-500 focus:border-transparent hidden"
              />
              <div className="absolute left-3 top-2.5 text-gray-400 hidden">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative hidden" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 rounded-full text-gray-600 hover:text-gray-900 
                                         hover:bg-gray-100 focus:outline-none focus:ring-2 
                                         focus:ring-offset-2 focus:ring-green-500"
              >
                <span className="sr-only">View notifications</span>
                <div className="relative">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full 
                                                   bg-red-500 ring-2 ring-white"></span>
                </div>
              </button>

              {/* Notifications dropdown */}
              {isNotificationOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md 
                                              shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    {/* Notification items */}
                    <div className="max-h-96 overflow-y-auto">
                      {[1, 2, 3].map((item) => (
                        <a
                          key={item}
                          href="#"
                          className="block px-4 py-3 hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-green-500 
                                                                          flex items-center justify-center">
                                <svg className="h-4 w-4 text-white"
                                  fill="none" viewBox="0 0 24 24"
                                  stroke="currentColor">
                                  <path strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                New attendance marked
                              </p>
                              <p className="text-sm text-gray-500">
                                2 minutes ago
                              </p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="h-9 w-9 rounded-full bg-green-600 flex items-center 
                                              justify-center ring-2 ring-white">
                  <span className="text-sm font-medium text-white">
                    {user?.email?.[0]?.toUpperCase() ||
                      user?.username?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.first_name || user?.username}
                </span>
              </button>

              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md 
                                              shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="group flex items-center px-4 py-2 text-sm 
                                                     text-gray-700 hover:bg-gray-100"
                    >
                      <svg className="mr-3 h-5 w-5 text-gray-400 
                                                          group-hover:text-gray-500"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 
                                                         7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="group flex w-full items-center px-4 py-2 text-sm 
                                                     text-gray-700 hover:bg-gray-100"
                    >
                      <svg className="mr-3 h-5 w-5 text-gray-400 
                                                          group-hover:text-gray-500"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 
                                                         3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 