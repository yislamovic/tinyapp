var cookieParser = require('cookie-parser')
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

function generateRandomString() {
  let alphaNum = Math.random().toString(32);
  return alphaNum.split('').splice(5, 6).join('');
}
// console.log(generateRandomString());

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
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
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

app.get("/register", (req, res) => {
  const templateVars = {username: req.cookies["username"], users};
  res.render("reg", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"], users};
  res.render("urls_index", templateVars);
  console.log(req.cookies["username"]);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"], users
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL/", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], 
    username: req.cookies["username"], users};
  res.render("urls_show", templateVars);
  
});

app.get(`/u/:shortURL`, (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  let shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  console.log(urlDatabase);
  res.redirect(`/urls/`);
});

app.post(`/urls/:shortURL`, (req, res) => {
  let value = req.body.updatedUrl;
  urlDatabase[req.params.shortURL] = value;
  res.redirect('/urls');
});

app.post(`/login`, (req, res) => {
  let username = req.body.username;
  res.cookie("username", username);
  res.redirect('/urls');
});

app.post(`/logout`, (req, res) => {
  res.clearCookie("username");
  res.redirect('/urls');
});

app.post(`/register`, (req, res) => {
  const id = generateRandomString();
  users[id] = {id: id, email: req.body.email, password: req.body.password };
  res.cookie("user_id", id);
  console.log(res.cookie());
  res.redirect('/urls');
  console.log(users);
});




