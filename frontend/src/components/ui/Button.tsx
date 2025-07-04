import { FC, ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => (
  <button
    className={cn(
      "bg-green-teal text-white text-md py-2 px-4 rounded-3xl font-extrabold hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-pinkish-grey hover:bg-green-teal/90 transition-colors",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;
