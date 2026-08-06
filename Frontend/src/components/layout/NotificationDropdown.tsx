import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Flame,
  Trophy,
  GraduationCap,
  Target,
  Medal,
  Sparkles,
  CheckCircle2,
  Inbox,
} from 'lucide-react';
import {
  notificationService,
  AppNotification,
} from '../../services/notificationService';
import { useAppSelector } from '../../app/hooks';

// Relative time formatter
const formatRelativeTime = (dateString: string): string => {
  if (!dateString) return 'Just now';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 3600));
  const diffDays = Math.floor(diffMs / (1000 * 3600 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Fetch user notifications from backend API
  const fetchNotifs = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationService.getNotifications();
      if (res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.warn('[NOTIFICATIONS] Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifs();
    // Poll notifications every 60 seconds
    const interval = setInterval(fetchNotifs, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Click Outside Detection Hook
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Mark single notification as read
  const handleMarkAsRead = async (id: string, link?: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('[NOTIFICATIONS] Failed to mark read:', err);
    }
    if (link) {
      navigate(link);
      setIsOpen(false);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('[NOTIFICATIONS] Failed to mark all read:', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Flame className="w-4 h-4 text-orange-500 flex-shrink-0" />;
      case 'achievement':
        return <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
      case 'lesson':
        return <GraduationCap className="w-4 h-4 text-blue-400 flex-shrink-0" />;
      case 'quiz':
        return <Target className="w-4 h-4 text-purple-400 flex-shrink-0" />;
      case 'leaderboard':
        return <Medal className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifs();
        }}
        aria-label="Notifications"
        className="p-2 rounded-xl text-slopes hover:text-arctic hover:bg-mountainside/60 transition-colors relative cursor-pointer focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[1.125rem] h-4.5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-secondary-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-mountainside overflow-hidden z-50"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-mountainside bg-secondary-900/80">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-arctic">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-primary-500/20 text-primary-400 border border-primary-500/30 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Notification Items List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-mountainside/50 scrollbar-thin">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id, notif.link)}
                    className={`
                      p-3.5 flex items-start space-x-3 transition-colors cursor-pointer
                      ${!notif.read ? 'bg-primary-500/10 hover:bg-primary-500/15' : 'hover:bg-mountainside/40'}
                    `}
                  >
                    <div className="p-2 rounded-xl bg-mountainside/60 border border-apres/30 shrink-0">
                      {getNotificationIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-0.5">
                        <p className={`text-xs font-bold truncate ${!notif.read ? 'text-arctic' : 'text-slopes'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-apres shrink-0 ml-2">
                          {formatRelativeTime(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-secondary-400 line-clamp-2 leading-snug">
                        {notif.message}
                      </p>
                    </div>

                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0 self-center shadow-sm" />
                    )}
                  </div>
                ))
              ) : (
                /* Empty State */
                <div className="p-8 text-center">
                  <Inbox className="w-10 h-10 text-apres mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-slopes">No notifications yet.</p>
                  <p className="text-xs text-apres mt-1">We will notify you when you achieve streaks and unlock badges.</p>
                </div>
              )}
            </div>

            {/* Panel Footer */}
            <div className="px-4 py-2 border-t border-mountainside bg-secondary-900/90 text-center">
              <span className="text-[10px] font-mono text-apres uppercase tracking-wider">
                ML Visual Lab Notifications
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
