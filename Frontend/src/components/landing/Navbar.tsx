import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Algorithms', href: '#algorithms' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-secondary-900/85 backdrop-blur border-b border-secondary-700/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-primary-500" />
          <span className="text-xl font-bold text-white">ML Visual Lab</span>
        </a>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              whileHover={{ y: -2 }}
              className="text-sm font-medium text-secondary-200 hover:text-white transition-colors"
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-secondary-100 hover:text-white font-semibold tracking-wide">
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold tracking-wide transition-colors"
          >
            Sign Up
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="lg:hidden p-2 rounded-md text-secondary-100 hover:bg-secondary-800"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-secondary-700 bg-secondary-900">
          <nav className="px-4 py-4 grid gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-secondary-200 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link to="/login" className="text-secondary-200 hover:text-white" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link
              to="/signup"
              className="inline-flex w-max px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
