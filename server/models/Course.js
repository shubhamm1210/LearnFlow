const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoId: { type: String, required: true },
  thumbnail: String,
  position: Number,

  // A video may naturally belong to more than one topic.
  topics: {
    type: [String],
    default: ["General"],
  },

  domain: {
    type: String,
    default: "General",
  },

  topicConfidence: {
    type: Number,
    default: 0,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  watchedAt: Date,
});

const courseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    playlistId: String,
    playlistTitle: String,
    thumbnail: String,

    totalVideos: Number,

    progress: {
      type: Number,
      default: 0,
    },

    videos: [videoSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
