mongoose.set('strictQuery', false)
import path from "path"
import express from "express"
import mongoose from "mongoose";
import cookiePaser from "cookie-parser";

import dotenv from "dotenv"
dotenv.config();

import Blog from "./models/blog.js"

import userRoute from "./routes/user.js"
import blogRoute from "./routes/blog.js"
import checkForAuthenticationCookie from "./middlewares/authentication.js"

const app = express();
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URL, { dbName: "database", useNewUrlParser: true })
  .then((e) => console.log("MongoDB Connected"));


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log("server running at http://localhost:3000"));
