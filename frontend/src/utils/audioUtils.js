export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function clamp(val, min = 0, max = 1) {
  return Math.min(Math.max(val, min), max);
}

export function optimizeImageUrl(url, width = 500) {
  if (!url) return '/images/albums/album-01.jpg';
  if (typeof url === 'string' && url.includes('res.cloudinary.com') && url.includes('/image/upload/') && !url.includes('/f_auto')) {
    return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
}
