import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark' | 'system';
  onlineStatus: boolean;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  notifications: Notification[];
  modalState: Record<string, boolean>;
  toastQueue: any[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  read: boolean;
  timestamp: string;
}

const initialState: UIState = {
  theme: 'system',
  onlineStatus: navigator.onLine,
  sidebarOpen: false, // Default to COLLAPSED state as specified
  mobileMenuOpen: false,
  notifications: [],
  modalState: {},
  toastQueue: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (action.payload === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.onlineStatus = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        ...action.payload,
        read: false,
        timestamp: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modalState[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modalState[action.payload] = false;
    },
    toggleModal: (state, action: PayloadAction<string>) => {
      state.modalState[action.payload] = !state.modalState[action.payload];
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  setOnlineStatus,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
  openModal,
  closeModal,
  toggleModal,
} = uiSlice.actions;

export default uiSlice.reducer;
