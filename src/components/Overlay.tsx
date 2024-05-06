import { twMerge } from 'tailwind-merge';

export function Overlay() {
  return <div className={twMerge('fixed opacity-60', 'h-screen w-full', 'left-0 top-0 z-10 bg-zinc-800')} />;
}
