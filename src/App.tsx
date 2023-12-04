import { useRef } from 'react';
import './App.css';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import VideoPlayer from './components/VideoPlayer';

function App() {
  const playerRef = useRef<VideoJsPlayer | null>(null);

  const segments = [
    {
      id: 1,
      start: 0,
      end: 20,
      thumbnail: 'segment-1.png',
      description: 'Segment 1',
    },
    {
      id: 2,
      start: 20,
      end: 40,
      thumbnail: 'segment-2.png',
      description: 'Segment 2',
    },
    {
      id: 3,
      start: 40,
      end: 62,
      thumbnail: 'segment-3.png',
      description: 'Segment 3',
    },
  ];

  const videoJsOptions: VideoJsPlayerOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    html5: {
      vhs: {
        overrideNative: true,
      },
    },
    sources: [
      {
        src: 'https://v1.cdnpk.net/videvo_files/video/premium/video0041/large_watermarked/900-2_900-6014-PD2_preview.mp4',
        type: 'video/mp4',
      },
    ],
  };

  const handlePlayerReady = (player: VideoJsPlayer) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return (
    <div>
      <VideoPlayer
        segments={segments}
        options={videoJsOptions}
        onReady={handlePlayerReady}
      />
    </div>
  );
}

export default App;
