import * as React from 'react';
import { Checkbox as ShadcnCheckBox } from '@/shadcn/components/checkbox';
import { Control, Controller } from 'react-hook-form';

export interface ICheckBoxProps {
  control: Control<any>;
  name: string;
}

export default function Checkbox({ control, name }: ICheckBoxProps) {
  return (
    <div className='flex items-center space-x-2'>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <ShadcnCheckBox onBlur={onBlur} onCheckedChange={onChange} checked={value} ref={ref} />
        )}
      />
      <label
        htmlFor='isParentStore'
        className='text-sm font-medium font-raleway leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
      >
        Is This Parent Store?
      </label>
    </div>
  );
}
