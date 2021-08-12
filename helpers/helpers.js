const returnUser = function(db, email){//searches for user in DB with the given email
for (let user in db){
  if(db[user].email === email){
    return db[user];
  }
}
return undefined;
}

const returnID = function(db, shortURL){//searches for the corresponding user id associated with the urlß
  for (let user in db){
    if(user.toString() === shortURL.toString()){
      return db[user].userID;
    }
  }
  return undefined;
}

const generateRandomString = function () {//function that generated a randome string of chars and nums
  const alphaNum = Math.random().toString(32);
  return alphaNum.split('').splice(5, 6).join('');
};

module.exports = { returnUser, returnID, generateRandomString };