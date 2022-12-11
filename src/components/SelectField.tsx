import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import OutsideClickHandler from 'react-outside-click-handler';
import FadeIn from './FadeIn';
import IconComp from './Icon';
import Loader from './Loader';

type IOption = {
  value: string;
  label: string;
};

export interface ISelectProps {
  label?: string;
  labelCss?: string;
  placeholder?: string;
  required?: boolean;
  rounded?: 'sm' | 'md' | 'lg';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary';
  type?: 'fill' | 'outline';
  isLight?: boolean;
  errorMessage?: string;
  options: IOption[];
  formInput?: {
    setValue: UseFormSetValue<any>;
    property: any;
  };
  onChange?: (value: string) => void;
  defaultValue?: string;
  isLoading?: boolean;
}

export default function SelectField({
  rounded = 'sm',
  size = 'sm',
  color = 'primary',
  required,
  options,
  label,
  labelCss,
  placeholder = 'Select ...',
  formInput,
  onChange,
  defaultValue,
  errorMessage,
  isLoading,
}: ISelectProps) {
  const radius = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
  };

  const padding = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const borderColor = {
    primary: 'border-zinc-600 hover:border-blue-500 focus:border-blue-500 pr-10',
    error: 'border-red-500',
  };

  const inputCss = `w-full ${radius[rounded]} ${padding[size]} ${
    errorMessage ? borderColor['error'] : borderColor[color]
  } bg-transparent border rounded-sm outline-none duration-500 placeholder:text-sm`;

  const [showMenu, setShowMenu] = useState(false);
  const [value, setValue] = useState(!!defaultValue ? options.find((opt) => opt.value === defaultValue)?.label || '' : '');
  const [searchQry, setSearchQry] = useState('');
  const [selected, setSelected] = useState(false);

  const onUseFormUpdate = (value: string) => {
    onChange && onChange(value);
    if (formInput) {
      formInput.setValue(formInput.property, value || '', { shouldValidate: true });
    }
  };

  const onSelect = (opt: IOption) => {
    setSelected(true);
    setSearchQry('');
    setShowMenu(false);
    setValue(opt.label);
    onUseFormUpdate(opt.value);
  };

  const onInputChange = (e: any) => {
    const searchVal = e.target.value;
    setSearchQry(searchVal);
    setValue(searchVal);

    if (onChange && searchVal === '') onUseFormUpdate('');

    setSelected(false);
  };

  const onBlurHandler = () => {
    if (!showMenu) onBlurAction();
  };

  const onOutSideClick = () => {
    if (showMenu) onBlurAction();
    else setShowMenu(false);
  };

  const onBlurAction = () => {
    setSearchQry('');
    setShowMenu(false);

    if (!selected) {
      setValue('');
      onUseFormUpdate('');
    }
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
      <div className='relative'>
        <OutsideClickHandler onOutsideClick={() => onOutSideClick()}>
          <div className='relative overflow-hidden'>
            <input
              name={'stores'}
              className={inputCss}
              placeholder={placeholder}
              value={value}
              onChange={onInputChange}
              onBlur={onBlurHandler}
              disabled={isLoading}
            />
            <div
              className='absolute top-0 right-0 flex h-full justify-center items-center p-3 z-10 border-0 hover:cursor-pointer'
              onClick={() => setShowMenu(!showMenu)}
            >
              {isLoading ? <Loader /> : <IconComp iconName='ChevronDownIcon' iconProps={{}} />}
            </div>
          </div>

          {showMenu && !isLoading ? (
            <ul className='absolute bg-slate-700 w-full p-2 rounded-sm space-y-1 mt-1 z-10 overflow-auto max-h-96 scrollbar'>
              {options
                .filter((opt) => opt.label.includes(searchQry))
                .map((opt, i) => (
                  <li key={i} className='px-2 rounded-sm hover:cursor-pointer hover:bg-slate-600' onClick={() => onSelect(opt)}>
                    {opt.label}
                  </li>
                ))}
            </ul>
          ) : (
            ''
          )}
        </OutsideClickHandler>
      </div>
      {errorMessage ? <FadeIn cssText='text-red-500'>{errorMessage}</FadeIn> : ''}
    </div>
  );
}
