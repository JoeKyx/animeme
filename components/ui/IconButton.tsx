import { IconProps } from '@radix-ui/react-icons/dist/types'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import React from 'react'
import { Button } from './button'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

type IconButtonProps = {
  onClick: () => void
  Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>
  tooltipContent?: string

}

export default function IconButton({ Icon, onClick, tooltipContent }: IconButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="default" size={"icon"} className="mt-4 rounded-full group border border-violet-600 hover:scale-105 transition-all duration-200 ease-in-out"

          >
            <Icon className="h-4 w-4 group-hover:scale-110"
              onClick={onClick}
            />
          </Button>
        </TooltipTrigger>
        {tooltipContent && <TooltipContent>{tooltipContent}</TooltipContent>}

      </Tooltip>
    </TooltipProvider>
  )
}
