const express = require('express');
const app = express();
const port = 4005; // or any port you prefer
const path = require('path');
const Post = require("./models/post");
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');



app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


// Home Route
// app.get('/', async(req, res) => {
//   const posts = await Post.find({}); 
//   res.render('home',{posts});
// });
app.get('/', (req, res) => {
  res.render('home');
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});