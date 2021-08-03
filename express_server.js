
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
app.set("view engine", "ejs"); //ejs template

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.longURL] };
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





