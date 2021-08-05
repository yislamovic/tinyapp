const returnUser = function(db, email){
for (let user in db){
  if(db[user].email === email){
    return db[user];
  }
}
return false;
}

module.exports = { returnUser };