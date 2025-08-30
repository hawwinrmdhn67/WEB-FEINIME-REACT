// src/api/mal.js
const CLIENT_ID = "492d63e258c23114981f07862ec45c95";

export async function searchAnime(query) {
  const res = await fetch(`https://api.myanimelist.net/v2/anime?q=${query}&limit=10`, {
    headers: {
      "X-MAL-CLIENT-ID": CLIENT_ID,
    },
  });
  return res.json();
}
