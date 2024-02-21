import { useImage } from '@/context/ImageContext';
import React from 'react'
import Image from 'next/image';

type GeneratedImageZoneProps = {
  className?: string;
};

export default function GeneratedImageZone({ className }: GeneratedImageZoneProps) {
  const imageContext = useImage();
  return (
    <div className={className}>
      {
        imageContext.generatedImage ? (
          <Image src={imageContext.generatedImage.url} alt={'Uploaded image'} width={600} height={400} />
        ) : (
          <div>Error: no generated Image</div>
        )
      }
    </div>
  )
}
