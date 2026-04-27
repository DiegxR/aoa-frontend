"use client";

import { forwardRef } from 'react';
import { InputProps } from '@/app/types/ui';

/**
 * Atom Component: Input
 * A highly reusable and accessible input component following SOLID principles.
 * Handles both standard inputs and textareas.
 */
const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      label,
      icon,
      iconPosition = 'left',
      helperText,
      errorMessage,
      fullWidth = true,
      className = '',
      disabled,
      required,
      name,
      isTextArea = false,
      ...props
    },
    ref
  ) => {
    const error = errorMessage;
    
    const baseInputStyles = `
      w-full px-4 py-2.5 rounded-xl
      border transition-all duration-300
      focus:outline-none focus:ring-2
      bg-white/5 border-white/10
      text-white placeholder:text-white/20
      disabled:opacity-50 disabled:cursor-not-allowed
      ${error 
        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
        : 'focus:border-blue-500/50 focus:ring-blue-500/20'
      }
      ${icon && iconPosition === 'left' ? 'pl-11' : ''}
      ${icon && iconPosition === 'right' ? 'pr-11' : ''}
    `;

    const wrapperStyles = `
      ${fullWidth ? 'w-full' : 'inline-block'}
      flex flex-col gap-1.5
      ${className}
    `;

    const InputElement = isTextArea ? 'textarea' : 'input';

    return (
      <div className={wrapperStyles}>
        {label && (
          <label 
            htmlFor={name}
            className="text-sm font-medium text-white/70 ml-1 flex items-center gap-1"
          >
            {label}
            {required && <span className="text-red-500 text-xs">*</span>}
          </label>
        )}
        
        <div className="relative group">
          {icon && iconPosition === 'left' && (
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500/50 transition-colors flex items-center justify-center`}>
              {typeof icon === 'string' ? <span className={icon}></span> : icon}
            </div>
          )}
          
          <InputElement
            ref={ref}
            id={name}
            name={name}
            className={baseInputStyles}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
            rows={isTextArea ? 4 : undefined}
            {...(props as any)}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500/50 transition-colors flex items-center justify-center">
              {typeof icon === 'string' ? <span className={icon}></span> : icon}
            </div>
          )}
        </div>
        
        {error ? (
          <p className="text-[11px] font-medium text-red-400 ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1" id={`${name}-error`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-white/30 ml-1" id={`${name}-helper`}>
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
