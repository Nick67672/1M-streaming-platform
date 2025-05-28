import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-md transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            to="/" 
            className="text-2xl font-bold text-white flex items-center mr-6"
          >
            <span className="text-[#03A9F4] mr-1">1M</span>
            Streaming Platform
          </Link>
          
          {/* Desktop Search Bar */}
          <form 
            onSubmit={handleSearch} 
            className="hidden md:flex relative w-96"
          >
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-full py-2 px-4 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-[#03A9F4] transition-all"
            />
            <button 
              type="submit" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <Search size={18} />
            </button>
          </form>
        </div>
        
        <div className="flex items-center">
          {/* Mobile Search Button */}
          <button 
            className="md:hidden mr-4 text-gray-300 hover:text-white transition-colors"
          >
            <Search size={22} />
          </button>
          
          {user ? (
            <Link 
              to="/profile" 
              className="flex items-center hover:text-[#03A9F4] transition-colors"
            >
              {profile?.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.username} 
                  className="w-8 h-8 rounded-full object-cover border border-[#03A9F4]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#03A9F4] flex items-center justify-center">
                  <User size={18} />
                </div>
              )}
              <span className="ml-2 hidden lg:block">{profile?.username || 'User'}</span>
            </Link>
          ) : (
            <Link 
              to="/auth" 
              className="bg-[#03A9F4] hover:bg-[#0288D1] text-white px-4 py-2 rounded-md transition-colors"
            >
              Sign In
            </Link>
          )}
          
          {/* Mobile Menu Button */}
          <button 
            className="ml-4 lg:hidden text-gray-300 hover:text-white transition-colors"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form 
          onSubmit={handleSearch} 
          className="relative"
        >
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-full py-2 px-4 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-[#03A9F4] transition-all"
          />
          <button 
            type="submit" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            <Search size={18} />
          </button>
        </form>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-900 px-4 py-3 border-t border-gray-800">
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-white hover:text-[#03A9F4] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="text-white hover:text-[#03A9F4] transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  to="/settings" 
                  className="text-white hover:text-[#03A9F4] transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="text-white hover:text-[#03A9F4] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;