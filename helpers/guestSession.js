// Guest Session Management for Demo Mode
const { v4: uuidv4 } = require('uuid');

// In-memory storage for guest sessions
const guestSessions = new Map();

// Cleanup interval (30 minutes)
const CLEANUP_INTERVAL = 30 * 60 * 1000;
// Session expiry (2 hours)
const SESSION_EXPIRY = 2 * 60 * 60 * 1000;

// Demo URLs template
const DEMO_URLS = {
  'abc123': {
    longURL: 'https://www.google.com',
    clicks: 42,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clickHistory: [
      { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), ip: '192.168.1.1' },
      { timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), ip: '192.168.1.2' }
    ]
  },
  'xyz789': {
    longURL: 'https://github.com',
    clicks: 28,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clickHistory: [
      { timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), ip: '192.168.1.3' }
    ]
  },
  'def456': {
    longURL: 'https://www.youtube.com',
    clicks: 15,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clickHistory: []
  },
  'ghi789': {
    longURL: 'https://www.linkedin.com',
    clicks: 8,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clickHistory: []
  }
};

// Create a new guest session
function createGuestSession() {
  const sessionId = uuidv4();
  const guestUser = {
    id: `guest_${sessionId}`,
    email: 'guest@demo.tinyapp',
    isGuest: true,
    createdAt: Date.now()
  };

  // Deep clone demo URLs for this session
  const urls = JSON.parse(JSON.stringify(DEMO_URLS));

  // Add userID to all demo URLs
  Object.keys(urls).forEach(shortURL => {
    urls[shortURL].userID = guestUser.id;
  });

  guestSessions.set(sessionId, {
    user: guestUser,
    urls: urls,
    createdAt: Date.now()
  });

  console.log(`Created guest session: ${sessionId}`);
  return { sessionId, user: guestUser };
}

// Get guest session
function getGuestSession(sessionId) {
  if (!sessionId || !guestSessions.has(sessionId)) {
    return null;
  }

  const session = guestSessions.get(sessionId);

  // Check if session has expired
  if (Date.now() - session.createdAt > SESSION_EXPIRY) {
    guestSessions.delete(sessionId);
    console.log(`Expired guest session: ${sessionId}`);
    return null;
  }

  return session;
}

// Update guest session URLs
function updateGuestUrls(sessionId, urls) {
  const session = getGuestSession(sessionId);
  if (session) {
    session.urls = urls;
    guestSessions.set(sessionId, session);
  }
}

// Get guest URLs
function getGuestUrls(sessionId) {
  const session = getGuestSession(sessionId);
  return session ? session.urls : {};
}

// Cleanup old sessions
function cleanupOldSessions() {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [sessionId, session] of guestSessions.entries()) {
    if (now - session.createdAt > SESSION_EXPIRY) {
      guestSessions.delete(sessionId);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log(`Cleaned up ${cleanedCount} expired guest session(s)`);
  }
}

// Start cleanup interval
setInterval(cleanupOldSessions, CLEANUP_INTERVAL);

module.exports = {
  createGuestSession,
  getGuestSession,
  updateGuestUrls,
  getGuestUrls
};
