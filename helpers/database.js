const urlDatabase = {//database of shorturl as key 
  'b6UTxQ': {
    longURL: 'https://www.google.com',
    userID: 'aJ48lW'
  },
  'i3BoGr': {
    longURL: 'https://www.amazon.ca',
    userID: 'aJ48lW'
  },
  's7K9mP': {
    longURL: 'https://github.com',
    userID: 'b8Hq2N'
  },
  'x4N8dF': {
    longURL: 'https://stackoverflow.com',
    userID: 'b8Hq2N'
  },
  'p2L6vT': {
    longURL: 'https://www.youtube.com',
    userID: 'c9Rz3M'
  },
  'h5W1nK': {
    longURL: 'https://www.netflix.com',
    userID: 'c9Rz3M'
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