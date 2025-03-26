const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

let todos = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // serve CSS, JS, HTML if needed

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/add', (req, res) => {
  const { task } = req.body;
  if (task) {
    todos.push(task);
  }
  res.redirect('/');
});

app.get('/list', (req, res) => {
  res.json(todos);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
