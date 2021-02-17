const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const proSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true
    },
    firstName: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"]
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"]
    },
    profilePicture: {
      type: String
    },
    portfolio: {
      type: String
    },
    occupation: [{ type: Schema.Types. ObjectId, ref: "Job" }]
  },
  {
    timestamps: true
  }
);

module.exports = model("Pro", proSchema);
