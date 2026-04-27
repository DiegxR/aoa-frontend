import { InputHTMLAttributes, ReactNode } from "react";
import { FieldValues, RegisterOptions } from "react-hook-form";

/**
 * Interface for dynamic input configuration
 */
export interface InputConfig {
  name: string;
  type?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  helperText?: string;
  fullWidth?: boolean;
  className?: string;
  validation?: RegisterOptions<any, string>;
}

/**
 * Props for the Input Atom component
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  name: string;
  label?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  helperText?: string;
  errorMessage?: string;
  fullWidth?: boolean;
  isTextArea?: boolean;
  validation?: RegisterOptions<any, string>;
}

/**
 * Props for SignTemplate
 */
export interface SignTemplateProps {
  title: string;
  subtitle?: string;
  inputs: InputConfig[];
  submitText: string;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void> | void;
  isLoading?: boolean;
  alternateLink?: {
    text: string;
    linkText: string;
    path: string;
  };
  footerText?: string;
  className?: string;
}

/**
 * NavItem for Dashboard navigation
 */
export interface NavItem {
  icon: ReactNode;
  name: string;
  path: string;
}
