
/**
 * User authentication utilities for managing login state and session persistence
 */

// Activity timeout in milliseconds (24 hours)
const INACTIVITY_TIMEOUT = 24 * 60 * 60 * 1000;

// Key for storing last activity timestamp
const LAST_ACTIVITY_KEY = "fluxLastActivity";
const AUTH_EXPIRY_KEY = "fluxAuthExpiry";

/**
 * Initialize auth tracking by setting up activity listeners and expiry check
 */
export const initializeAuthTracking = () => {
  // Set current timestamp as last activity
  updateLastActivity();
  
  // Setup activity listeners
  const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
  activityEvents.forEach(event => {
    window.addEventListener(event, updateLastActivity);
  });
  
  // Check for expired session
  checkSessionExpiry();
};

/**
 * Update the last activity timestamp
 */
export const updateLastActivity = () => {
  const now = Date.now();
  localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
  
  // Set auth expiry time
  const expiryTime = now + INACTIVITY_TIMEOUT;
  localStorage.setItem(AUTH_EXPIRY_KEY, expiryTime.toString());
};

/**
 * Check if the current session has expired
 */
export const checkSessionExpiry = () => {
  const expiryTime = localStorage.getItem(AUTH_EXPIRY_KEY);
  
  if (expiryTime) {
    const expiry = parseInt(expiryTime, 10);
    const now = Date.now();
    
    if (now > expiry) {
      // Session expired, log out user
      logoutUser();
      return true;
    }
  }
  
  return false;
};

/**
 * Log out the current user by clearing auth-related storage data
 * while preserving user preferences and progress data
 */
export const logoutUser = () => {
  // Store data that should persist beyond logout
  const theme = localStorage.getItem("theme");
  const sidebarPosition = localStorage.getItem("fluxSidebarPosition");
  const userLevel = localStorage.getItem("fluxUserLevel");
  const quests = localStorage.getItem("fluxQuests");
  
  // Clear all auth-related data
  localStorage.removeItem("fluxUser");
  localStorage.removeItem(LAST_ACTIVITY_KEY);
  localStorage.removeItem(AUTH_EXPIRY_KEY);
  localStorage.removeItem('teamId');
  localStorage.removeItem('fluxActivities');
  localStorage.removeItem('fluxAuthExpiry');
  localStorage.removeItem('fluxBoards');
  localStorage.removeItem('fluxLastActivity');
  localStorage.removeItem('fluxSidebarPosition');
  localStorage.removeItem('fluxTeamMembers');
  localStorage.removeItem('fluxTheme');
  localStorage.removeItem('flux_achievements_current-user');
  localStorage.removeItem('fluxLastActivity');

  // Restore preferences and progress data
  if (theme) localStorage.setItem("theme", theme);
  if (sidebarPosition) localStorage.setItem("fluxSidebarPosition", sidebarPosition);
  if (userLevel) localStorage.setItem("fluxUserLevel", userLevel);
  if (quests) localStorage.setItem("fluxQuests", quests);
  
  // Force redirect to login page by reloading the page
  window.location.href = "/login";
};

/**
 * Check if user is logged in and session is valid
 */
export const isAuthenticated = (): boolean => {
  const user = localStorage.getItem("fluxUser");
  if (!user) return false;
  
  // Check if session has expired
  return !checkSessionExpiry();
};

/**
 * Set up periodic checks for session expiry
 */
export const setupExpiryChecker = (intervalMinutes = 5) => {
  // Check every X minutes
  const intervalMs = intervalMinutes * 60 * 1000;
  
  const intervalId = setInterval(() => {
    if (checkSessionExpiry()) {
      clearInterval(intervalId);
    }
  }, intervalMs);
  
  return intervalId;
};
