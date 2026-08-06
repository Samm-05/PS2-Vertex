import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Github, Linkedin, Mail, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-secondary-900 text-secondary-200 border-t border-secondary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-8 h-8 text-primary-500" />
              <span className="text-xl font-bold text-white">ML Visual Lab</span>
            </div>
            <p className="max-w-md text-secondary-300">
              Learn machine learning by experimenting with algorithms and visual simulations in real time.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:contact@mlvisuallab.com" className="hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2">
              <li><a href="#algorithms" className="hover:text-white">Algorithms</a></li>
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#practice" className="hover:text-white">Practice</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#docs" className="hover:text-white">Documentation</a></li>
              <li><a href="#about" className="hover:text-white">Blog</a></li>
              <li><a href="https://github.com" className="hover:text-white">GitHub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Community</h4>
            <ul className="space-y-2">
              <li><a href="#leaderboard" className="hover:text-white">Leaderboard</a></li>
              <li><a href="#practice" className="hover:text-white">Practice</a></li>
              <li><a href="https://github.com" className="hover:text-white">GitHub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/signup" className="hover:text-white">Create Account</Link></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
              <li><a href="#contact" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#contact" className="hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-secondary-700 text-sm text-secondary-400">
          © {new Date().getFullYear()} ML Visual Lab. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
