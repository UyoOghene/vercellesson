const express = require('express');
const app = express();
const port = 4005; // or any port you prefer

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});