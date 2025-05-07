import * as React from 'react';
import Loader from './Loader';
import { cn } from '@/shadcn/lib/utils';

export interface IButtonProps {
  type?: 'button' | 'submit';
  color?: 'blue' | 'red' | 'green' | 'primary' | 'gray';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  buttonTitle?: string;
  font?: 'raleway' | 'comfortaa';
  className?: string;
  disabled?: boolean;
}

export default function Button({
  type = 'button',
  color = 'primary',
  size = 'md',
  isLoading,
  onClick,
  buttonTitle,
  className,
  font = 'comfortaa',
  disabled,
}: IButtonProps) {
  const buttonColor = {
    gray: 'bg-gray-600 hover:bg-gray-400 text-white',
    blue: 'bg-blue-600 hover:bg-blue-400 text-white',
    red: 'bg-red-500 hover:bg-red-400 text-white',
    green: 'bg-green-600 hover:bg-green-500 text-white',
    primary: 'bg-primary hover:bg-primarylight text-white',
  };

  const buttonSize = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };

  const buttonFont = {
    raleway: 'font-raleway',
    comfortaa: 'font-comfortaa',
  };

  return (
    <button
      type={type}
      className={cn(
        'flex w-full flex-row items-center justify-center',
        'rounded-sm font-comfortaa font-semibold transition-colors duration-500 ',
        buttonColor[color],
        buttonSize[size],
        buttonFont[font],
        className,
      )}
      disabled={isLoading || disabled}
      onClick={onClick}
    >
      {isLoading ? <Loader /> : buttonTitle ? buttonTitle : 'SUBMIT'}
    </button>
  );
}
