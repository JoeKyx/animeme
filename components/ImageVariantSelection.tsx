import React from 'react'
import { Button } from './ui/button'
import { ImageIcon } from '@radix-ui/react-icons'
import { useImage } from '@/context/ImageContext';
import { GiFire, GiMove, GiPaintBrush } from 'react-icons/gi';
import { useMangaUpload } from '@/hooks/useMangaUpload';
import { useAnimateImage } from '@/hooks/useAnimateImage';
import { BsImage } from 'react-icons/bs';
import { FaBookOpen, FaWandSparkles } from 'react-icons/fa6';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
type ImageVariantSelectionProps = {
  className?: string;
};

type ButtonProps = {
  shown: boolean;
  active?: boolean
  disabled?: boolean;
  onClick: () => void;
}

export default function ImageVariantSelection({ className }: ImageVariantSelectionProps) {
  const imageContext = useImage();
  const imageUploaded = imageContext.image ? true : false;

  return (
    <div className={className}>
      <RemoveImageButton shown={imageUploaded} onClick={imageContext.reset} />
    </div>
  )
}


const RemoveImageButton = ({ shown, active, onClick, disabled = false }: ButtonProps) => {
  return (
    shown &&
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant={'destructive'} className='group hover:scale-110 transition-all' onClick={onClick} disabled={disabled}>Reset <GiFire className='h-4 w-4 ml-2' /></Button>
        </TooltipTrigger>
        <TooltipContent>Removes the image and all generated content</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )


}

const OGImageButton = ({ active, onClick, disabled = false, shown }: ButtonProps) => {

  return (
    shown &&
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant={active ? 'selected' : 'select'} className='group hover:scale-110 transition-all' onClick={onClick} disabled={disabled}>OG Image<BsImage className='h-4 w-4 ml-2   ' /></Button>
        </TooltipTrigger>
        <TooltipContent>Show the original image that you have uploaded</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}



const ShowGeneratedImageButton = ({ active, onClick, disabled = false, shown }: ButtonProps) => {
  return (
    shown &&
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant={active ? 'selected' : 'select'} className='group hover:scale-110 transition-all' onClick={onClick}>Manga Image<FaBookOpen className='h-4 w-4 ml-2' /></Button>
        </TooltipTrigger>
        <TooltipContent>Show the manga version</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const AnimateImageButton = ({ onClick, disabled = false, shown }: ButtonProps) => {
  return (
    shown &&
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant={'confirm'} className='group hover:scale-110 transition-all' onClick={onClick}>Anime me! <FaWandSparkles className='h-4 w-4 ml-2  transition-all ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-125 ' /></Button>
        </TooltipTrigger>
        <TooltipContent>Generate an animate version of the manga</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const ShowAnimatedImageButton = ({ onClick, disabled = false, shown }: ButtonProps) => {
  return (
    shown &&
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant={'confirm'} className='group hover:scale-110 transition-all' onClick={onClick}>Anime<GiFire className='h-4 w-4 ml-2' /></Button>
        </TooltipTrigger>
        <TooltipContent>Show the anime version</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}