// Device fingerprinting utility for anonymous user tracking
export interface DeviceFingerprint {
  hash: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
}

export const generateDeviceFingerprint = (): DeviceFingerprint => {
  // Get device characteristics
  const userAgent = navigator.userAgent;
  const screenResolution = `${screen.width}x${screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;
  const platform = navigator.platform;

  // Create a hash from device characteristics
  const fingerprintString = `${userAgent}|${screenResolution}|${timezone}|${language}|${platform}`;
  
  // Simple hash function (in production, consider using a proper crypto library)
  let hash = 0;
  for (let i = 0; i < fingerprintString.length; i++) {
    const char = fingerprintString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const fingerprintHash = Math.abs(hash).toString(36);

  return {
    hash: fingerprintHash,
    userAgent,
    screenResolution,
    timezone,
    language,
    platform
  };
};

// Generate unique session ID
export const generateSessionId = (): string => {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

// Storage keys for anonymous user data
export const STORAGE_KEYS = {
  ANONYMOUS_SESSION: 'botsrhere_anonymous_session',
  DEVICE_FINGERPRINT: 'botsrhere_device_fingerprint',
  ANONYMOUS_USER_ID: 'botsrhere_anonymous_user_id'
} as const;