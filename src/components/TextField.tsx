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
  errorMessage?: any;
  formInput?: {
    setValue?: UseFormSetValue<any>;
    register?: UseFormRegister<any>;
    property: any;
  };
  onChange?: (value: string) => void;
  defaultValue?: any;
  disabled?: boolean;
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
  disabled,
  defaultValue,
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
    primary: `${
      disabled ? 'border-gray-200  cursor-not-allowed' : 'border-zinc-600  hover:border-blue-500'
    } focus:border-blue-500`,
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
    if (type === 'number') {
      if (v === '') return undefined;
      if (v === '0') return 0;
      if (!!RegexValidations.FloatOnly.exec(v)) return parseFloat(v);
    }

    return v;
  };

  const useFormRegisterField = formInput?.register
    ? formInput.register(formInput.property, {
        onChange: onInputChange,
        setValueAs: setFormValue,
      })
    : {
        onChange: onInputChange,
        value: defaultValue,
      };

  return (
    <div className='text-md flex w-full flex-col space-y-1 font-roboto font-normal md:text-lg'>
      {label ? (
        <label className={'p-0 font-bold' + labelCss}>
          {label} {required ? <span className='text-red-500'>*</span> : ''}
        </label>
      ) : (
        ''
      )}
      <input
        {...useFormRegisterField}
        type={type === 'number' ? 'text' : type}
        className={inputCss}
        placeholder={placeholder}
        disabled={disabled}
      />
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
