import { useState } from 'react';
import FadeIn from './FadeIn';

interface InputSoloProps {
  type?: string;
  label?: string;
  labelCss?: string;
  placeholder?: string;
  onChange?: (...args: any) => void;
  onClick?: (value: string) => void;
  isRow?: boolean;
  w?: string;
  ButtonChildren?: any;
  errMsg?: string;
}

const InputSolo = ({
  label,
  labelCss,
  placeholder,
  type = 'text',
  onChange,
  onClick,
  isRow = false,
  w = 'w-full',
  ButtonChildren,
  errMsg,
}: InputSoloProps) => {
  const [input, setInput] = useState('');

  const handleChangeInput = (e: any) => {
    setInput(e.target.value);
    onChange && onChange(e);
  };

  return (
    <div>
      <div className={`relative ${w} h-full`}>
        <div
          className={
            'w-full h-full text-md md:text-lg font-semibold font-comfortaa flex ' +
            (isRow ? 'flex-row space-x-2 items-center' : 'flex-col space-y-1')
          }
        >
          {label ? <label className={'p-0 ' + labelCss}>{label} :</label> : ''}
          <input
            type={type}
            className='w-full h-full py-1 px-2 bg-gray-200 rounded-sm transition-[outline] outline-none duration-500 focus:outline-1 focus:outline-blue-500 hover:outline-blue-400 placeholder:text-sm'
            placeholder={placeholder || ''}
            onChange={handleChangeInput}
          />
        </div>
        {ButtonChildren ? (
          <button
            className='absolute top-0 right-0 bg-gray-400 h-full px-3 hover:bg-blue-400'
            onClick={() => onClick && onClick(input)}
          >
            {ButtonChildren}
          </button>
        ) : (
          ''
        )}
      </div>
      {errMsg ? (
        <FadeIn cssText='font-comfortaa text-red-500' duration='animation-duration-100'>
          {errMsg}
        </FadeIn>
      ) : (
        ''
      )}
    </div>
  );
};

export default InputSolo;
