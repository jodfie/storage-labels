// Haptic Feedback Utility for Mobile

export const haptics = {
  // Light tap (for button press)
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },

  // Medium impact (for successful action)
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  },

  // Success pattern (for completed action)
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },

  // Error pattern (for failed action)
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }
  },

  // Delete action (warning vibration)
  delete: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 50, 30]);
    }
  }
};
