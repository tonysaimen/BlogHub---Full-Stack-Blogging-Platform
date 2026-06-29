import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Image, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const { user, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setSubmitting(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.avatar || undefined
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err || 'Registration failed. Email might already be in use.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-12 flex flex-col justify-center min-h-[calc(100vh-4rem)]">
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="bg-indigo-600/10 p-3 rounded-2xl w-fit mx-auto mb-4 border border-indigo-500/25">
            <UserPlus className="h-6 w-6 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Create Account</h2>
          <p className="text-slate-400 text-xs mt-1">Join the community to start writing blogs and commenting.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-3 rounded-2xl text-xs flex items-center gap-2 mb-6 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-150 text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none transition-colors"
              />
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-150 text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none transition-colors"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Password (min. 6 chars)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-150 text-sm pl-10 pr-10 py-2.5 rounded-xl outline-none transition-colors"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-indigo-400 focus:outline-none transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Avatar Image URL <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/... (or auto-generated)"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-150 text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none transition-colors"
              />
              <Image className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">If blank, a custom illustration avatar will be created automatically.</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer shadow-md shadow-indigo-950/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {submitting ? 'Creating Account...' : 'Sign Up'}
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        {/* Footer link */}
        <div className="text-center mt-6 pt-6 border-t border-slate-800/80">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
