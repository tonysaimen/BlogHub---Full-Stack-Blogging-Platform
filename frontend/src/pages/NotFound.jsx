import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="max-w-md w-full mx-auto px-4 py-20 flex flex-col justify-center items-center text-center min-h-[calc(100vh-4rem)]">
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 w-full">
        <div className="bg-indigo-600/10 p-4 rounded-2xl w-fit mx-auto border border-indigo-500/25 animate-bounce">
          <HelpCircle className="h-10 w-10 text-indigo-400" />
        </div>
        
        <div>
          <h1 className="text-6xl font-black text-slate-100 tracking-tighter">404</h1>
          <h2 className="text-xl font-bold text-slate-200 mt-2">Page Not Found</h2>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-805">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-indigo-950/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
