import React, { useState, useMemo } from 'react';
import { Search, Filter, TrendingUp, Calendar, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHustle } from '../context/HustleContext';
import HustleCard from '../components/HustleCard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { hustles, refreshHustles } = useHustle();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'price'>('latest');
  const [refreshing, setRefreshing] = useState(false);

  const collegeHustles = useMemo(() => {
    let filtered = hustles.filter(hustle => hustle.college === user?.college);

    if (searchTerm) {
      filtered = filtered.filter(hustle =>
        hustle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hustle.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'price') {
        return b.amount - a.amount;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [hustles, user?.college, searchTerm, sortBy]);

  const openHustles = collegeHustles.filter(h => h.status === 'open').length;
  const totalEarnings = hustles
    .filter(h => h.acceptedBy === user?.id && h.status === 'completed')
    .reduce((sum, h) => sum + h.amount, 0);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshHustles();
    } catch (error) {
      console.error('Error refreshing hustles:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-400">
              Available Hustles in {user?.college}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Total Earnings</p>
            <p className="text-xl font-bold text-green-400">₹{totalEarnings}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center">
              <TrendingUp className="text-blue-400 mr-2" size={20} />
              <div>
                <p className="text-gray-400 text-sm">Open Hustles</p>
                <p className="text-white font-semibold">{openHustles}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center">
              <Calendar className="text-green-400 mr-2" size={20} />
              <div>
                <p className="text-gray-400 text-sm">This Month</p>
                <p className="text-white font-semibold">{collegeHustles.filter(h => {
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  return new Date(h.createdAt) > monthAgo;
                }).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search hustles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'price')}
              className="bg-gray-900 border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            >
              <option value="latest">Latest</option>
              <option value="price">Price</option>
            </select>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed flex items-center"
          >
            <RefreshCw size={18} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Hustles Grid */}
      {collegeHustles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
            {searchTerm ? (
              <p>No hustles found matching "{searchTerm}"</p>
            ) : (
              <p>No hustles available in your college yet.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {collegeHustles.map(hustle => (
            <HustleCard key={hustle.id} hustle={hustle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;