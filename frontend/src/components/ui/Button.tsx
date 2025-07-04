import { FC, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => (
  <button
    className={cn(
      "w-full bg-green-600 text-white p-2 rounded-3xl font-extrabold hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-pinkish-grey hover:bg-green-700 transition-colors",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;
