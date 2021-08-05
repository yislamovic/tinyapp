const userSelect = function (userObject, cookieObj){
  for(let user in userObject){
    for(let cookie in cookieObj){
      if(user === cookieObj[cookie]){
        return user;
      }
    }
  }
  return undefined;
};
module.exports = { userSelect };

