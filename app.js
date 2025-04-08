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
const {postSchema}= require('./schemas')
const {commentSchema} = require('./schemas')
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError')
const Comment = require('./models/comment')
const posts = require('./routes/posts');
const comments = require('./routes/comments') 

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


app.use('/posts', posts);
app.use('/posts/:id/comments', comments)
// Home Route
app.get('/', async(req, res) => {
  const posts = await Post.find({}); 
  res.render('home',{posts});
});

app.get("/posts/new", (req, res)=>{
  res.render('posts/new')
})

app.post('/', catchAsync(async(req, res) => {
  const { caption, title, image } = req.body.post; 
      const newpost = new Post({
      caption: caption.trim(),
      title: title.trim(),
      image: image.trim()
    });

    const savedPost = await newpost.save();
    console.log('Saved post:', savedPost);
    res.redirect(`/posts/${savedPost._id}`);
  
}));

// Add a comment to a post

app.all('*', (req,res, next) => {
  next(new ExpressError('page not found', 404))
})

app.use((err, req,res, next) => {
  const {statusCode = 500, message = 'something wrong'} = err;
  res.status(statusCode).render('error',{err})
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});