
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link' | 'accent';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button: React.FC<ButtonProps> = ({ className, variant = 'default', size = 'default', asChild = false, children, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantClasses = {
    default: "bg-primary-dark text-white hover:bg-primary-dark/90 dark:bg-gray-200 dark:text-primary-dark dark:hover:bg-gray-200/90",
    accent: "bg-accent-teal text-white hover:bg-accent-teal/90",
    destructive: "bg-red-500 text-white hover:bg-red-500/90 dark:bg-red-600 dark:hover:bg-red-600/90",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800",
    ghost: "hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white",
    link: "text-primary-dark underline-offset-4 hover:underline dark:text-accent-teal",
  };

  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`.trim();

  if (asChild) {
    const child = React.Children.only(children);
    if (React.isValidElement<{ className?: string }>(child)) {
      return React.cloneElement(child, {
        ...props,
        className: `${finalClassName} ${child.props.className || ''}`.trim(),
      });
    }

    if (child) {
      return <>{child}</>;
    }
    
    return null;
  }

  return <button className={finalClassName} {...props}>{children}</button>;
};

export default Button;
