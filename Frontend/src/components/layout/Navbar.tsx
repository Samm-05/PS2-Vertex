import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  Brain,
  User,
  LogOut,
  Settings,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  Target,
  Trophy,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import NotificationDropdown from './NotificationDropdown';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-midnight/90 backdrop-blur-md border-b border-mountainside/80 shadow-soft'
          : 'bg-midnight border-b border-mountainside'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-mountainside border border-apres/40 flex items-center justify-center shadow-soft group-hover:border-slopes transition-colors">
              <Brain className="w-6 h-6 text-arctic group-hover:scale-105 transition-transform" />
            </div>
            <span className="text-xl font-bold tracking-tight text-arctic group-hover:text-slopes transition-colors">
              ML Visual Lab
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors flex items-center gap-1.5 font-semibold ${
                    isActive ? 'text-cyan-400 font-bold border-b-2 border-cyan-400 pb-0.5' : 'text-slopes hover:text-arctic'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/coach"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors flex items-center gap-1.5 font-semibold ${
                    isActive ? 'text-blue-400 font-bold border-b-2 border-blue-400 pb-0.5' : 'text-slopes hover:text-arctic'
                  }`
                }
              >
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span>ML Coach</span>
              </NavLink>

              <NavLink
                to="/playground"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors flex items-center gap-1.5 font-semibold ${
                    isActive ? 'text-emerald-400 font-bold border-b-2 border-emerald-400 pb-0.5' : 'text-slopes hover:text-arctic'
                  }`
                }
              >
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                <span>Playground</span>
              </NavLink>

              <NavLink
                to="/practice"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors flex items-center gap-1.5 font-semibold ${
                    isActive ? 'text-purple-400 font-bold border-b-2 border-purple-400 pb-0.5' : 'text-slopes hover:text-arctic'
                  }`
                }
              >
                <Target className="w-4 h-4 text-purple-400" />
                <span>Practice</span>
              </NavLink>

              <NavLink
                to="/leaderboard"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors flex items-center gap-1.5 font-semibold ${
                    isActive ? 'text-yellow-400 font-bold border-b-2 border-yellow-400 pb-0.5' : 'text-slopes hover:text-arctic'
                  }`
                }
              >
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Leaderboard</span>
              </NavLink>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NotificationDropdown />

                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-2 p-1 rounded-xl hover:bg-mountainside/60 transition-colors border border-transparent hover:border-mountainside cursor-pointer"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.firstName} className="w-8 h-8 rounded-full object-cover border border-apres" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-mountainside text-arctic border border-apres/50 flex items-center justify-center text-xs font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                    )}
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-secondary-900 rounded-2xl shadow-hard border border-mountainside overflow-hidden backdrop-blur-xl"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-3 text-sm text-slopes hover:text-arctic hover:bg-mountainside/60 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="w-4 h-4 text-emerald-400" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-3 text-sm text-slopes hover:text-arctic hover:bg-mountainside/60 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-cyan-400" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-error hover:bg-mountainside/60 transition-colors border-t border-mountainside cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slopes hover:text-arctic transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold bg-arctic text-midnight hover:bg-slopes rounded-xl transition-colors shadow-soft"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-slopes hover:text-arctic hover:bg-mountainside/60 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-secondary-900 border-t border-mountainside px-4 py-4 space-y-2"
        >
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-cyan-400 hover:bg-mountainside/60 transition-colors font-semibold"
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard className="w-4 h-4 text-cyan-400" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/coach"
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-blue-400 hover:bg-mountainside/60 transition-colors font-semibold"
            onClick={() => setIsOpen(false)}
          >
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>ML Coach</span>
          </Link>
          <Link
            to="/playground"
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-emerald-400 hover:bg-mountainside/60 transition-colors font-semibold"
            onClick={() => setIsOpen(false)}
          >
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <span>Playground</span>
          </Link>
          <Link
            to="/practice"
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-purple-400 hover:bg-mountainside/60 transition-colors font-semibold"
            onClick={() => setIsOpen(false)}
          >
            <Target className="w-4 h-4 text-purple-400" />
            <span>Practice</span>
          </Link>
          <Link
            to="/leaderboard"
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-yellow-400 hover:bg-mountainside/60 transition-colors font-semibold"
            onClick={() => setIsOpen(false)}
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>Leaderboard</span>
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
