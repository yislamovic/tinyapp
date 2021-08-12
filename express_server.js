const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcrypt');

const { users, urlDatabase } = require('./helpers/database');
const { returnUser, returnID, generateRandomString } = require('./helpers/helpers');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));
app.set("view engine", "ejs"); //ejs template

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {//renders home page
  const user = req.session.user;
  if (user) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {//renders login page
  const urls = urlDatabase;
  const user = req.session.user;
  const templateVars = { user, urls };
  res.render("login", templateVars);
});

app.get("/register", (req, res) => {//renders register page
  const user = req.session.user;
  const templateVars = { user };
  if (user) {
    res.send('You need to sign out before you can create a new account!');
  } else {
    res.render("register", templateVars);
  }
});

app.get("/urls", (req, res) => {//renders url page
  const urls = urlDatabase;
  const user = req.session.user;
  const templateVars = { user, urls };
  if (user) {
    res.render("urls_index", templateVars);
  }
  else {
    res.redirect('login');
  }

});

app.get("/urls/new", (req, res) => {//renders the submission form for new url
  const urls = urlDatabase;
  const user = req.session.user;
  const templateVars = { user, urls };
  if (user) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/login');
  }
});

app.get("/urls/:shortURL/", (req, res) => {//renders the shorturl with link and update
  const user = req.session.user;
  const lurl = urlDatabase[req.params.shortURL].longURL;

  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: lurl, user
  };

  if (!user) {
    res.status(400).send('Please login');
  }
  else {
    if (user.id !== returnID(urlDatabase, req.params.shortURL)) {
      res.status(403).send('Forbidden Access');
    }
  }

  res.render("urls_show", templateVars);
});

app.get(`/u/:shortURL`, (req, res) => {//redirects the user to the long url link 
  if (urlDatabase[req.params.shortURL] === undefined) {
    res.status(404).send("That URL does not exist; make sure your URLs start with http:// ");
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {//post: generates a shortURL for the given long and stores it in DB
  const user = req.session.user;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: user.id };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {//post: deletes record in DB
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls/`);
});

app.post(`/urls/:shortURL`, (req, res) => {//post: updates the long url in DB
  const user = req.session.user;
  if (urlDatabase[req.params.shortURL] === undefined) {
    res.status(404).send("Database Error");
  }
  if (!user) {
    res.status(400).send('Please login');
  }
  else {
    if (user.id !== returnID(urlDatabase, req.params.shortURL)) {
      res.status(403).send('Forbidden Access');
    }
  }
  const value = req.body.updatedUrl;
  urlDatabase[req.params.shortURL].longURL = value;
  res.redirect('/urls');
});


app.post(`/logout`, (req, res) => {//post: clears cookies and logs out
  req.session = null;
  res.redirect('/login');
});

app.post(`/register`, (req, res) => {//post: creates id for user; hashes password;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = generateRandomString();
  const user = returnUser(users, req.body.email);//checks if email is already registered
  if (user) {
    res.status(400);
    res.send('That email is already registered!');
  } else if (req.body.email === "") {//checks the email body if empty
    res.status(400);
    res.send('The email is empty!');
  } else if (req.body.password === "") {//checks the email body if empty
    res.status(400);
    res.send('The password is empty!');
  } else {
    users[id] = { id: id, email: req.body.email, password: hashedPassword };//records the user in DB
    req.session.user = users[id];//places user cookie in session
    res.redirect('/urls');
  }
});

app.post('/login', (req, res) => {//post: checks if user in DB; checks for matching hashed passwords
  const user = returnUser(users, req.body.email);
  if (req.body.email === "") {//checks if email body is empty
    res.status(400);
    res.send('The email is empty!');
  }
  if (!user) {//if the user is not within the DB
    res.status(404);
    res.send('That email is not registered!');
  } else {
    if (bcrypt.compareSync(req.body.password, user.password)) {//checks the hashed password in the DB 
      req.session.user = user;//load user in cookie session
      res.redirect('urls');
    } else {
      res.status(403);
      res.send('The passwords do not match!');
    }
  }
});



