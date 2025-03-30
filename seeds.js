const mongoose = require("mongoose");
const Post = require("./models/post"); // Ensure the Post model exists

mongoose.connect("mongodb://127.0.0.1:27017/Glam-box", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await Post.deleteMany({}); // Clear existing posts
  await Post.insertMany([
    {
      title: "Sunset Over the Ocean",
      image: "https://source.unsplash.com/random/1",
      caption: "A beautiful view of the ocean at sunset.",
    },
    {
      title: "Mountain Adventure",
      image: "https://source.unsplash.com/random/2",
      caption: "A thrilling hike through the mountains.",
    },
    {
      title: "City Lights",
      image: "https://source.unsplash.com/random/3",
      caption: "A night view of the city illuminated by lights.",
    },
  ]);
  console.log("Database seeded with 3 posts!");
  mongoose.connection.close();
};

seedDB();
