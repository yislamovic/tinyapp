const urlDatabase = {//database of shorturl as key 
  'b6UTxQ': {
    longURL: 'https://www.google.com',
    userID: 'aJ48lW',
    clicks: 24,
    createdAt: '2025-01-15',
    clickHistory: [
      { timestamp: '2025-01-15T10:30:00Z', ip: '192.168.1.1' },
      { timestamp: '2025-01-16T14:22:00Z', ip: '192.168.1.2' }
    ]
  },
  'i3BoGr': {
    longURL: 'https://www.amazon.ca',
    userID: 'aJ48lW',
    clicks: 18,
    createdAt: '2025-01-16',
    clickHistory: [
      { timestamp: '2025-01-16T09:15:00Z', ip: '192.168.1.3' }
    ]
  },
  's7K9mP': {
    longURL: 'https://github.com',
    userID: 'b8Hq2N',
    clicks: 42,
    createdAt: '2025-01-14',
    clickHistory: [
      { timestamp: '2025-01-14T16:45:00Z', ip: '192.168.1.4' },
      { timestamp: '2025-01-15T11:20:00Z', ip: '192.168.1.5' }
    ]
  },
  'x4N8dF': {
    longURL: 'https://stackoverflow.com',
    userID: 'b8Hq2N',
    clicks: 31,
    createdAt: '2025-01-17',
    clickHistory: [
      { timestamp: '2025-01-17T13:10:00Z', ip: '192.168.1.6' }
    ]
  },
  'p2L6vT': {
    longURL: 'https://www.youtube.com',
    userID: 'c9Rz3M',
    clicks: 67,
    createdAt: '2025-01-13',
    clickHistory: [
      { timestamp: '2025-01-13T20:30:00Z', ip: '192.168.1.7' },
      { timestamp: '2025-01-14T08:45:00Z', ip: '192.168.1.8' }
    ]
  },
  'h5W1nK': {
    longURL: 'https://www.netflix.com',
    userID: 'c9Rz3M',
    clicks: 12,
    createdAt: '2025-01-18',
    clickHistory: [
      { timestamp: '2025-01-18T19:00:00Z', ip: '192.168.1.9' }
    ]
  }
};

const users = {//user database where key is randomly generated userid
  "aJ48lW": {
    id: "aJ48lW",
    email: "demo@example.com",
    password: "$2b$10$XETWsKXucOMlot2cTi3FwelHlQFjacj42rUbioS7oVKGUwMvB/nsC" // password: "demo123"
  },
  "b8Hq2N": {
    id: "b8Hq2N",
    email: "user2@example.com",
    password: "$2b$10$XETWsKXucOMlot2cTi3FwelHlQFjacj42rUbioS7oVKGUwMvB/nsC" // password: "demo123"
  },
  "c9Rz3M": {
    id: "c9Rz3M",
    email: "alice@example.com",
    password: "$2b$10$XETWsKXucOMlot2cTi3FwelHlQFjacj42rUbioS7oVKGUwMvB/nsC" // password: "demo123"
  }
};

module.exports = { users, urlDatabase };