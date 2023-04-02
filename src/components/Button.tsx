import * as React from 'react';
import Loader from './Loader';

export interface IButtonProps {
  type?: 'button' | 'submit';
  color?: 'blue' | 'red' | 'green' | 'primary';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  buttonTitle?: string;
  font?: 'raleway' | 'comfortaa';
}

export default function Button({
  type = 'button',
  color = 'primary',
  size = 'md',
  isLoading,
  onClick,
  buttonTitle,
  font = 'comfortaa',
}: IButtonProps) {
  const buttonColor = {
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
      className={
        'flex flex-row justify-center w-full rounded-sm font-comfortaa font-semibold transition-colors duration-500 ' +
        buttonColor[color] +
        ' ' +
        buttonSize[size] +
        ' ' +
        buttonFont[font]
      }
      disabled={isLoading}
      onClick={onClick}
    >
      {isLoading ? <Loader /> : buttonTitle ? buttonTitle : 'SUBMIT'}
    </button>
  );
}
