// components/Input.tsx
import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { InputProps } from '../types/sign';



const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      icon,
      iconPosition = 'left',
      helperText,
      errorMessage,
      fullWidth = false,
      className = '',
      disabled,
      required,
      validation,
      name,
      ...props
    },
    ref,
  ) => {
    const methods = useFormContext();
    const register = methods?.register;
    const formState = methods?.formState;
    const reactHookFormError = formState?.errors?.[name]?.message as
      | string
      | undefined;
    const error = errorMessage || reactHookFormError;
    const registeredProps =
      register && validation ? register(name, validation) : {};
    const baseStyles = `
      px-4 pr-6 py-2 rounded-lg
      border transition-all duration-200
      focus:outline-none focus:ring-2
      bg-white dark:bg-gray-800
      text-gray-900 dark:text-gray-100
      placeholder:text-gray-400 dark:placeholder:text-gray-500
      disabled:opacity-50 disabled:cursor-not-allowed
      ${error 
        ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-800' 
        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-800'
      }
      ${icon && iconPosition === 'left' ? 'pl-10' : ''}
      ${icon && iconPosition === 'right' ? 'pr-10' : ''}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;

    const wrapperStyles = `
      ${fullWidth ? 'w-full' : 'inline-block'}
      ${disabled ? 'opacity-60' : ''}
    `;


    return (
      <div className={wrapperStyles}>
        {label && (
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <span className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500`}>
              <span className={`${icon} text-xl`}></span>
            </span>
          )}
          
          <input
            ref={ref}
            id={name}
            name={name}
            className={baseStyles}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            {...props}
            {...registeredProps}
          />
          
          {icon && iconPosition === 'right' && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 dark:text-gray-500">
              <span className={`${icon} text-xl`}></span>
            </span>
          )}
        </div>
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
        
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400" id={`${props.id}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;