import { useImage } from '@/context/ImageContext';
import React from 'react'

type AnimatedImageZoneProps = {
  className?: string;
};


export default function AnimatedImageZone({ className }: AnimatedImageZoneProps) {
  const imageContext = useImage();
  const videoType = imageContext.animatedImage?.url.endsWith('.mp4') ? 'video/mp4' : 'video/webm';


  return (
    <div className={className}>
      {imageContext.animatedImage ? (
        <video

          loop
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => e.currentTarget.pause()}
          className="w-full h-full object-cover" // Check these styles
        >
          <source src={imageContext.animatedImage.url} type={videoType} />
        </video>
      ) : (
        <div>Error: no animated Image</div>
      )}
    </div>
  )
}
