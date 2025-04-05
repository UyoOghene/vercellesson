if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose')
const port = 4005; 
const path = require('path');
const Post = require("./models/post");
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/Glam-box';



mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
  serverSelectionTimeoutMS: 10000 // Increase timeout
})
.then(() => console.log("Database connected successfully"))
.catch(err => console.log("Database connection error:", err));


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


// Home Route
app.get('/', async(req, res) => {
  const posts = await Post.find({}); 
  res.render('home',{posts});
});
app.get("/posts/new", (req, res)=>{
  res.render('posts/new')
})

app.post('/', async(req, res) => {
  try {
    console.log('Received data:', req.body); // Keep this for debugging
    
    // Correct destructuring from req.body.post
    const { caption, image, title } = req.body.post;

    const newpost = new Post({
      caption: caption.trim(),
      title: title.trim(),
      image: image.trim()
    });

    const savedPost = await newpost.save();
    console.log('Saved post:', savedPost);
    res.redirect('/');
  } catch (e) {
    console.error('Error saving post:', e);
    res.redirect('/posts/new');
  }
});
app.get('/posts/:id',async(req,res)=>{
  const post = await Post.findById(req.params.id);
  post.save();
  console.log(post.image)
  res.render('posts/show',{post})
})



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});