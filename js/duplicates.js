// duplicates.js

// const duplicates = showDuplicates(currentTracks, currentSortOrder);
// originalDuplicates = [...duplicates]; // Store the original duplicates

// Function to show duplicates
export function showDuplicates(tracks, sortOrder) {
  const trackMap = new Map();
  const duplicates = [];

  tracks.forEach((track) => {
    const trackName = track.track.name;
    const artistName = track.track.artists[0].name;
    const uniqueIdentifier = `${trackName}-${artistName}`;

    if (trackMap.has(uniqueIdentifier)) {
      trackMap.set(uniqueIdentifier, trackMap.get(uniqueIdentifier) + 1);
    } else {
      trackMap.set(uniqueIdentifier, 1);
    }
  });

  tracks.forEach((track) => {
    const trackName = track.track.name;
    const artistName = track.track.artists[0].name;
    const uniqueIdentifier = `${trackName}-${artistName}`;

    if (trackMap.get(uniqueIdentifier) > 1) {
      duplicates.push(track);
    }
  });

  if (sortOrder === "title") {
    duplicates.sort((a, b) => a.track.name.localeCompare(b.track.name));
  } else if (sortOrder === "artist") {
    duplicates.sort((a, b) =>
      a.track.artists[0].name.localeCompare(b.track.artists[0].name)
    );
  }

  return duplicates;
}
