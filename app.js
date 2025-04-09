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
const ExpressError = require('./utilities/ExpressError');
const session = require("express-session");
const Comment = require('./models/comment')
const User = require('./models/user');

const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users')
const commentsRoutes = require('./routes/comments');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require('passport-local');


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

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
}

};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());


app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/posts', postsRoutes);
app.use('/', usersRoutes);
app.use('/posts/:id/comments', commentsRoutes);



app.get('/',(req, res)=>{
  res.render('home')
})

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