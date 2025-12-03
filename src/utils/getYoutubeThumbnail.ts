export function getYoutubeThumbnail(link: string, quality: string = 'hqdefault'): string {
    const match = link.match(/v=([a-zA-Z0-9_-]+)/);
    if (!match) return '';
    const videoId = match[1];
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}