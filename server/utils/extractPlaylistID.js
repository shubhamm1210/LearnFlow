const extractPlaylistID = (url) => {
  try {
    const parsed = new URL(url);

    const playlistId = parsed.searchParams.get("list");

    return playlistId || null;
  } catch {
    return null;
  }
};

module.exports = extractPlaylistID;
