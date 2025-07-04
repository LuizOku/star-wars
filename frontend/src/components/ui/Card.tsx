import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: FC<CardProps> = ({ children, className }) => (
  <div className={twMerge(clsx(
    "bg-white p-6 rounded shadow",
    className
  ))}>
    {children}
  </div>
);

export default Card;
