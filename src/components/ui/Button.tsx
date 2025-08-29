import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import NextIcon from '@/assets/icons/common/next-24px.svg';

type ButtonVariant = 'solid' | 'outline' | 'subtle' | 'ghost';
type ButtonColor = 'black' | 'green' | 'yellow' | 'gray';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonShape = 'rounded' | 'pill';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  shape?: ButtonShape;
  pressed?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'solid',
      color = 'black',
      size = 'md',
      shape = 'rounded',
      pressed = false,
      disabled,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'mt-2 mb-4 flex items-center justify-center gap-1 font-medium transition-colors duration-200 ease-in-out',

          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-4 py-2 text-base',
          size === 'lg' && 'px-5 py-2.5 text-lg',

          shape === 'rounded' && 'rounded-lg',
          shape === 'pill' && 'rounded-full',

          variant === 'solid' &&
            color === 'black' &&
            'bg-black text-white hover:bg-gray-900 active:bg-gray-800',
          variant === 'solid' &&
            color === 'green' &&
            'bg-green-100 text-green-900 hover:bg-green-200 active:bg-green-300',
          variant === 'solid' &&
            color === 'yellow' &&
            'bg-yellow-100 text-yellow-900 hover:bg-yellow-200 active:bg-yellow-300',
          variant === 'solid' &&
            color === 'gray' &&
            'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400',

          variant === 'outline' &&
            color === 'black' &&
            'border border-black text-black hover:bg-gray-100 active:bg-gray-200',
          variant === 'outline' &&
            color === 'yellow' &&
            'border border-yellow-200 text-yellow-900 hover:bg-yellow-50 active:bg-yellow-100',

          // subtle
          variant === 'subtle' &&
            color === 'yellow' &&
            'bg-yellow-50 text-yellow-900 hover:bg-yellow-100 active:bg-yellow-200',
          variant === 'subtle' &&
            color === 'green' &&
            'bg-green-50 text-green-900 hover:bg-green-100 active:bg-green-200',

          variant === 'ghost' &&
            'bg-transparent text-gray-800 hover:bg-gray-100 active:bg-gray-200',

          pressed && 'ring-2 ring-black ring-offset-1',

          disabled && 'cursor-not-allowed opacity-50',

          className,
        )}
        {...props}
      >
        {children}
        <NextIcon className="ml-1" />
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
