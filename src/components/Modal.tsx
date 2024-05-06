import { twMerge } from 'tailwind-merge';

export interface IModalProps {
  rounded?: 'rounded-sm' | 'rounded-md' | 'rounded-lg';
  bg?: string;
  opacity?: string;
  p?: string;
  w: string;
  children: any;
  open?: boolean;
}

export default function Modal({
  w,
  rounded = 'rounded-sm',
  bg = 'bg-white',
  opacity = 'opacity-90',
  p = 'p-5',
  children,
}: IModalProps) {
  return (
    <div
      className={twMerge(
        'absolute left-0 right-0 z-20 m-auto p-5 opacity-0',
        `${w} ${rounded} ${bg} ${opacity} ${p}`,
        'animate-zoomIn ease-in-out animation-duration-300 animation-fill-forwards',
      )}
    >
      <div className='w-full break-words'>{children}</div>
    </div>
  );
}
