
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-6 md:px-12">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-2xl">SCRIPTAI</Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-gray-300 transition-colors">Features</Link>
          <Link to="/" className="text-white hover:text-gray-300 transition-colors">How It Works</Link>
          <Link to="/" className="text-white hover:text-gray-300 transition-colors">Pricing</Link>
          <Link to="/" className="text-white hover:text-gray-300 transition-colors">Support</Link>
          <Link 
            to="/" 
            className="bg-white text-black px-4 py-2 rounded hover:bg-opacity-90 transition-all"
          >
            Login
          </Link>
        </div>
        
        <button className="md:hidden text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
