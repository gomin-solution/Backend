const mongoose = require("mongoose");
const { Schema } = mongoose;
const missonSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(`Misson`, missonSchema);
