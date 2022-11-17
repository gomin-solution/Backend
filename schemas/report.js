const mongoose = require("mongoose");
const { Schema } = mongoose;
const missionSchema = new Schema({
  reportId: {
    type: Number,
    unique: true,
  },
  reporterId: {
    type: Number,
    required: true,
  },
  suspectId: {
    type: Number,
    required: true,
  },
  targetId: {
    type: Number,
    required: true,
  },
  targetName: {
    type: String,
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
});

module.exports = mongoose.model(`report`, missionSchema);
