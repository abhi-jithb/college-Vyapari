import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, FileText, Type, Calendar, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHustle } from '../context/HustleContext';

const PostHustle: React.FC = () => {
  const { user } = useAuth();
  const { addHustle } = useHustle();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      await addHustle({
        title: formData.title,
        description: formData.description,
        amount: parseInt(formData.amount),
        deadline: formData.deadline || undefined,
        postedBy: user.id,
        postedByName: user.name,
        postedByDepartment: user.department,
        college: user.college
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error posting hustle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="mr-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Post a Hustle</h1>
            <p className="text-gray-400">Share a task and find someone to help!</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Title *
              </label>
              <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="title"
                placeholder="e.g., Print posters, Notes typing, Assignment help"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Description *
              </label>
              <FileText className="absolute left-3 top-4 text-gray-400" size={18} />
              <textarea
                name="description"
                placeholder="Describe what you need help with. Be specific about requirements, location, timeline, etc."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Amount Offered (₹) *
              </label>
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
              <input
                type="number"
                name="amount"
                placeholder="100"
                value={formData.amount}
                onChange={handleInputChange}
                min="1"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Deadline (Optional)
              </label>
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">Posting Guidelines</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Be clear and specific about what you need</li>
                <li>• Set a fair amount based on the work required</li>
                <li>• Only students from {user?.college} can see this post</li>
                <li>• Be respectful and professional in communications</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.title || !formData.description || !formData.amount}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post Hustle'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostHustle;