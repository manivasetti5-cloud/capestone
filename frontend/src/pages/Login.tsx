import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Compass } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    phone: '',
    gstNumber: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/b2b/login`, {
          email: formData.email,
          password: formData.password
        });
        
        if (res.data.success) {
          setAuth(res.data.user, res.data.token);
          navigate('/dashboard');
        }
      } else {
        const res = await axios.post(`${API_URL}/b2b/register`, {
          email: formData.email,
          password: formData.password,
          businessName: formData.businessName,
          phone: formData.phone,
          gstNumber: formData.gstNumber
        });

        if (res.data.success) {
          setSuccessMsg(res.data.message || 'Registration successful! You can now log in.');
          setIsLogin(true);
          setFormData({ ...formData, password: '' });
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-emerald-950 font-sans selection:bg-amber-600 selection:text-emerald-950">
      
      {/* Left side - Editorial / Typographic Panel (Hidden on Mobile/Tablet) */}
      <div className="hidden lg:flex w-[45%] relative bg-emerald-900 flex-col justify-between p-12 xl:p-16 border-r border-emerald-800">
        
        <div className="relative z-10 flex items-center">
          <Link to="/" className="flex items-center space-x-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm">
            <div className="w-10 h-10 bg-amber-600 flex items-center justify-center">
              <Compass className="text-emerald-950" size={24} strokeWidth={2} />
            </div>
            <span className="font-bold text-xl tracking-widest text-emerald-50 uppercase">
              IndiaExplore
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md mt-16 xl:mt-20">
          <div className="inline-block border border-amber-600/30 bg-emerald-950 px-3 py-1 mb-6 xl:mb-8 text-xs font-bold uppercase tracking-widest text-amber-500">
            Authentication Gateway
          </div>
          <h2 className="text-4xl xl:text-5xl font-serif leading-[1.1] text-emerald-50 mb-6 xl:mb-8">
            Access the <br />
            Geospatial <br />
            <span className="italic text-amber-600">Database.</span>
          </h2>
          <p className="text-base xl:text-lg text-emerald-200 font-light leading-relaxed">
            Provision API keys, manage rate limits, and monitor usage through the enterprise terminal.
          </p>
        </div>

        <div className="relative z-10 border-t border-emerald-800 pt-8 mt-auto">
          <p className="text-xs text-emerald-500 uppercase tracking-widest font-mono">
            System Status: Nominal<br/>
            Node: IN-SOUTH-1
          </p>
        </div>
      </div>

      {/* Right side - Brutalist Form (Full width on Mobile/Tablet) */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 lg:p-16 xl:p-24 bg-emerald-950">
        <div className="w-full max-w-md lg:max-w-lg">
          
          {/* Mobile Header (Visible only on smaller screens) */}
          <div className="lg:hidden flex items-center justify-start space-x-3 mb-10 sm:mb-16 border-b border-emerald-800 pb-6">
            <Link to="/" className="flex items-center space-x-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-600 flex items-center justify-center">
                <Compass className="text-emerald-950" size={20} strokeWidth={2} />
              </div>
              <span className="font-bold text-xl sm:text-2xl tracking-widest text-emerald-50 uppercase">
                IndiaExplore
              </span>
            </Link>
          </div>

          <div className="mb-8 sm:mb-12 border-b border-emerald-800 pb-6 sm:pb-8">
            <h1 className="text-3xl sm:text-4xl font-serif text-emerald-50 mb-2 sm:mb-3">
              {isLogin ? 'Sign In' : 'Register Account'}
            </h1>
            <p className="text-amber-600 uppercase tracking-widest text-xs sm:text-sm font-bold">
              {isLogin ? "Provide credentials to continue" : "Join the enterprise platform"}
            </p>
          </div>

          {error && (
            <div className="mb-6 sm:mb-8 p-4 border border-red-900 bg-red-950/50 text-red-400 text-xs sm:text-sm font-bold uppercase tracking-widest">
              [Error] {error}
            </div>
          )}
          
          {successMsg && (
            <div className="mb-6 sm:mb-8 p-4 border border-amber-600/50 bg-emerald-900 text-amber-500 text-xs sm:text-sm font-bold uppercase tracking-widest">
              [Success] {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {!isLogin && (
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <label htmlFor="businessName" className="block text-xs font-bold text-emerald-500 mb-2 uppercase tracking-widest">Business Name</label>
                  <input
                    id="businessName"
                    type="text"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3.5 sm:py-4 bg-emerald-900/50 border border-emerald-800 text-emerald-50 placeholder-emerald-700 focus:outline-none focus:border-amber-600 focus-visible:ring-1 focus-visible:ring-amber-600 transition-colors font-sans focus:bg-emerald-900"
                    placeholder="ENTER BUSINESS NAME"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-emerald-500 mb-2 uppercase tracking-widest">Phone</label>
                    <input
                      id="phone"
                      type="text"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3.5 sm:py-4 bg-emerald-900/50 border border-emerald-800 text-emerald-50 placeholder-emerald-700 focus:outline-none focus:border-amber-600 focus-visible:ring-1 focus-visible:ring-amber-600 transition-colors font-sans focus:bg-emerald-900"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="gstNumber" className="block text-xs font-bold text-emerald-500 mb-2 uppercase tracking-widest">GST (Optional)</label>
                    <input
                      id="gstNumber"
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3.5 sm:py-4 bg-emerald-900/50 border border-emerald-800 text-emerald-50 placeholder-emerald-700 focus:outline-none focus:border-amber-600 focus-visible:ring-1 focus-visible:ring-amber-600 transition-colors font-sans focus:bg-emerald-900"
                      placeholder="GST NUMBER"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-emerald-500 mb-2 uppercase tracking-widest">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full px-4 py-3.5 sm:py-4 bg-emerald-900/50 border border-emerald-800 text-emerald-50 placeholder-emerald-700 focus:outline-none focus:border-amber-600 focus-visible:ring-1 focus-visible:ring-amber-600 transition-colors font-sans focus:bg-emerald-900"
                placeholder="USER@DOMAIN.COM"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-emerald-500 mb-2 uppercase tracking-widest">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full px-4 py-3.5 sm:py-4 bg-emerald-900/50 border border-emerald-800 text-emerald-50 placeholder-emerald-700 focus:outline-none focus:border-amber-600 focus-visible:ring-1 focus-visible:ring-amber-600 transition-colors font-sans focus:bg-emerald-900"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-4 sm:py-5 px-4 mt-8 bg-amber-600 hover:bg-amber-500 text-emerald-950 font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:bg-emerald-800 disabled:text-emerald-600 disabled:cursor-not-allowed uppercase tracking-widest text-xs sm:text-sm"
            >
              {loading ? (
                'Processing...'
              ) : (
                <span>{isLogin ? 'Authenticate' : 'Initialize Account'}</span>
              )}
            </button>
          </form>

          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-emerald-800 text-left text-emerald-400 text-xs sm:text-sm font-sans uppercase tracking-widest font-bold">
            {isLogin ? "No account? " : "Existing User? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccessMsg('');
              }}
              className="text-amber-500 hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ml-2 underline underline-offset-4 rounded-sm"
            >
              {isLogin ? 'Register Here' : 'Authenticate Here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
