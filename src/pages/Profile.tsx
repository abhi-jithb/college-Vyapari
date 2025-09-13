import React, { useState, useEffect } from 'react';
import { User, MapPin, Calendar, BookOpen, TrendingUp, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHustle } from '../context/HustleContext';
import { Hustle } from '../types';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { getUserHustles } = useHustle();
  const [posted, setPosted] = useState<Hustle[]>([]);
  const [accepted, setAccepted] = useState<Hustle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchUserHustles = async () => {
      if (user?.id) {
        console.log('Profile: Fetching hustles for user:', user.id);
        setLoading(true);
        try {
          const { posted: postedHustles, accepted: acceptedHustles } = await getUserHustles(user.id);
          console.log('Profile: Received hustles:', { posted: postedHustles.length, accepted: acceptedHustles.length });
          console.log('Profile: Posted hustles:', postedHustles);
          console.log('Profile: Accepted hustles:', acceptedHustles);
          setPosted(postedHustles);
          setAccepted(acceptedHustles);
        } catch (error) {
          console.error('Profile: Error fetching user hustles:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('Profile: No user ID available');
      }
    };

    fetchUserHustles();
  }, [user?.id, getUserHustles]);

  const handleRefresh = async () => {
    if (user?.id) {
      setRefreshing(true);
      try {
        console.log('Profile: Manual refresh for user:', user.id);
        const { posted: postedHustles, accepted: acceptedHustles } = await getUserHustles(user.id);
        console.log('Profile: Manual refresh received:', { posted: postedHustles.length, accepted: acceptedHustles.length });
        setPosted(postedHustles);
        setAccepted(acceptedHustles);
      } catch (error) {
        console.error('Profile: Error in manual refresh:', error);
      } finally {
        setRefreshing(false);
      }
    }
  };

  const completedAccepted = accepted.filter(h => h.status === 'completed');
  const totalEarned = user?.totalEarned || completedAccepted.reduce((sum, h) => sum + h.amount, 0);
  const completedPosted = posted.filter(h => h.status === 'completed');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'accepted':
        return <Clock size={16} className="text-yellow-400" />;
      default:
        return <TrendingUp size={16} className="text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'accepted':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">{user?.name}</h1>
                <div className="flex items-center text-gray-400 text-sm mb-1">
                  <MapPin size={14} className="mr-1" />
                  <span>{user?.college}</span>
                </div>
                {user?.department && (
                  <div className="flex items-center text-gray-400 text-sm mb-1">
                    <BookOpen size={14} className="mr-1" />
                    <span>{user?.department}</span>
                    {user?.year && <span className="ml-1">• {user.year}</span>}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1 mb-4"
              >
                <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <p className="text-gray-400 text-sm">Total Earned</p>
              <p className="text-2xl font-bold text-green-400">₹{totalEarned}</p>
              {user?.rating && (
                <div className="mt-2">
                  <p className="text-gray-400 text-sm">Rating</p>
                  <p className="text-lg font-bold text-yellow-400">
                    ⭐ {user.rating.toFixed(1)} ({user.totalRatings || 0} reviews)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">{posted.length}</p>
              <p className="text-gray-400 text-sm">Posted</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">{accepted.length}</p>
              <p className="text-gray-400 text-sm">Accepted</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">{completedAccepted.length + completedPosted.length}</p>
              <p className="text-gray-400 text-sm">Completed</p>
            </div>
          </div>
        </div>

        {/* Hustles Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Accepted Hustles */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <User className="mr-2 text-blue-400" size={20} />
              Hustles Accepted ({accepted.length})
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {accepted.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No hustles accepted yet</p>
              ) : (
                accepted.map(hustle => (
                  <div key={hustle.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-medium text-sm">{hustle.title}</h3>
                      <div className="flex items-center">
                        {getStatusIcon(hustle.status)}
                        <span className={`ml-1 text-xs ${getStatusColor(hustle.status)}`}>
                          {hustle.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mb-2 line-clamp-2">{hustle.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-400 font-semibold text-sm">₹{hustle.amount}</span>
                      <span className="text-gray-500 text-xs">{formatDate(hustle.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Posted Hustles */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <TrendingUp className="mr-2 text-green-400" size={20} />
              Hustles Posted ({posted.length})
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {posted.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No hustles posted yet</p>
              ) : (
                posted.map(hustle => (
                  <div key={hustle.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-medium text-sm">{hustle.title}</h3>
                      <div className="flex items-center">
                        {getStatusIcon(hustle.status)}
                        <span className={`ml-1 text-xs ${getStatusColor(hustle.status)}`}>
                          {hustle.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mb-2 line-clamp-2">{hustle.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-400 font-semibold text-sm">₹{hustle.amount}</span>
                      <span className="text-gray-500 text-xs">{formatDate(hustle.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;