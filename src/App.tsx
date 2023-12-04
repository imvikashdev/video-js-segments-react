import { useRef } from 'react';
import './App.css';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import VideoPlayer from './components/VideoPlayer';

function App() {
  const playerRef = useRef<VideoJsPlayer | null>(null);

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
        src: 'https://cdn.sanity.io/files/lqjdlgp4/production/92cd7da6f0a98ccb368b508799ac4d293cf3be70.mp4',
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
      <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
    </div>
  );
}

export default App;
