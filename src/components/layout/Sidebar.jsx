import React, { useEffect } from 'react';
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

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

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
            name: 'Departments',
            path: '/admin/departments',
            icon: <FiGrid className="h-5 w-5" />
          },
          // {
          //   name: 'Users',
          //   path: '/admin/users',
          //   icon: <FiUsers className="h-5 w-5" />
          // },
          {
            name: 'Teachers',
            path: '/admin/teachers',
            icon: <FiUser className="h-5 w-5" />
          },
          {
            name: 'Batches',
            path: '/admin/batches',
            icon: <FiUsers className="h-5 w-5" />
          },
          {
            name: 'Semesters',
            path: '/admin/semesters',
            icon: <FiCalendar className="h-5 w-5" />
          },
          {
            name: 'Subjects',
            path: '/admin/subjects',
            icon: <FiBook className="h-5 w-5" />
          },

          {
            name: 'Students',
            path: '/admin/students',
            icon: <FiUser className="h-5 w-5" />
          },

          {
            name: 'Timetable Settings',
            path: '/admin/timetable-settings',
            icon: <FiSettings className="h-5 w-5" />
          },
          {
            name: 'Manage Weekdays',
            path: '/admin/weekdays',
            icon: <FiCalendar className="h-5 w-5" />
          },
          {
            name: 'Manage Time Slots',
            path: '/admin/timeslots',
            icon: <FiClock className="h-5 w-5" />
          },
          {
            name: 'Holiday Management',
            path: '/admin/holidays',
            icon: <FiSun className="h-5 w-5" />
          },
          {
            name: 'Timetables',
            path: '/admin/timetables',
            icon: <FiClock className="h-5 w-5" />
          },
          {
            name: 'Timetables With Holidays',
            path: '/admin/timetable-with-holidays',
            icon: <FiClock className="h-5 w-5" />
          },
          {
            name: 'Attendance Settings',
            path: '/admin/attendance-settings',
            icon: <FiSettings className="h-5 w-5" />
          },
          {
            name: 'Attendance Management',
            path: '/admin/attendance-management',
            icon: <FiClipboard className="h-5 w-5" />
          },
          { // Add new link
            name: 'Attendance Report',
            path: '/admin/attendance-report',
            icon: <FiBarChart2 className="h-5 w-5" />
          },
          {
            name: 'Teacher Attendance Management',
            path: '/admin/teacher-attendance-management',
            icon: <FiClipboard className="h-5 w-5" />
          },
          {
            name: 'Teacher Attendance Report',
            path: '/admin/teacher-attendance-report',
            icon: <FiBarChart2 className="h-5 w-5" />
          },

          {
            name: 'Exams',
            path: '/admin/exams',
            icon: <FiBook className="h-5 w-5" />
          },
          {
            name: 'Student Promotion',
            path: '/admin/student-promotion',
            icon: <FiUsers className="h-5 w-5" />
          },
          {
            name: 'Bulk Notifications',
            path: '/admin/bulk-emails',
            icon: <FiBell className="h-5 w-5" />
          },
          // {
          //   name: 'Exam Results',
          //   path: '/admin/exam-results',
          //   icon: <FiGift className="h-5 w-5" />
          // },
          // {
          //   name: 'Settings',
          //   path: '/admin/settings',
          //   icon: <FiSettings className="h-5 w-5" />
          // }
        ];
      case 'teacher':
        return [
          {
            name: 'Dashboard',
            path: '/teacher/dashboard',
            icon: <FiHome className="h-5 w-5" />
          },
          {
            name: 'My Schedule',
            path: '/teacher/schedule',
            icon: <FiCalendar className="h-5 w-5" />
          },
          {
            name: 'My Attendence',
            path: '/teacher/attendance-report',
            icon: <FiCheckSquare className="h-5 w-5" />
          },

          // {
          //   name: 'Mark Attendance',
          //   path: '/teacher/attendance',
          //   icon: <FiCheckSquare className="h-5 w-5" />
          // },
          {
            name: 'Timetables With Holidays',
            path: '/teacher/timetable',
            icon: <FiClock className="h-5 w-5" />
          },
          // {
          //   name: 'Exam Results',
          //   path: '/teacher/exam-results',
          //   icon: <FiGift className="h-5 w-5" />
          // },
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
            name: 'Governance',
            path: '/supplier/governance',
            icon: <FiBell className="h-5 w-5" />
          },
          {
            name: 'KPI',
            path: '/supplier/kpi',
            icon: <FiClock className="h-5 w-5" />
          },
          {
            name: 'Message',
            path: '/supplier/message',
            icon: <FiMessageSquare className="h-5 w-5" />
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
      case 'guardian':
        return [
          { to: '/guardian', label: 'Dashboard' },
          { to: '/guardian/attendance', label: 'Ward Attendance' },
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
                    <span className="ml-3">{item.name}</span>
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
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
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