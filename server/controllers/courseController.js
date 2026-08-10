const axios = require("axios");
const extractPlaylistID = require("../utils/extractPlaylistID");
const Course = require("../models/Course");
const { classifyTitle } = require("../utils/topicClassifier");

const getYouTubePlaylistInfo = async (playlistId) => {
  const response = await axios.get(
    "https://www.googleapis.com/youtube/v3/playlists",
    {
      params: {
        part: "snippet",
        id: playlistId,
        key: process.env.YOUTUBE_API_KEY,
      },
    }
  );

  const playlist = response.data.items?.[0];

  if (!playlist) {
    throw new Error("YouTube playlist not found or inaccessible");
  }

  return {
    title: playlist.snippet.title,
    thumbnail:
      playlist.snippet.thumbnails?.high?.url ||
      playlist.snippet.thumbnails?.medium?.url ||
      playlist.snippet.thumbnails?.default?.url ||
      "",
  };
};

exports.importPlaylist = async (req, res) => {
  try {
    const { playlistUrl } = req.body;

    if (!playlistUrl?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Playlist URL required",
      });
    }

    const playlistId = extractPlaylistID(playlistUrl.trim());

    if (!playlistId) {
      return res.status(400).json({
        success: false,
        message: "Invalid YouTube playlist URL",
      });
    }

    const playlistInfo = await getYouTubePlaylistInfo(playlistId);

    const allVideos = [];
    let nextPageToken = "";

    do {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/playlistItems",
        {
          params: {
            part: "snippet",
            maxResults: 50,
            playlistId,
            ...(nextPageToken ? { pageToken: nextPageToken } : {}),
            key: process.env.YOUTUBE_API_KEY,
          },
        }
      );

      const currentVideos = (response.data.items || [])
        .filter((video) => video.snippet?.resourceId?.videoId)
        .map((video) => ({
          title: video.snippet.title,
          videoId: video.snippet.resourceId.videoId,
          thumbnail:
            video.snippet.thumbnails?.high?.url ||
            video.snippet.thumbnails?.medium?.url ||
            video.snippet.thumbnails?.default?.url ||
            "",
          position: video.snippet.position,
          ...classifyTitle(video.snippet.title),
        }));

      allVideos.push(...currentVideos);
      nextPageToken = response.data.nextPageToken || "";
    } while (nextPageToken);

    if (allVideos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "The playlist contains no accessible videos",
      });
    }

    const course = await Course.create({
      user: req.user._id,
      playlistId,
      playlistTitle: playlistInfo.title,
      thumbnail: playlistInfo.thumbnail,
      totalVideos: allVideos.length,
      progress: 0,
      videos: allVideos,
    });

    return res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("IMPORT PLAYLIST ERROR:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to import playlist",
    });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.json(courses);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.json(course);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.toggleVideoComplete = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;

    const course = await Course.findOne({
      _id: courseId,
      user: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const video = course.videos.id(videoId);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    video.completed = !video.completed;
    video.watchedAt = video.completed ? new Date() : null;

    const completedVideos = course.videos.filter(
      (item) => item.completed
    ).length;

    course.progress =
      course.totalVideos > 0
        ? Math.round((completedVideos / course.totalVideos) * 100)
        : 0;

    await course.save();

    return res.json(course);
  } catch (err) {
    console.error("TOGGLE VIDEO ERROR:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
};
