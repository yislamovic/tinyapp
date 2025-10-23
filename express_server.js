const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
const PORT = 3000; // default port 3000
const bcrypt = require('bcrypt');

const { users, urlDatabase } = require('./helpers/database');
const { returnUser, returnID, generateRandomString } = require('./helpers/helpers');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_KEY || 'dev-secret-key-change-in-production'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(express.static('public')); // Serve static files
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
  const baseURL = `${req.protocol}://${req.get('host')}`;
  const templateVars = { user, urls, baseURL };
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

app.get("/dashboard", (req, res) => {//renders analytics dashboard
  const user = req.session.user;
  if (!user) {
    res.redirect('/login');
    return;
  }

  const urls = urlDatabase;
  const userUrls = [];
  let totalClicks = 0;
  let totalUrls = 0;

  for (let url in urls) {
    if (urls[url].userID === user.id) {
      const urlData = urls[url];
      const clicks = urlData.clicks || 0;
      userUrls.push({
        shortURL: url,
        longURL: urlData.longURL,
        clicks: clicks,
        createdAt: urlData.createdAt || new Date().toISOString().split('T')[0],
        clickHistory: urlData.clickHistory || []
      });
      totalClicks += clicks;
      totalUrls++;
    }
  }

  // Sort by clicks descending
  userUrls.sort((a, b) => b.clicks - a.clicks);

  const baseURL = `${req.protocol}://${req.get('host')}`;
  const templateVars = {
    user,
    userUrls,
    totalClicks,
    totalUrls,
    avgClicks: totalUrls > 0 ? Math.round(totalClicks / totalUrls) : 0,
    baseURL
  };
  res.render("dashboard", templateVars);
});

app.get("/urls/:shortURL/", (req, res) => {//renders the shorturl with link and update
  const user = req.session.user;

  if (!user) {
    res.status(400).send('Please login');
    return;
  }

  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send('URL not found');
    return;
  }

  const lurl = urlDatabase[req.params.shortURL].longURL;

  if (user.id !== returnID(urlDatabase, req.params.shortURL)) {
    res.status(403).send('Forbidden Access');
    return;
  }

  const baseURL = `${req.protocol}://${req.get('host')}`;
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: lurl,
    user,
    baseURL
  };

  res.render("urls_show", templateVars);
});

app.get(`/u/:shortURL`, (req, res) => {//redirects the user to the long url link 
  if (urlDatabase[req.params.shortURL] === undefined) {
    res.status(404).send("That URL does not exist; make sure your URLs start with http:// ");
    return;
  }
  
  // Track the click
  const urlData = urlDatabase[req.params.shortURL];
  if (!urlData.clicks) urlData.clicks = 0;
  if (!urlData.clickHistory) urlData.clickHistory = [];
  
  urlData.clicks++;
  urlData.clickHistory.push({
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress || 'unknown'
  });
  
  const longURL = urlData.longURL;
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {//post: generates a shortURL for the given long and stores it in DB
  const user = req.session.user;
  if (!user) {
    res.status(401).send('Please log in to create URLs');
    return;
  }
  
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { 
    longURL: req.body.longURL, 
    userID: user.id,
    clicks: 0,
    createdAt: new Date().toISOString().split('T')[0],
    clickHistory: []
  };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {//post: deletes record in DB
  const user = req.session.user;
  const shortURL = req.params.shortURL;

  if (!user) {
    res.status(401).send('Please login to delete URLs');
    return;
  }

  if (!urlDatabase[shortURL]) {
    res.status(404).send('URL not found');
    return;
  }

  if (user.id !== returnID(urlDatabase, shortURL)) {
    res.status(403).send('You can only delete your own URLs');
    return;
  }

  delete urlDatabase[shortURL];
  res.redirect(`/urls/`);
});

app.post(`/urls/:shortURL`, (req, res) => {//post: updates the long url in DB
  const user = req.session.user;
  const shortURL = req.params.shortURL;

  if (!user) {
    res.status(401).send('Please login');
    return;
  }

  if (!urlDatabase[shortURL]) {
    res.status(404).send("URL not found");
    return;
  }

  if (user.id !== returnID(urlDatabase, shortURL)) {
    res.status(403).send('You can only edit your own URLs');
    return;
  }

  const value = req.body.updatedUrl;
  urlDatabase[shortURL].longURL = value;
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
    return;
  }
  if (!user) {//if the user is not within the DB
    res.status(404);
    res.send('That email is not registered!');
    return;
  }
  if (bcrypt.compareSync(req.body.password, user.password)) {//checks the hashed password in the DB 
    req.session.user = user;//load user in cookie session
    res.redirect('/urls');
  } else {
    res.status(403);
    res.send('The passwords do not match!');
  }
});



