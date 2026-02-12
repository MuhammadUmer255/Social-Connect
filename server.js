const express = require("express");
const app = express();
const db = require("./db");
// const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const socialRoutes = require("./routes/socialRoutes");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const storyRoutes = require("./routes/storyRoutes");
const isLoggedIn = require('./middleware/isLoggedIn');


app.use(express.json());

// 2. Static Folder
app.use('/uploads', express.static('uploads'));

// 3. Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", isLoggedIn, userRoutes);
app.use("/api/posts", isLoggedIn, postRoutes);
app.use("/api/social", isLoggedIn, socialRoutes);
app.use("/api/stories", isLoggedIn, storyRoutes);

const port = 3500;
app.listen(port, () => {
  console.log("Server is running on port 3500");
}); 