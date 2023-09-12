// spotifyAPI.js 

export async function fetchUserPlaylists(accessToken) {
    const url = 'https://api.spotify.com/v1/me/playlists';
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  
    if (response.status === 401) {
      // Token has expired, handle it here
      return;
    }
  
    const data = await response.json();
    return data.items; // This will be an array of playlist objects
  }
  