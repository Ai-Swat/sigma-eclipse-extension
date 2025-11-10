// Utility functions

export function isElementInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export function isVideoItem(item: any): boolean {
  if (!item) return false;
  return item.type === 'video' || item.mimeType?.startsWith('video/');
}

export function isImageItem(item: any): boolean {
  if (!item) return false;
  return item.type === 'image' || item.mimeType?.startsWith('image/');
}

export function extractVideoId(url: string): string | null {
  if (!url) return null;
  
  // YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

export function encodeWithSpecialCharacters(str: string): string {
  return encodeURIComponent(str);
}

