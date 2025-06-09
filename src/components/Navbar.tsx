
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import LoginDialog from './LoginDialog';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 bg-[#121212]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-[#F5F5F5] font-bold text-2xl">ScriptEcho</Link>

          <div className="hidden md:flex items-center justify-center space-x-8 flex-1">
            <Link to="/" className="text-[#F5F5F5] hover:text-gray-300 transition-colors">Features</Link>
            <Link to="/" className="text-[#F5F5F5] hover:text-gray-300 transition-colors">How It Works</Link>
            <Link to="/" className="text-[#F5F5F5] hover:text-gray-300 transition-colors">Pricing</Link>
            <Link to="/" className="text-[#F5F5F5] hover:text-gray-300 transition-colors">Support</Link>
          </div>

          <div>
            <LoginDialog />

            <button
              className="md:hidden text-[#F5F5F5]"
              onClick={toggleMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className={`${isMenuOpen ? 'flex' : 'hidden'} flex-col items-center space-y-4 pt-4 md:hidden`}>
          <Link to="/" className="text-[#F5F5F5] hover:text-gray-300 transition-colors">Features</Link>
          <Link to="/" className="text-[#F5F5F5] hover:text-gray-300 transition-colors">How It Works</Link>
          <Link to="/" className="text-[#F5F5F5] hover:text-gray-300 transition-colors">Pricing</Link>
          <Link to="/" className="text-[#F5F5F5] hover:text-gray-300 transition-colors">Support</Link>
          <div className="w-full">
            <LoginDialog />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
