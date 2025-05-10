import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    FiUser, FiMail, FiPhone, FiBook, FiCalendar,
    FiBriefcase, FiMapPin, FiBarChart2, FiClock,
    FiAward, FiGrid, FiHash
} from 'react-icons/fi';
import userService from '../../services/userService';
import { toast } from 'react-toastify';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Profile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const response = await userService.getProfile();
            setProfileData(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile data');
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, title, value, color }) => (
        <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('500', '100')}`}>
                    <Icon className={`h-6 w-6 ${color.replace('border-', 'text-')}`} />
                </div>
            </div>
        </div>
    );

    const renderTeacherProfile = () => (
        <div className="space-y-6">
            {/* Teaching Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={FiBook}
                    title="Today's Classes"
                    value={profileData.todayClasses}
                    color="border-green-500"
                />
                <StatCard
                    icon={FiCalendar}
                    title="Weekly Classes"
                    value={profileData.weeklyClasses}
                    color="border-green-500"
                />
                <StatCard
                    icon={FiGrid}
                    title="Total Subjects"
                    value={profileData.subjects?.length || 0}
                    color="border-purple-500"
                />
                <StatCard
                    icon={FiBriefcase}
                    title="Department"
                    value={profileData.department?.name || 'N/A'}
                    color="border-orange-500"
                />
            </div>

            {/* Subjects and Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiBook className="mr-2 text-green-500" />
                        Teaching Subjects
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profileData.subjects?.map(subject => (
                            <div key={subject.id}
                                className="bg-green-50 rounded-lg p-4 flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <FiHash className="text-green-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-green-900">{subject.name}</p>
                                    <p className="text-sm text-green-600">{subject.code}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiClock className="mr-2 text-green-500" />
                        Schedule Overview
                    </h3>
                    <div className="space-y-4">
                        {/* Add schedule details here */}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStudentProfile = () => (
        <div className="space-y-2">
            {/* Academic Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Overall Attendance</h3>
                        <FiBarChart2 className="text-green-500" />
                    </div>
                    <div className="w-32 h-32 mx-auto">
                        <CircularProgressbar
                            value={profileData.attendance?.overall || 0}
                            text={`${Math.round(profileData.attendance?.overall || 0)}%`}
                            styles={buildStyles({
                                pathColor: '#3B82F6',
                                textColor: '#1F2937',
                                trailColor: '#EFF6FF',
                            })}
                        />
                    </div>
                </div>

                <StatCard
                    icon={FiAward}
                    title="Monthly Attendance"
                    value={`${Math.round(profileData.attendance?.monthly || 0)}%`}
                    color="border-green-500"
                />
                <StatCard
                    icon={FiBook}
                    title="Total Classes"
                    value={profileData.attendance?.total_classes || 0}
                    color="border-purple-500"
                />
                <StatCard
                    icon={FiCalendar}
                    title="Present Classes"
                    value={profileData.attendance?.present_classes || 0}
                    color="border-green-500"
                />
            </div>

            {/* Academic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiBriefcase className="mr-2 text-green-500" />
                        Department
                    </h3>
                    <p className="text-gray-700">{profileData.department?.name}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiGrid className="mr-2 text-green-500" />
                        Batch
                    </h3>
                    <p className="text-gray-700">{profileData.batch?.name}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiBook className="mr-2 text-purple-500" />
                        Semester
                    </h3>
                    <p className="text-gray-700">Semester {profileData.semester?.number}</p>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-2">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="md:flex md:items-center md:justify-between p-6">
                    <div className="flex items-center">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-green-500 to-green-500 flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">
                                {profileData?.full_name?.charAt(0)}
                            </span>
                        </div>
                        <div className="ml-6">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {profileData?.full_name}
                            </h1>
                            <p className="text-sm font-medium text-gray-500 mt-1">
                                {profileData?.role?.charAt(0).toUpperCase() + profileData?.role?.slice(1)}
                            </p>
                            <div className="mt-3 flex items-center space-x-4">
                                <div className="flex items-center text-gray-600">
                                    <FiMail className="mr-2" />
                                    {profileData?.email}
                                </div>
                                {profileData?.phone && (
                                    <div className="flex items-center text-gray-600">
                                        <FiPhone className="mr-2" />
                                        {profileData.phone}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {profileData?.address && (
                    <div className="border-t border-gray-200 px-6 py-4">
                        <div className="flex items-center text-gray-600">
                            <FiMapPin className="mr-2" />
                            {profileData.address}
                        </div>
                    </div>
                )}
            </div>

            {/* Role-specific content */}
            {profileData?.role === 'teacher' && renderTeacherProfile()}
            {profileData?.role === 'student' && renderStudentProfile()}
        </div>
    );
};

export default Profile; 