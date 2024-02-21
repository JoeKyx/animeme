"use client"
import { ImageType, useImage } from '@/context/ImageContext';
import { LockClosedIcon, LockOpen1Icon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
export default function VersionSelectorMobile() {
  const imageContext = useImage();

  const changeActiveImage = (imageType: ImageType) => {
    imageContext.setActiveSection(imageType);
  }

  return (
    <div className='flex w-full md:hidden'>
      <Button variant={'ghost'} onClick={() => changeActiveImage('OG')}
        className='flex-1'>
        <div className={`flex flex-col items-center ${imageContext.activeSection == 'OG' && 'underline text-slate-50 underline-offset-4'}`}>
          <p className=' text-xs uppercase'>Original</p>
        </div>
      </Button>
      <Button variant={'ghost'} onClick={() => changeActiveImage('Manga')} className='flex-1'
        disabled={!imageContext.generatedImage}
      >
        <div className={`flex gap-1 items-center ${imageContext.activeSection == 'Manga' && 'underline text-slate-50 underline-offset-4'}`}>
          <p className='text-xs uppercase'>Manga</p>
          {!imageContext.generatedImage && <LockClosedIcon className='w-4 h-4 fill-slate-100 text-slate-200 ' />}
        </div>
      </Button>
      <Button variant={'ghost'} onClick={() => changeActiveImage('Anime')} className='flex-1'
        disabled={!imageContext.animatedImage}
      >
        <div className={`flex gap-1 items-center ${imageContext.activeSection == 'Anime' && 'underline text-slate-50 underline-offset-4'}`}>
          <p className=' text-xs uppercase'>Anime</p>
          {!imageContext.animatedImage && <LockClosedIcon className='w-4 h-4 fill-slate-100 text-slate-200 ' />}
        </div>
      </Button>
    </div>
  )
}

type LockedContentProps = {
  text: string;
  description: string;
  locked: boolean;
  tooltip: string;
  onClick?: () => void;
}

const LockedContent = ({ text, description, locked, onClick, tooltip }: LockedContentProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger className='w-[180px] rounded-xl border border-slate-200 justify-center items-center flex flex-col p-4 bg-slate-950'>

        {locked ? (
          <LockClosedIcon className='w-10 h-10 fill-slate-100 text-slate-200 ' />
        ) :
          <LockOpen1Icon className='w-10 h-10 fill-slate-100 text-slate-200 ' />}
        <p className='text-xl font-semibold text-slate-200 mt-6 uppercase'>{text}</p>
        <p className='text-xs text-slate-300 text-center'>{description}</p>
      </TooltipTrigger>
      <TooltipContent className='max-w-64 bg-slate-900/90 p-4 rounded-lg border-slate-200 border'>{tooltip}</TooltipContent>

    </Tooltip>
  </TooltipProvider>
)
