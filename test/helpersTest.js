const { assert } = require('chai');
const { users } = require('../express_server.js');
const { returnUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = returnUser(users, "1@1.com")
    const expectedOutput = users["userRandomID"];
    // Write your assert statement here
    assert.equal(expectedOutput, user);
  });
  it('should return undefined when user not found', function() {
    const user = returnUser(users, "1@2.com")
    const expectedOutput = undefined;
    // Write your assert statement here
    assert.equal(expectedOutput, user);
  });
});