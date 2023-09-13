import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import OutsideClickHandler from 'react-outside-click-handler';
import FadeIn from './FadeIn';
import IconComp from './Icon';
import Loader from './Loader';

const inputCssGenerate = ({
  rounded = 'sm',
  size = 'sm',
  color = 'primary',
  errorMessage,
}: {
  rounded?: 'sm' | 'md' | 'lg';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary';
  errorMessage?: string;
}) => {
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
    primary: `border-zinc-600 hover:border-blue-500 focus:border-blue-500 pr-10`,
    error: 'border-red-500',
  };

  return `w-full ${radius[rounded]} ${padding[size]} ${
    errorMessage ? borderColor['error'] : borderColor[color]
  } bg-transparent border rounded-sm outline-none duration-500 placeholder:text-sm`;
};

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
  errorMessage?: any;
  options: IOption[];
  property: string;
  control?: Control<any, any>;
  onChange?: (value: string) => void;
  defaultValue?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

function SelectFieldComp({
  rounded = 'sm',
  size = 'sm',
  color = 'primary',
  required,
  options,
  label,
  labelCss,
  placeholder = 'Select ...',
  controlOnChange,
  onChange,
  defaultValue,
  errorMessage,
  isLoading,
  disabled,
}: ISelectProps & { controlOnChange?: (e: any) => void }) {
  const [showMenu, setShowMenu] = useState(false);
  const [searchInput, setSearchInput] = useState(
    !!defaultValue ? options.find((opt) => opt.value === defaultValue)?.label || '' : '',
  );
  const [searchQry, setSearchQry] = useState('');
  const [selected, setSelected] = useState(!!defaultValue);

  const onSelect = (opt: IOption) => {
    setSelected(true);
    setSearchQry('');
    setShowMenu(false);
    setSearchInput(opt.label);
    onChange && onChange(opt.value);
  };

  const onInputChange = (e: any) => {
    const searchVal = e.target.value;
    setSearchQry(searchVal);
    setSearchInput(searchVal);

    if (onChange && searchVal === '') onChange('');

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
      setSearchInput('');
      onChange && onChange('');
    }
  };

  return (
    <div className='w-full flex flex-col space-y-1 text-md md:text-lg font-normal font-roboto'>
      {label && (
        <label className={'p-0 font-bold' + labelCss}>
          {label} {required ? <span className='text-red-500'>*</span> : ''}
        </label>
      )}
      <div className='relative'>
        <OutsideClickHandler onOutsideClick={() => onOutSideClick()}>
          <div className='relative overflow-hidden'>
            <input
              className={inputCssGenerate({ rounded, size, color, errorMessage })}
              placeholder={placeholder}
              value={searchInput}
              onChange={(e) => {
                onInputChange(e);
                !!controlOnChange && controlOnChange('');
              }}
              onBlur={() => {
                onBlurHandler();
                !!controlOnChange && controlOnChange('');
              }}
              disabled={isLoading || disabled}
            />
            <div
              className={`absolute top-0 right-0 flex h-full justify-center items-center p-3 z-10 border-0 ${
                disabled ? '' : 'hover:cursor-pointer'
              }`}
              onClick={() => {
                if (disabled) return;
                setShowMenu(!showMenu);
              }}
            >
              {isLoading ? <Loader /> : <IconComp iconName='ChevronDownIcon' iconProps={{}} />}
            </div>
          </div>
          {showMenu && !isLoading && (
            <ul className='absolute bg-gray-200 w-full p-2 rounded-sm space-y-1 mt-1 z-20 overflow-auto max-h-96 scrollbar'>
              {options
                .filter((opt) => opt.label.includes(searchQry))
                .map((opt, i) => (
                  <li
                    key={i}
                    className='px-2 rounded-sm hover:cursor-pointer hover:bg-gray-300'
                    onClick={() => {
                      onSelect(opt);
                      !!controlOnChange && controlOnChange(opt.value);
                    }}
                  >
                    {opt.label}
                  </li>
                ))}
            </ul>
          )}
          {errorMessage ? <FadeIn cssText='text-red-500'>{errorMessage}</FadeIn> : ''}
        </OutsideClickHandler>
      </div>
    </div>
  );
}

export default function SelectField(props: ISelectProps) {
  const { rounded, size, color, errorMessage, label, labelCss, required, control, property } = props;

  if (props.options.length > 0 && !!control)
    return (
      <Controller
        control={control}
        name={property}
        render={({ field: { onChange: setValue, value } }) => {
          return <SelectFieldComp {...props} controlOnChange={setValue} defaultValue={value} />;
        }}
      />
    );

  if (props.options.length > 0 && !control) return <SelectFieldComp {...props} />;

  return (
    <div className='w-full flex flex-col space-y-1 text-md md:text-lg font-normal font-roboto'>
      {label ? (
        <label className={'p-0 font-bold' + labelCss}>
          {label} {required ? <span className='text-red-500'>*</span> : ''}
        </label>
      ) : (
        ''
      )}
      <div className='relative overflow-hidden'>
        <input name={'stores'} className={inputCssGenerate({ rounded, size, color, errorMessage })} disabled />
        <div className='absolute top-0 left-0 flex h-full justify-center items-center p-3 z-10 border-0 hover:cursor-pointer'>
          NO OPTIONS AVAILABLE
        </div>
      </div>
    </div>
  );
}
