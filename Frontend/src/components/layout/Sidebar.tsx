import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  GraduationCap,
  Brain,
  Target,
  Trophy,
  User,
  Settings,
  Search,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { toggleSidebar } from '../../features/ui/uiSlice';

/**
 * ChatGPT-Style Collapsible Sidebar Component for ML Visual Lab
 */
const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  if (!isAuthenticated) return null;

  const mainNavItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/coach', icon: GraduationCap, label: 'ML Coach' },
    { path: '/playground', icon: FlaskConical, label: 'Playground' },
    { path: '/practice', icon: Target, label: 'Practice' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  ];

  const accountItems = [
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside
      className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)]
        bg-midnight border-r border-mountainside
        hidden lg:block z-40 shadow-soft select-none
        transition-[width] duration-200 ease-out
        ${sidebarOpen ? 'w-60' : 'w-16'}
      `}
    >
      <div className="h-full flex flex-col justify-between py-4 px-2 overflow-hidden">
        {/* Top Container: Logo Toggle + Search + Main Navigation */}
        <div className="space-y-3">
          {/* LOGO ROW */}
          <button
            type="button"
            onClick={() => dispatch(toggleSidebar())}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-mountainside/60 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-1 focus:ring-slopes group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-mountainside border border-apres/40 text-arctic flex items-center justify-center shadow-soft shrink-0 group-hover:border-slopes transition-colors">
              <Brain className="w-5 h-5 text-slopes group-hover:text-arctic transition-colors" />
            </div>

            <div
              className={`
                flex flex-col whitespace-nowrap overflow-hidden
                transition-all duration-150 ease-out
                ${sidebarOpen ? 'opacity-100 delay-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none w-0'}
              `}
            >
              <span className="text-sm font-bold text-arctic tracking-tight">ML Visual Lab</span>
              <span className="text-[10px] font-mono text-apres">Studio Lab</span>
            </div>
          </button>

          {/* SEARCH ROW */}
          <button
            type="button"
            onClick={() => {
              if (!sidebarOpen) dispatch(toggleSidebar());
            }}
            className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-mountainside/50 text-slopes hover:text-arctic transition-colors duration-150 cursor-pointer group text-left"
          >
            <div className="w-10 h-10 flex items-center justify-center shrink-0 text-slopes group-hover:text-arctic">
              <Search className="w-5 h-5" />
            </div>
            <span
              className={`
                text-xs font-mono text-apres group-hover:text-slopes whitespace-nowrap overflow-hidden
                transition-all duration-150 ease-out
                ${sidebarOpen ? 'opacity-100 delay-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none w-0'}
              `}
            >
              Search models...
            </span>
          </button>

          {/* MAIN NAVIGATION */}
          <nav className="space-y-1">
            {sidebarOpen && (
              <p className="px-3 text-[10px] font-mono uppercase tracking-widest text-apres mb-2 transition-opacity duration-150 delay-100">
                Navigation
              </p>
            )}
            {mainNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-1.5 rounded-xl transition-all duration-150
                  ${
                    isActive
                      ? 'bg-mountainside text-arctic border border-apres/50 shadow-soft'
                      : 'text-slopes hover:text-arctic hover:bg-mountainside/40 border border-transparent'
                  }`
                }
              >
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>

                <span
                  className={`
                    text-xs font-medium whitespace-nowrap overflow-hidden
                    transition-all duration-150 ease-out
                    ${sidebarOpen ? 'opacity-100 delay-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none w-0'}
                  `}
                >
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Account Preferences */}
        <div className="space-y-1 pt-2 border-t border-mountainside/80">
          {sidebarOpen && (
            <p className="px-3 text-[10px] font-mono uppercase tracking-widest text-apres mb-2 transition-opacity duration-150 delay-100">
              Account
            </p>
          )}
          {accountItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-1.5 rounded-xl transition-all duration-150
                ${
                  isActive
                    ? 'bg-mountainside text-arctic border border-apres/50 shadow-soft'
                    : 'text-slopes hover:text-arctic hover:bg-mountainside/40 border border-transparent'
                }`
              }
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5" />
              </div>

              <span
                className={`
                  text-xs font-medium whitespace-nowrap overflow-hidden
                  transition-all duration-150 ease-out
                  ${sidebarOpen ? 'opacity-100 delay-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none w-0'}
                `}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
