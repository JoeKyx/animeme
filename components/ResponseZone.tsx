import { useImage } from '@/context/ImageContext';
import React from 'react'
import Image from 'next/image';

export default function ResponseZone() {
  const imageContext = useImage();

  return (
    <div>
      {imageContext.status === 'SUCCESS' && imageContext.generatedImage && (
        <div className='min-w-44 min-h-44 flex flex-col items-center justify-center border-2 rounded-lg  border-slate-100 overflow-hidden'>
          <Image src={imageContext.generatedImage.url} alt='Anime version of the uploaded image' width={600} height={400} />
        </div>
      )}
    </div>
  )
}
