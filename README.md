# Video Player Component

This React component, `VideoPlayer`, is designed to integrate the Video.js library into your React application for seamless video playback. The component allows you to customize the player with various options, including autoplay and video sources. Additionally, it incorporates a custom seek bar with interactive segments, enhancing the user experience.

## Usage

1. **Installation:**
   Ensure you have the necessary dependencies installed in your project:

   ```bash
   npm install video.js react
   ```

2. **Component Integration:**
   Import and use the `VideoPlayer` component in your React application. Pass the required props, such as `options`, `onReady`, and `segments`.

   ```jsx
   import VideoPlayer from './path-to/VideoPlayer';

   const YourComponent = () => {
     const videoPlayerOptions = {
       // Define your Video.js player options here
     };

     const handlePlayerReady = (player) => {
       // Handle player ready event
     };

     const segmentData = [
       // Define your segment data as an array of SegmentDto objects
     ];

     return (
       <VideoPlayer
         options={videoPlayerOptions}
         onReady={handlePlayerReady}
         segments={segmentData}
       />
     );
   };
   ```

## Features

- **Custom Seek Bar:**
  The component includes a custom seek bar with interactive segments, allowing users to hover over segments and click to seek to specific points in the video.

- **Segment Card Generation:**
  Each segment is associated with a dynamically generated card, displaying relevant information when the user hovers over the segment.

- **Segment Hover Effects:**
  Smooth opacity transitions and card display/hide effects provide a visually appealing experience when interacting with the custom seek bar.

## Dependencies

- `react`
- `video.js`

## Note

Ensure that you have the required stylesheets for Video.js by including:

```jsx
import 'video.js/dist/video-js.css';
```

For detailed documentation on Video.js options and features, refer to the [Video.js Documentation](https://docs.videojs.com/).
