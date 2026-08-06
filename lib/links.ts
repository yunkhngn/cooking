/**
 * The model is forbidden from emitting URLs (spec §4). All external links
 * are search queries constructed here from the dish name, so a fabricated
 * link is structurally impossible.
 */
export function youtubeSearchUrl(dishName: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${dishName} cách làm`)}`;
}

export function googleSearchUrl(dishName: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`${dishName} công thức`)}`;
}
