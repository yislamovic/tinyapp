const returnUser = function(db, email){//searches for user in DB with the given email
for (let user in db){
  if(db[user].email === email){
    return db[user];
  }
}
return undefined;
}

module.exports = { returnUser };