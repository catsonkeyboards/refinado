// spotifyAPI.js

const promiseThrottle = new PromiseThrottle({
  requestsPerSecond: 10, // Up to 10 requests per second
  promiseImplementation: Promise
});

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
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  let allTracks = [];

  while (url) {
    const fetchTracks = () => fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).then(response => response.json());

    const data = await promiseThrottle.add(fetchTracks.bind(this));
    allTracks = allTracks.concat(data.items);
    url = data.next;
  }

  return allTracks;
}
