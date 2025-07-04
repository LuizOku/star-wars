import { FC, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    className={cn(
      "w-full border p-3 rounded-lg border-gray-300 text-dark-grey focus:outline-none focus:ring-1 focus:ring-dark-grey focus:border-dark-grey",
      className
    )}
    {...props}
  />
);

export default Input;
