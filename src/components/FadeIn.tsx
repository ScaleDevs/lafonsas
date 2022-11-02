import * as React from 'react';

interface IFadeInProps {
  children: any;
  cssText?: string;
  duration?: string;
}

export default function FadeIn({ children, cssText, duration = 'animation-duration-500' }: IFadeInProps) {
  return (
    <div
      className={`opacity-0 animate-fadeIn animation-delay-100 ${duration} animation-fill-forwards duration-100 ${
        cssText ? cssText : ''
      }`}
    >
      {children}
    </div>
  );
}
