import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Mail, Lock, GraduationCap } from 'lucide-react';
import CollegeSelectionModal from '../components/CollegeSelectionModal';

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

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [collegeModalLoading, setCollegeModalLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    department: '',
    year: ''
  });

  const { login, signup, signInWithGoogle, completeGoogleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Invalid email or password');
        }
      } else {
        if (!formData.name || !formData.college) {
          setError('Please fill in all required fields');
          return;
        }
        const success = await signup(formData);
        if (success) {
          navigate('/dashboard');
        } else {
          setError('User already exists');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      console.log('AuthPage: Starting Google sign-in...');
      const result = await signInWithGoogle();
      console.log('AuthPage: Google sign-in result:', result);
      
      if (result.success) {
        if (result.needsCollegeInfo) {
          console.log('AuthPage: Showing college modal');
          setShowCollegeModal(true);
        } else {
          console.log('AuthPage: Navigating to dashboard');
          navigate('/dashboard');
        }
      } else {
        console.log('AuthPage: Google sign-in failed');
        setError('Google sign-in failed. Please try again.');
      }
    } catch (err) {
      console.error('AuthPage: Google sign-in error:', err);
      setError('Something went wrong with Google sign-in. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCollegeModalComplete = async (college: string, department?: string, year?: string) => {
    setCollegeModalLoading(true);

    try {
      const success = await completeGoogleSignIn(college, department, year);
      if (success) {
        setShowCollegeModal(false);
        navigate('/dashboard');
      } else {
        setError('Failed to complete profile. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setCollegeModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-white">College</span>
          </h1>
          <h2 className="text-3xl font-bold text-blue-400 mb-4">വ്യാപാരി</h2>
          <p className="text-gray-400 text-sm uppercase tracking-wider">
            "WHERE STUDENTS MEET HUSTLES"
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 shadow-2xl">
          <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                isLogin
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                !isLogin
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!isLogin && (
              <>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    required={!isLogin}
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
                  />
                  <input
                    type="text"
                    name="year"
                    placeholder="Year (Optional)"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-200 text-gray-900 py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center"
          >
            {googleLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </div>
            )}
          </button>
        </div>
      </div>

      {/* College Selection Modal */}
      <CollegeSelectionModal
        isOpen={showCollegeModal}
        onComplete={handleCollegeModalComplete}
        onClose={() => setShowCollegeModal(false)}
        loading={collegeModalLoading}
      />

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;