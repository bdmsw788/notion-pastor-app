// Free-to-use photos from Unsplash (Unsplash License: free for commercial use,
// no attribution required). Hotlinked directly from Unsplash's CDN.
function unsplash(id: string, width: number): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=70`;
}

export const photos = {
  churchInterior: unsplash("photo-1668265704786-5a55ef06b4d7", 1200),
  openBible: unsplash("photo-1759333344343-d34779c0e2ac", 1200),
  prayingHands: unsplash("photo-1752667842664-e84670e41f33", 1200),
};
