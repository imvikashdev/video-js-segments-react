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
    card.classList.add(
      ...['hidden', 'absolute', 'pb-[10px]', 'opacity-100', 'bottom-2'],
    );

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add(
      ...['h-[70px]', 'flex', 'flex-row', 'justify-center', 'items-center'],
    );

    const thumbnail = document.createElement('img');
    thumbnail.classList.add(
      ...[
        'border-[#ffffff5f]',
        'border-solid',
        'border-2',
        'rounded-xl',
        'h-full',
      ],
    );
    thumbnail.src = segmentDetails.thumbnail;
    thumbnail.alt = segmentDetails.description;

    imageWrapper.appendChild(thumbnail);

    const title = document.createElement('span');
    title.innerText = segmentDetails.description;
    title.classList.add(
      ...['text-center', 'block', 'mt-[7px]', 'text-sm', 'text-white'],
    );

    card.appendChild(imageWrapper);
    card.appendChild(title);
    card.addEventListener('click', scrollToSegment);
    return card;
  }

  const removeLoaderStyles = () => {
    const loaderBar = document.querySelector('.vjs-load-progress');
    const progressBar = document.querySelector('.vjs-play-progress');
    loaderBar?.classList.remove('z-[2]');
    progressBar?.classList.remove('z-[3]', 'opacity-60');
  };

  const rebuildLoaderStyles = () => {
    const loaderBar = document.querySelector('.vjs-load-progress');
    const progressBar = document.querySelector('.vjs-play-progress');
    loaderBar?.classList.add('z-[2]');
    progressBar?.classList.add('z-[3]', 'opacity-60');
  };

  const generateSegments = (customSeekbar: HTMLDivElement) => {
    const progressControl = document.querySelector('.vjs-progress-control');

    const loaderBar = document.querySelector('.vjs-load-progress');
    const progressBar = document.querySelector('.vjs-play-progress');
    loaderBar?.classList.add('z-[2]', 'opacity-60');
    progressBar?.classList.add('z-[3]', 'opacity-60');

    progressControl?.addEventListener('mouseenter', () => {
      removeLoaderStyles();
    });
    progressControl?.addEventListener('mouseleave', () => {
      rebuildLoaderStyles();
    });

    const segmentWrapper = document.createElement('div');
    segmentWrapper.id = 'segment-wrapper';

    segmentWrapper?.classList.add(
      ...[
        'flex',
        'flex-row',
        'px-[1px]',
        'bg-black',
        'gap-[2px]',
        'absolute',
        'w-full',
        'h-full',
        'z-[1]',
      ],
    );

    // looping over segments array to create track segments
    segments.forEach((e) => {
      const segment = document.createElement('div');
      if (playerRef.current) {
        segment.style.width =
          ((e.end - e.start) / playerRef.current.duration()) * 100 + '%';
      }

      segment.id = `segment-section-${e.id}`;
      segment.classList.add(
        ...['opacity-80', 'segment-section', 'h-full', 'bg-red-500'],
      );
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
        progressControl.classList.add(
          ...[
            'hover:w-full',
            'hover:h-2',
            'hover:bg-[#33333399]',
            'hover:cursor-pointer',
          ],
        );

        player.on('loadedmetadata', () => {
          generateSegments(progressControl);
        });

        // showing segments only when progress bar is hovered
        // progressControl.addEventListener('mouseenter', () =>
        //   onMouseEnter(progressControl),
        // );

        // progressControl.addEventListener('mouseleave', () =>
        //   onMouseLeave(progressControl),
        // );

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

    return () => {
      if (player?.isDisposed && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div
        id="custom-video-player"
        className="relative w-[640px] mx-auto my-5"
        ref={videoRef}
      />
    </div>
  );
};

export default VideoPlayer;
