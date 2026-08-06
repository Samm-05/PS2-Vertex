const Notification = require('../models/Notification');

// GET /api/notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    let notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

    // Seed default welcome notifications if user has zero notifications
    if (notifications.length === 0) {
      const defaultNotifs = [
        {
          user: userId,
          title: 'Welcome to ML Visual Lab! 🎉',
          message: 'Start your interactive 3D machine learning journey today.',
          type: 'system',
          read: false,
          link: '/coach',
          createdAt: new Date(),
        },
        {
          user: userId,
          title: 'Daily Streak Active 🔥',
          message: 'Keep your momentum by completing daily 3D simulation sessions.',
          type: 'streak',
          read: false,
          link: '/dashboard',
          createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        },
        {
          user: userId,
          title: 'Interactive Playground Ready 🚀',
          message: 'Explore 3D simulations for Linear Regression and Neural Networks.',
          type: 'lesson',
          read: false,
          link: '/playground',
          createdAt: new Date(Date.now() - 2 * 3600 * 1000), // 2 hours ago
        },
      ];

      notifications = await Notification.insertMany(defaultNotifs);
    }

    const unreadCount = notifications.filter((n) => !n.read).length;

    res.json({
      notifications: notifications.map((n) => (n.toJSON ? n.toJSON() : n)),
      unreadCount,
    });
  } catch (err) {
    console.error('[NOTIFICATION CONTROLLER] Error fetching notifications:', err);
    res.status(500).json({ message: 'Server error fetching notifications', notifications: [], unreadCount: 0 });
  }
};

// PATCH /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({ _id: id, user: req.user._id });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.json(notification.toJSON ? notification.toJSON() : notification);
  } catch (err) {
    console.error('[NOTIFICATION CONTROLLER] Error marking read:', err);
    res.status(500).json({ message: 'Server error updating notification' });
  }
};

// PATCH /api/notifications/read-all
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { $set: { read: true } });

    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      message: 'All notifications marked as read',
      notifications: notifications.map((n) => (n.toJSON ? n.toJSON() : n)),
      unreadCount: 0,
    });
  } catch (err) {
    console.error('[NOTIFICATION CONTROLLER] Error marking all read:', err);
    res.status(500).json({ message: 'Server error updating notifications' });
  }
};