if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const app = express();

const mongoose = require("mongoose");
const Post = require("./models/post"); 
const path = require('path');



const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/Glam-box';



mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
  serverSelectionTimeoutMS: 10000 // Increase timeout
})
.then(() => console.log("Database connected successfully"))
.catch(err => console.log("Database connection error:", err));
app.use(express.static(path.join(__dirname, 'public')));


const seedDB = async () => {
  await Post.deleteMany({}); // Clear existing posts
  await Post.insertMany([
    {
      title: "Sunset Over the Ocean",
      image: "/images/pika.jpeg",  
      caption: "A beautiful view of the ocean at sunset.",
      author: "67f4fc618bc8e6507290fc35"

    },
    {
      title: "Mountain Adventure",
      image: "/images/noheart.png", 
      caption: "A thrilling hike through the mountains.",
      author: "67f4fc618bc8e6507290fc35"

    },
    {
      title: "City Lights",
      image: "/images/photostarlogo.png",  
      caption: "A night view of the city illuminated by lights.",
      author: "67f4fc618bc8e6507290fc35"

    },
  ]);
  console.log("Database seeded with 3 posts!");
  mongoose.connection.close();
};
seedDB();
