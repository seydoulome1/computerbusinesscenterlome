
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all relative overflow-hidden',
          'before:absolute before:inset-0 before:bg-primary/10 before:scale-x-0 before:opacity-0 before:origin-right',
          'hover:before:scale-x-100 hover:before:opacity-100 hover:before:origin-left',
          'before:transition-all before:duration-300 before:ease-in-out',
          'active:scale-[0.98]',
          variant === 'default' && 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
          variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
          variant === 'outline' && 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
          size === 'default' && 'h-10 px-4 py-2',
          size === 'sm' && 'h-9 rounded-md px-3',
          size === 'lg' && 'h-11 rounded-md px-8 text-base',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

export { AnimatedButton };
