import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import FadeIn from './FadeIn';

interface InputWrapperProps {
  type?: 'text' | 'password' | 'number' | 'date';
  label?: string;
  labelCss?: string;
  placeholder?: string;
  required?: boolean;
  rounded?: 'sm' | 'md' | 'lg';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary';
  errorMessage?: string;
  formInput?: {
    setValue: UseFormSetValue<any>;
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
  defaultValue,
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
    error: 'border-red-500',
  };

  const inputCss = `${radius[rounded]} ${padding[size]} ${
    errorMessage ? borderColor['error'] : borderColor[color]
  } bg-transparent border rounded-sm outline-none duration-500 placeholder:text-sm`;

  const [value, setValue] = useState(defaultValue || '');

  const onUseFormUpdate = (value: string) => {
    let newValue = type === 'number' ? parseFloat(value) : value;
    if (!newValue) newValue = type === 'number' ? 0 : '';
    if (formInput) formInput.setValue(formInput.property, newValue, { shouldValidate: true, shouldDirty: true });
  };

  const onInputChange = (e: any) => {
    const inputVal = e.target.value;
    setValue(inputVal);
    onUseFormUpdate(inputVal);
    onChange && onChange(inputVal);
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
      <input type={type} className={inputCss} placeholder={placeholder} value={value} onChange={onInputChange} />
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
