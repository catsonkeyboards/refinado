// spotifyAPI.js

export async function fetchAllUserPlaylists(accessToken) {
  let url = "https://api.spotify.com/v1/me/playlists?limit=50"; // Max limit is 50
  let allPlaylists = [];

  while (url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      // Token has expired, handle it here
      return;
    }

    const data = await response.json();
    allPlaylists = allPlaylists.concat(data.items);

    url = data.next; // The URL for the next set of items
  }

  return allPlaylists; // This will be an array of all playlist objects
}

export async function fetchPlaylistTracks(accessToken, playlistId) {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    // Token has expired, handle it here
    return;
  }

  const data = await response.json();
  return data.items; // This will be an array of track objects
}
