const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema
const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit', async (req, res) => {
  const { name, mobile, email } = req.body;
  const user = new User({ name, mobile, email });
  await user.save();
  res.send('Submitted successfully! <br><a href="/">Back</a>');
});

app.get('/users', async (req, res) => {
  const users = await User.find();
  let response = <h2>Saved Users</h2>;
  users.forEach(user => {
    response += <p>${user.name} | ${user.mobile} | ${user.email}</p>;
  });
  response += <br><a href="/">Back</a>;
  res.send(response);
});

// Start Server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
