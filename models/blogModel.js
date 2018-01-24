const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var blogModel = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Title of a blog is a required field"]
    },
    subTitle: {
      type: String,
      trim: true,
      default: ""
    },
    description: {
      type: String
    },
    author: {
      type: String,
      trim: true,
      default: "Anonymous",
      lowercase: true
    }
  },
  {
    runSettersOnQuery: true,
    timestamps: {
      createdAt: "created",
      updatedAt: "updated"
    }
  }
);

module.exports = mongoose.model("BlogModel", blogModel);
