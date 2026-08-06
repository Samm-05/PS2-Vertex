import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                ML Visual Lab
              </span>
            </div>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4 max-w-md">
              Interactive Machine Learning Algorithm Simulator. Learn ML concepts through hands-on visualization.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-secondary-400 hover:text-secondary-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-secondary-400 hover:text-secondary-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-secondary-400 hover:text-secondary-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:contact@mlvisuallab.com" className="text-secondary-400 hover:text-secondary-600 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/simulator" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors">Simulator</Link></li>
              <li><Link to="/practice" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors">Practice</Link></li>
              <li><Link to="/leaderboard" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary-200 dark:border-secondary-800 text-center text-secondary-500 dark:text-secondary-400 text-sm">
          <p>&copy; {new Date().getFullYear()} ML Visual Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;