import React, { useState } from 'react';
import { GraduationCap, X } from 'lucide-react';

const colleges = [
  // Government Engineering Colleges
  'College of Engineering, Trivandrum',
  'Government Engineering College, Thrissur',
  'Government College of Engineering, Kannur',
  'Government Engineering College, Barton Hill',
  'Government Engineering College, Kozhikode',
  'Government Engineering College, Palakkad',
  'NSS College of Engineering, Palakkad',
  'Government Engineering College, Sreekrishnapuram',
  'Mar Athanasius College of Engineering, Kothamangalam',
  'Government Engineering College, Idukki',
  'TKM College of Engineering, Kollam',
  'Rajiv Gandhi Institute of Technology, Kottayam',
  'Model Engineering College, Thrikkakara',
  
  // College of Engineering Branches
  'College of Engineering, Chengannur',
  'College of Engineering, Karunagappally',
  'College of Engineering, Kallooppara',
  'College of Engineering, Cherthala',
  'College of Engineering, Attingal',
  'College of Engineering, Adoor',
  'College of Engineering, Kottarakkara',
  'College of Engineering, Poonjar',
  'College of Engineering, Vadakara',
  'College of Engineering, Perumon',
  'College of Engineering, Thrikaripur',
  'College of Engineering, Thalassery',
  'College of Engineering, Kidangoor',
  'College of Engineering, Pathanapuram',
  'College of Engineering, Aranmula',
  'College of Engineering, Muttathara',
  'College of Engineering & Management, Punnapra',
  
  // Other Options
  'Other'
];

interface CollegeSelectionModalProps {
  isOpen: boolean;
  onComplete: (college: string, department?: string, year?: string) => void;
  onClose: () => void;
  loading?: boolean;
}

const CollegeSelectionModal: React.FC<CollegeSelectionModalProps> = ({
  isOpen,
  onComplete,
  onClose,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    college: '',
    department: '',
    year: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.college) {
      onComplete(formData.college, formData.department, formData.year);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          disabled={loading}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            <GraduationCap size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h2>
          <p className="text-gray-400 text-sm">
            Please select your college to continue using College വ്യാപാരി
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              College *
            </label>
            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              name="college"
              value={formData.college}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              required
              disabled={loading}
            >
              <option value="">Select College</option>
              {colleges.map(college => (
                <option key={college} value={college}>{college}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="department"
              placeholder="Department (Optional)"
              value={formData.department}
              onChange={handleInputChange}
              className="bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              disabled={loading}
            />
            <input
              type="text"
              name="year"
              placeholder="Year (Optional)"
              value={formData.year}
              onChange={handleInputChange}
              className="bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              disabled={loading}
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-blue-400 text-sm">
              <strong>Note:</strong> This information helps us show you relevant hustles from your college community.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.college}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed"
          >
            {loading ? 'Completing...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CollegeSelectionModal;
