const mongoose = require("mongoose");
const { Schema } = mongoose;
const missionSchema = new Schema({
  reportId: {
    type: Number,
    unique: true,
  },
  ids: {
    type: Object,
    required: true,
  },
  why: {
    type: String,
  },
  content: {
    type: Object,
    required: true,
  },
  guilty: {
    type: Boolean,
    default: false,
  },
  processing: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model(`report`, missionSchema);
