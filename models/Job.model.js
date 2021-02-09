const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const jobSchema = new Schema(
  {
    name: String
  },
  {
    timestamps: true
  }
);

module.exports = model('Job', jobSchema);
