const MAL_CLIENT_ID = "process.env.MAL_CLIENT_ID";

export async function searchAnime(query) {
  const res = await fetch(`https://api.myanimelist.net/v2/anime?q=${query}&limit=10`, {
    headers: {
      "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID,
    },
  });
  return res.json();
}
