import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, User as UserIcon, FilePenLine, LogIn, UserPlus, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text font-black text-2xl tracking-wider group-hover:scale-105 transition-transform duration-300">
                BLOGHUB
              </span>
            </Link>
          </div>

          {/* Search Bar Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search articles, tags, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-400 pl-10 pr-4 py-1.5 rounded-full text-sm outline-none transition-all duration-300"
              />
              <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-slate-400" />
            </form>
          </div>

          {/* Navigation Links Desktop */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-indigo-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to="/create"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 px-4 py-1.5 rounded-full text-sm font-medium shadow-md shadow-indigo-950/40 hover:shadow-indigo-950/60 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <FilePenLine className="h-4 w-4" />
                  Write
                </Link>

                {/* Profile Dropdown Container */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full border-2 border-slate-700 hover:border-indigo-500 object-cover cursor-pointer transition-colors duration-300"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                      ></div>
                      <div className="absolute right-0 mt-3 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-3 duration-250">
                        <div className="px-4 py-2 border-b border-slate-800">
                          <p className="text-xs text-slate-400">Signed in as</p>
                          <p className="text-sm font-semibold text-slate-200 truncate">{user.name}</p>
                        </div>

                        <Link
                          to="/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          to={`/profile/${user._id}`}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                          <UserIcon className="h-4 w-4" />
                          My Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 text-left transition-colors border-t border-slate-800 mt-1"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-1 text-slate-300 hover:text-white text-sm font-medium px-3 py-1.5 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-100 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white focus:outline-none p-1"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-slate-950 px-4 py-4 space-y-3 shadow-lg">
          {/* Search bar inside mobile menu */}
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 pl-10 pr-4 py-2 rounded-full text-sm outline-none transition-all"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </form>

          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-xl text-base font-medium transition-colors ${
              isActive('/') ? 'bg-slate-900 text-indigo-400' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/create"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
              >
                <FilePenLine className="h-4 w-4" />
                Write Post
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to={`/profile/${user._id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                <UserIcon className="h-4 w-4" />
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium text-red-400 hover:bg-slate-900 hover:text-red-300 text-left border-t border-slate-800/80 pt-3"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md shadow-indigo-950/25 transition-all"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
