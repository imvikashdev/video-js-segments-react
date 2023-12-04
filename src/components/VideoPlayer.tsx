import { useEffect, useRef } from 'react';
import videojs, { VideoJsPlayerOptions, VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.css';

type SegmentDto = {
  id: number;
  start: number;
  end: number;
  thumbnail: string;
  description: string;
};

type Props = {
  options: VideoJsPlayerOptions;
  onReady: (player: VideoJsPlayer) => void;
  segments: SegmentDto[];
};

const VideoPlayer = ({ options, onReady, segments }: Props) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);

  function scrollToSegment(e: MouseEvent) {
    e.stopPropagation();
    if (e.target) {
      const wrapperDiv = (e.target as any).closest('.segment-section');
      if (wrapperDiv) {
        const startTime = Number(wrapperDiv.getAttribute('data-segmentstart'));
        if (playerRef.current) {
          playerRef.current.currentTime(startTime);
        }
      }
    }
  }

  function generateCard(segmentDetails: SegmentDto) {
    const card = document.createElement('div');
    card.id = `segment-card-${segmentDetails.id}`;
    card.classList.add('segment-card');

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('image-wrapper');

    const thumbnail = document.createElement('img');
    thumbnail.classList.add('image');
    thumbnail.src = segmentDetails.thumbnail;
    thumbnail.alt = segmentDetails.description;

    imageWrapper.appendChild(thumbnail);

    const title = document.createElement('span');
    title.innerText = segmentDetails.description;
    title.classList.add('title');

    card.appendChild(imageWrapper);
    card.appendChild(title);
    card.addEventListener('click', scrollToSegment);
    return card;
  }

  const onMouseEnter = (customSeekbar: HTMLDivElement) => {
    const segmentWrapper = document.createElement('div');
    segmentWrapper.id = 'segment-wrapper';

    // looping over segments array to create track segments
    segments.forEach((e) => {
      const segment = document.createElement('div');
      if (playerRef.current) {
        segment.style.width =
          ((e.end - e.start) / playerRef.current.duration()) * 100 + '%';
      }

      segment.id = `segment-section-${e.id}`;
      segment.classList.add('segment-section');
      segment.setAttribute('data-segmentstart', e.start.toString());

      //generating custom card for segment
      const card = generateCard(e);
      segment.append(card);

      // display card only if current segment is hovered
      segment.addEventListener('mouseenter', (e: any) => {
        e.target.style.opacity = '1';
        const id = e.target.getAttribute('id').split('-')[2];
        const card: HTMLDivElement | null = document.querySelector(
          `#segment-card-${id}`,
        );
        if (card) {
          card.style.display = 'block';
        }
      });

      // removing card for current segment on mouseleave
      segment.addEventListener('mouseleave', (e: any) => {
        if (e.target) {
          e.target.style.opacity = '0.8';
          const id = e.target.getAttribute('id').split('-')[2];
          const card: HTMLDivElement | null = document.querySelector(
            `#segment-card-${id}`,
          );
          if (card) {
            card.style.display = 'none';
          }
        }
      });

      // adding segment to segment wrapper
      segmentWrapper.appendChild(segment);
    });

    //adding segemnt wrapper to progress bar
    customSeekbar.appendChild(segmentWrapper);
  };

  const onMouseLeave = (customSeekbar: HTMLDivElement) => {
    const segmentWrapper = document.getElementById('segment-wrapper');
    if (segmentWrapper) {
      customSeekbar.removeChild(segmentWrapper);
    }
  };

  const onClick = (e: MouseEvent, customSeekbar: HTMLDivElement) => {
    const boundingRect = customSeekbar.getBoundingClientRect();
    const clickX = e.clientX - boundingRect.left;
    const percentage = clickX / boundingRect.width;
    if (playerRef.current) {
      const seekTime = percentage * playerRef.current.duration();
      playerRef.current.currentTime(seekTime);
    }
  };

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

        // seekBar Component
        const progressControl = (
          player.controlBar as any
        ).progressControl.seekBar.el();
        progressControl.id = 'custom-seekbar';

        // showing segments only when progress bar is hovered
        progressControl.addEventListener('mouseenter', () =>
          onMouseEnter(progressControl),
        );

        progressControl.addEventListener('mouseleave', () =>
          onMouseLeave(progressControl),
        );

        // listening for segement currentTime
        progressControl.addEventListener('click', (e: MouseEvent) =>
          onClick(e, progressControl),
        );
      }
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay || false);
      player.src(options.sources || '');
    }
  }, [options, videoRef]);

  useEffect(() => {
    const player = playerRef.current;

    console.log();
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div id="custom-video-player" ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;
