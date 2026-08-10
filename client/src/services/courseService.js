import api from "../api/axios";

export const getMyCourses = async () => {
  const response = await api.get("/course");
  return response.data;
};

export const importPlaylist = async (playlistUrl) => {
  const response = await api.post("/course/import", { playlistUrl });
  return response.data;
};

export const getCourse = async (courseId) => {
  const response = await api.get(`/course/${courseId}`);
  return response.data;
};

export const toggleVideoComplete = async (courseId, videoId) => {
  const response = await api.put(`/course/${courseId}/video/${videoId}`);
  return response.data;
};
