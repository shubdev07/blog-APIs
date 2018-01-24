//require from node modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//mongodb connection configuration
mongoose.connect("mongodb://localhost:27017/blogApp", err => {
  if (err) {
    return console.log("MongoDB connection failed");
  }
  console.log("MongoDB connction established");
});

//require all custom modules
var BlogModel = require("./models/blogModel");

//create an instance of express
var app = express();

//configure necessary middlewares
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the root route");
});

//API to create a new blog
app.post("/blog/create", (req, res) => {
  var blog = new BlogModel({
    title: req.body.title,
    subTitle: req.body.subTitle,
    body: req.body.body,
    author: req.body.author
  });
  blog.save((err, doc) => {
    if (err) {
      console.log(err);
      return res.status(406).send(err);
    } else {
      return res.status(201).json({
        message: "Your blog has been added successfully.",
        data: doc
      });
    }
  });
});

//API to view all blogs
app.get("/blog/all", (req, res) => {
  BlogModel.find({}, (err, docs) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).json({
        message: "All Blogs fetched successfully.",
        data: docs
      });
    }
  });
});

//API to view a partiular blog by id
app.get("/blog/:id", (req, res) => {
  BlogModel.findById({ _id: req.params.id }, (err, doc) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!doc) {
      return res.status(404).json({
        message: "No such blog exists."
      });
    } else {
      return res.status(200).json({
        message: "Blog fetched successfully.",
        data: doc
      });
    }
  });
});

//API to view blogs of a particular author
app.get("/blog/author/:author", (req, res) => {
  BlogModel.find({ author: req.params.author }, (err, docs) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!docs.length) {
      return res.status(404).json({
        message: "No such blog exists."
      });
    } else {
      return res.status(200).json({
        message: "Blog fetched successfully.",
        data: docs
      });
    }
  });
});

//API to edit a blog
app.post("/blog/:id/edit", (req, res) => {
  BlogModel.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true },
    (err, doc) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!doc) {
        return res.status(404).json({
          message: "No such blog exists."
        });
      } else {
        return res.status(200).json({
          message: "Blog updated successfully.",
          data: doc
        });
      }
    }
  );
});

//API to delete a blog
app.get("/blog/:id/remove", (req, res) => {
  BlogModel.findByIdAndRemove({ _id: req.params.id }, (err, doc) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!doc) {
      return res.status(404).json({
        message: "No such blog exists."
      });
    } else {
      return res.status(200).json({
        message: "Blog deleted successfully.",
        data: doc
      });
    }
  });
});

//start the server
app.listen(3000, () =>
  console.log("Express server is listening at port 3000!")
);
