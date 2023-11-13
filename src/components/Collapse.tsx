import { ReactNode } from 'react';

export interface ICollapseProps {
  isOpen: boolean;
  children: ReactNode;
}

export default function Collapse({ isOpen, children }: ICollapseProps) {
  return (
    <div className={`transition-[max-height] duration-300 ${isOpen ? 'max-h-56 ease-in' : 'max-h-0'} overflow-hidden`}>
      {children}
    </div>
  );
}
