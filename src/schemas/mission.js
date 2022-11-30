const mongoose = require("mongoose");
const { Schema } = mongoose;
const missionSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(`Mission`, missionSchema);
