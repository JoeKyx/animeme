"use client"
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { MotionProps, motion, useAnimation } from 'framer-motion';
import { forwardRef, useEffect } from "react";

const buttonVariants = cva(
  "disabled:pointer-events-none  drop-shadow-lg inline flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: "text-white shadow border border-slate-600 hover:scale-105 transition-all duration-200 ease-in-out ",
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },

    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },


  }
);




export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  slightlyDisabled?: boolean;

}


type SafeButtonProps = Omit<ButtonProps, keyof MotionProps> & React.PropsWithChildren<{}>;

const MyButton = forwardRef<HTMLButtonElement, SafeButtonProps>(
  ({ className, variant, size, disabled, slightlyDisabled, children, ...props }, ref) => {
    const glowVariants = {
      initial: { opacity: 0, filter: 'blur(0px)' },
      hover: { opacity: 1, filter: 'blur(10px)', boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)' }
    }

    const buttonClasses = cn(buttonVariants({ variant, size }), className);
    const disabledClasses = disabled ? 'opacity-50 pointer-events-none' : '';
    const controls = useAnimation();
    useEffect(() => {
      const sequence = async () => {
        if (disabled) {
          await controls.start({ width: '0%' });
        } else {
          await controls.start({ width: '100%' });
        }
      };
      sequence();
    }, [disabled, controls]);
    return (
      <motion.button
        className={`${buttonClasses} ${disabledClasses} relative  overflow-hidden bg-transparent z-10`}
        ref={ref}
        {...props}
      >
        <motion.div
          className={`absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-indigo-600 ${slightlyDisabled ? 'opacity-50' : ''}`}
          initial={{ width: 0 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
          animate={controls}
        />

        <span className="z-10 inline-flex items-center justify-center">{children}</span>
      </motion.button>

    );
  }
);


MyButton.displayName = "MyButton";

export default MyButton;