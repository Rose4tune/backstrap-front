export function sanitizeYouTubeLinkEmbed(deltaString: string): any {
  const ops = JSON.parse(deltaString);

  const youTubeRegex =
    /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;

  const transformedOps = ops.flatMap((op: any) => {
    // 1. case: link
    const link = op.attributes?.link;
    if (link && youTubeRegex.test(link)) {
      const match = link.match(youTubeRegex);
      const videoId = match?.[1];
      if (videoId) {
        return [
          {
            insert: {
              video: `https://www.youtube.com/embed/${videoId}`
            }
          },
          { insert: '\n' }
        ];
      }
    }

    // 2. case: insert.video (잘못된 링크 직접 embed된 경우 수정)
    const video = op.insert?.video;
    if (video && youTubeRegex.test(video)) {
      const match = video.match(youTubeRegex);
      const videoId = match?.[1];
      if (videoId) {
        return [
          {
            insert: {
              video: `https://www.youtube.com/embed/${videoId}`
            }
          },
          { insert: '\n' }
        ];
      }
    }

    // 변경 없음
    return [op];
  });

  return transformedOps;
}
