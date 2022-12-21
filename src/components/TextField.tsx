// import { useState } from 'react';
import { RegexValidations } from '@/utils/helper';
import { UseFormSetValue, UseFormRegister } from 'react-hook-form';
import FadeIn from './FadeIn';

interface InputWrapperProps {
  type?: 'text' | 'password' | 'number' | 'date';
  label?: string;
  labelCss?: string;
  placeholder?: string;
  required?: boolean;
  rounded?: 'sm' | 'md' | 'lg';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary';
  errorMessage?: string;
  formInput?: {
    setValue?: UseFormSetValue<any>;
    register?: UseFormRegister<any>;
    property: any;
  };
  onChange?: (value: string) => void;
  defaultValue?: any;
}

const TextField = ({
  label,
  labelCss,
  placeholder,
  required,
  type = 'text',
  rounded = 'sm',
  size = 'sm',
  color = 'primary',
  formInput,
  onChange,
  errorMessage,
}: InputWrapperProps) => {
  const radius = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
  };

  const padding = {
    sm: type === 'date' ? 'p-[7.6px]' : 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const borderColor = {
    primary: 'border-zinc-600 hover:border-blue-500 focus:border-blue-500',
    secondary: 'border-gray-300 hover:border-blue-500 focus:border-blue-500',
    error: 'border-red-500',
  };

  const inputCss = `${radius[rounded]} ${padding[size]} ${
    errorMessage ? borderColor['error'] : borderColor[color]
  } bg-gray-200 border rounded-sm outline-none duration-500 placeholder:text-sm`;

  const onInputChange = (e: any) => {
    const inputVal = e.target.value;
    onChange && onChange(inputVal);
  };

  const setFormValue = (v: string) => {
    if (type === 'number' && v === '') return undefined;
    return type === 'number' ? (!!RegexValidations.NumberOnly.exec(v) ? parseFloat(v) : v) : v;
  };

  const useFormRegisterField = formInput?.register
    ? formInput.register(formInput.property, {
        onChange: onInputChange,
        setValueAs: setFormValue,
      })
    : {
        onChange: onInputChange,
      };

  return (
    <div className='w-full flex flex-col space-y-1 text-md md:text-lg font-normal font-roboto'>
      {label ? (
        <label className={'p-0 font-bold' + labelCss}>
          {label} {required ? <span className='text-red-500'>*</span> : ''}
        </label>
      ) : (
        ''
      )}
      <input {...useFormRegisterField} type={type === 'number' ? 'text' : type} className={inputCss} placeholder={placeholder} />
      {errorMessage ? (
        <FadeIn cssText='text-red-500' duration='animation-duration-200'>
          {errorMessage}
        </FadeIn>
      ) : (
        ''
      )}
    </div>
  );
};

export default TextField;
