const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
const PORT = 3000; // default port 3000
const bcrypt = require('bcrypt');

const { users, urlDatabase } = require('./helpers/database');
const { returnUser, returnID, generateRandomString } = require('./helpers/helpers');
const { createGuestSession, getGuestSession, getGuestUrls, updateGuestUrls } = require('./helpers/guestSession');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_KEY || 'dev-secret-key-change-in-production'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(express.static('public')); // Serve static files
app.set("view engine", "ejs"); //ejs template

// Helper function to get URLs (guest or database)
function getUserUrls(user, guestSessionId) {
  if (user && user.isGuest && guestSessionId) {
    return getGuestUrls(guestSessionId);
  }
  return urlDatabase;
}

// Helper function to update URLs (guest or database)
function setUserUrls(user, guestSessionId, urls) {
  if (user && user.isGuest && guestSessionId) {
    updateGuestUrls(guestSessionId, urls);
  }
  // For regular users, urlDatabase is updated directly (by reference)
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// Guest mode route - create session and redirect
app.get("/guest", (req, res) => {
  const { sessionId, user } = createGuestSession();
  req.session.user = user;
  req.session.guestSessionId = sessionId;
  res.redirect("/urls");
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
  const user = req.session.user;
  const guestSessionId = req.session.guestSessionId;

  if (!user) {
    res.redirect('login');
    return;
  }

  const urls = getUserUrls(user, guestSessionId);
  const baseURL = `${req.protocol}://${req.get('host')}`;
  const templateVars = { user, urls, baseURL };
  res.render("urls_index", templateVars);
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
  const guestSessionId = req.session.guestSessionId;

  if (!user) {
    res.redirect('/login');
    return;
  }

  const urls = getUserUrls(user, guestSessionId);
  const userUrls = [];
  let totalClicks = 0;
  let totalUrls = 0;

  for (let url in urls) {
    const urlData = urls[url];
    if (urlData && urlData.userID === user.id) {
      const clicks = urlData.clicks || 0;
      userUrls.push({
        shortURL: url,
        longURL: urlData.longURL || '',
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
  const guestSessionId = req.session.guestSessionId;

  if (!user) {
    res.status(400).send('Please login');
    return;
  }

  const urls = getUserUrls(user, guestSessionId);

  if (!urls[req.params.shortURL]) {
    res.status(404).send('URL not found');
    return;
  }

  const lurl = urls[req.params.shortURL].longURL;

  if (user.id !== returnID(urls, req.params.shortURL)) {
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
  const shortURL = req.params.shortURL;
  let urlData = null;
  let isGuestUrl = false;
  let guestSessionId = null;

  // Check if URL exists in database
  if (urlDatabase[shortURL]) {
    urlData = urlDatabase[shortURL];
  }
  // If not in database and user has a guest session, check guest URLs
  else if (req.session.guestSessionId) {
    const guestUrls = getGuestUrls(req.session.guestSessionId);
    if (guestUrls[shortURL]) {
      urlData = guestUrls[shortURL];
      isGuestUrl = true;
      guestSessionId = req.session.guestSessionId;
    }
  }

  if (!urlData) {
    res.status(404).send("That URL does not exist; make sure your URLs start with http:// ");
    return;
  }

  // Track the click
  if (!urlData.clicks) urlData.clicks = 0;
  if (!urlData.clickHistory) urlData.clickHistory = [];

  urlData.clicks++;
  urlData.clickHistory.push({
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress || 'unknown'
  });

  // Update guest session if it's a guest URL
  if (isGuestUrl && guestSessionId) {
    const guestUrls = getGuestUrls(guestSessionId);
    guestUrls[shortURL] = urlData;
    updateGuestUrls(guestSessionId, guestUrls);
  }

  const longURL = urlData.longURL;
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {//post: generates a shortURL for the given long and stores it in DB
  const user = req.session.user;
  const guestSessionId = req.session.guestSessionId;

  if (!user) {
    res.status(401).send('Please log in to create URLs');
    return;
  }

  const shortURL = generateRandomString();
  const urlData = {
    longURL: req.body.longURL,
    userID: user.id,
    clicks: 0,
    createdAt: new Date().toISOString().split('T')[0],
    clickHistory: []
  };

  if (user.isGuest && guestSessionId) {
    const urls = getGuestUrls(guestSessionId);
    urls[shortURL] = urlData;
    updateGuestUrls(guestSessionId, urls);
  } else {
    urlDatabase[shortURL] = urlData;
  }

  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {//post: deletes record in DB
  const user = req.session.user;
  const guestSessionId = req.session.guestSessionId;
  const shortURL = req.params.shortURL;

  if (!user) {
    res.status(401).send('Please login to delete URLs');
    return;
  }

  const urls = getUserUrls(user, guestSessionId);

  if (!urls[shortURL]) {
    res.status(404).send('URL not found');
    return;
  }

  if (user.id !== returnID(urls, shortURL)) {
    res.status(403).send('You can only delete your own URLs');
    return;
  }

  delete urls[shortURL];

  if (user.isGuest && guestSessionId) {
    updateGuestUrls(guestSessionId, urls);
  }

  res.redirect(`/urls/`);
});

app.post(`/urls/:shortURL`, (req, res) => {//post: updates the long url in DB
  const user = req.session.user;
  const guestSessionId = req.session.guestSessionId;
  const shortURL = req.params.shortURL;

  if (!user) {
    res.status(401).send('Please login');
    return;
  }

  const urls = getUserUrls(user, guestSessionId);

  if (!urls[shortURL]) {
    res.status(404).send("URL not found");
    return;
  }

  if (user.id !== returnID(urls, shortURL)) {
    res.status(403).send('You can only edit your own URLs');
    return;
  }

  const value = req.body.updatedUrl;
  urls[shortURL].longURL = value;

  if (user.isGuest && guestSessionId) {
    updateGuestUrls(guestSessionId, urls);
  }

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



