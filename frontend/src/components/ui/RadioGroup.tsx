import { FC } from 'react';
import { cn } from '@/utils/cn';

type RadioOption = {
  value: string;
  label: string;
}

type RadioGroupProps = {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const RadioGroup: FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  name,
  className,
  orientation = 'horizontal'
}) => {
  return (
    <div className={cn(
      orientation === 'horizontal' ? 'flex gap-6' : 'flex flex-col gap-3',
      className
    )}>
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="w-4 h-4 text-emerald"
          />
          <span className="text-dark-grey text-md font-bold">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup; 