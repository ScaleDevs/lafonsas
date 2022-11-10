import { UseFormSetValue } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import FadeIn from '@/components/FadeIn';
import IconComp from '@/components/Icon';
import SelectField from '@/components/SelectField';
import TextField from '@/components/TextField';

interface InputArrayProps {
  setValue: UseFormSetValue<any>;
  fields: { id: any; size: string; quantity: number }[];
  errors: any;
  append: any;
  remove: any;
  property: string;
  label: string;
  storeId: string;
}

const InputArray = ({ errors, setValue, fields, append, remove, property, label, storeId }: InputArrayProps) => {
  const { data } = trpc.useQuery(['store.getStores', {}]);

  return (
    <div className='space-y-3 border-gray-600 font-roboto text-md md:text-lg'>
      <div className='w-ful h-[2px] bg-zinc-700 my-5' />
      <h1 className='text-md md:text-lg font-normal'>{label}:</h1>
      {errors[`${property}`]?.message ? (
        <FadeIn duration='animation-duration-200' cssText='text-red-500'>
          {errors[`${property}`]?.message}
        </FadeIn>
      ) : (
        ''
      )}
      {fields.map((field, index) => {
        return (
          <div
            key={field.id}
            className='flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-6 mt-2 w-full p-3 bg-zinc-800 rounded-md'
          >
            <SelectField
              required
              label='Size'
              options={
                !!data
                  ? data.records
                      .find((store) => store.id === storeId)
                      ?.products.map((product) => ({ label: product.size, value: product.size })) || []
                  : []
              }
              formInput={{ setValue, property: `${property}.${index}.size` }}
              errorMessage={errors[`${property}`] ? errors[`${property}`][index]?.size?.message : undefined}
            />
            <TextField
              required
              label='Quantity'
              type='number'
              placeholder='enter quantity here'
              formInput={{ setValue, property: `${property}.${index}.quantity` }}
              errorMessage={errors[`${property}`] ? errors[`${property}`][index]?.quantity?.message : undefined}
            />
            <button
              type='button'
              className='group flex flex-row items-center justify-center border border-red-500 hover:bg-red-500 p-2 md:p-3 rounded-md transition-colors duration-200'
              onClick={() => remove(index)}
            >
              <IconComp iconName='TrashIcon' iconProps={{ fillColor: 'text-red-500 group-hover:text-white' }} />
            </button>
          </div>
        );
      })}
      <button
        type='button'
        className='bg-blue-500 rounded-sm py-1 px-5 text-md mt-3 text-xl font-raleway font-semibold'
        onClick={() => append({ size: '', quantity: 0 })}
      >
        +
      </button>
      <div className='w-ful h-[2px] bg-zinc-700 my-5' />
    </div>
  );
};

export default InputArray;
