import { UseFormRegister } from 'react-hook-form';
import FadeIn from './FadeIn';

interface InputWrapperProps {
  type?: string;
  label?: string;
  labelCss?: string;
  property: any;
  placeholder: string;
  register: UseFormRegister<any>;
  errorsMsg?: string;
}

const InputWrapper = ({ register, label, labelCss, property, placeholder, errorsMsg, type = 'text' }: InputWrapperProps) => {
  return (
    <div className='flex flex-col space-y-1 text-md md:text-lg font-semibold font-raleway'>
      {label ? <label className={'p-0 ' + labelCss}>{label} :</label> : ''}
      <input
        {...register(property)}
        type={type}
        className={`p-2 bg-gray-700 rounded-sm transition-[outline] outline-none duration-500 focus:outline-1 focus:outline-blue-500 hover:outline-blue-400 placeholder:text-sm ${
          errorsMsg ? 'border border-red-500' : ''
        }`}
        placeholder={placeholder}
      />
      {errorsMsg ? <FadeIn cssText='font-raleway text-red-500'>{errorsMsg}</FadeIn> : ''}
    </div>
  );
};

export default InputWrapper;
