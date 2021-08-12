const urlDatabase = {//database of shorturl as key 
  '5gdd90': {
    longURL: 'www.google.com',
    userID: 'user2RandomID'
  },
  '4fr55y': {
    longURL: 'www.amazon.ca',
    userID: 'userRandomID'
  }
};

const users = {//user database where key is randomly generated userid
  "userRandomID": {
    id: "userRandomID",
    email: "1@1.com",
    password: "1"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

module.exports = { users, urlDatabase };