"use client"
import { cn } from '@/lib/utils';
import React from 'react'
import DropZone from './DropZone';
import { useImage } from '@/context/ImageContext';
import { Button } from '@/components/ui/button';
import { MixIcon } from '@radix-ui/react-icons';
import { GiBroadheadArrow, GiFire, GiFireworkRocket, GiHeavyLightning, GiHighKick, GiMove } from 'react-icons/gi';
import ResponseZone from './ResponseZone';
import AnimatedImageZone from './AnimatedImageZone';
import { GeneratedImageSchema } from 'leonardo-ts/src/schemas';
import GeneratedImageZone from './GeneratedImageZone';
import ImageVariantSelection from './ImageVariantSelection';
import { useMangaUpload } from '@/hooks/useMangaUpload';
import { useAnimateImage } from '@/hooks/useAnimateImage';
import Album3D from './Album3d';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useStyle } from '@/context/StyleContext';
type ImageInteractionAreaProps = {
  className?: string;
};
export default function ImageInteractionArea({ className }: ImageInteractionAreaProps) {
  const imageContext = useImage();
  const styleContext = useStyle();

  const resetHandler = () => {
    imageContext.reset();
    styleContext.reset();
  }

  return (
    <div className={cn(className, 'flex flex-col items-center justify-start w-full relative gap-4 ')}>
      {imageContext.image && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant={'destructive'} className='group hover:scale-110 transition-all' onClick={resetHandler}>Reset <GiFire className='h-4 w-4 ml-2' /></Button>
            </TooltipTrigger>
            <TooltipContent>Removes the image and all generated content</TooltipContent>
          </Tooltip>
        </TooltipProvider>

      )}

      <Album3D />
      {imageContext.status === 'ERROR' && (
        <p className='text-red-500 text-sm mt-2'>{imageContext.error}</p>
      )}
    </div>

  );
}
