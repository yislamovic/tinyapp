var cookieParser = require('cookie-parser')
const { userSelect } = require('./userSelect');
const { foundEmail, returnUser } = require('./checkEmail');
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

function generateRandomString() {
  let alphaNum = Math.random().toString(32);
  return alphaNum.split('').splice(5, 6).join('');
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs"); //ejs template

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
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
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/login", (req, res) => {
  const urls = urlDatabase;
  const user = req.cookies.user; 
  const templateVars = { user, urls };
  res.render("login", templateVars);
});

app.get("/register", (req, res) => {
  let user = req.cookies.user;
  console.log(req.cookies.user);
  const templateVars = { user };
  res.render("register", templateVars);
});

app.get("/urls", (req, res) => {
  const urls = urlDatabase;
  const user = req.cookies.user; 
  const templateVars = { user, urls };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const urls = urlDatabase;
  const user = req.cookies.user; 
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL/", (req, res) => {
  const urls = urlDatabase;
  const user = req.cookies.user; 
  const templateVars = {
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
    user, urls
  };
  res.render("urls_show", templateVars);
});

app.get(`/u/:shortURL`, (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls/`);
});

app.post(`/urls/:shortURL`, (req, res) => {
  let value = req.body.updatedUrl;
  urlDatabase[req.params.shortURL] = value;
  res.redirect('/urls');
});


app.post(`/logout`, (req, res) => {
  console.log(req.cookies);
  res.clearCookie("user");
  res.redirect('/urls');
});

app.post(`/register`, (req, res) => {
  const id = generateRandomString();
  const user = returnUser(users, req.body.email);
  console.log(user, 'returnUser');
  if (user) {
    res.status(400);
    res.send('That email is already registered!');
  }
  else if (user.email === "") {
    res.status(400);
    res.send('The email is empty!');
  }
  else {
    users[id] = { id: id, email: req.body.email, password: req.body.password };
    console.log(users, 'the user DB');
    res.cookie("user", users[id]);
    res.redirect('/urls');
  }  
});

app.post('/login', (req, res) => {
  const user = returnUser(users, req.body.email);
  console.log(user);
  console.log(users);
  if (!user) {
    res.status(403);
    res.send('That email is not registered!');
  }
  else if (user.email === "") {
    res.status(400);
    res.send('The email is empty!');
  }
  else {
    if(user.password === req.body.password){
      res.cookie("user", user);
      res.redirect('urls');
    }
    else {
      res.status(403);
      res.send('The passwords do not match!');
    }
  }
});


