import { useEffect, useRef } from 'react';
import videojs, { VideoJsPlayerOptions, VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.css';

type Props = {
  options: VideoJsPlayerOptions;
  onReady: (player: VideoJsPlayer) => void;
};

const VideoPlayer = ({ options, onReady }: Props) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);

        const player = (playerRef.current = videojs(
          videoElement,
          options,
          () => {
            videojs.log('player is ready');
            onReady && onReady(player);
          },
        ));
      }
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay || false);
      player.src(options.sources || '');
    }
  }, [options, videoRef, onReady]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;
