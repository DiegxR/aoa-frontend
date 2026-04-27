import { InputHTMLAttributes } from "react";
import { FieldValues, RegisterOptions } from "react-hook-form";

export interface InputField {
  name: string;
  type?: string;
  icon?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  validation?: RegisterOptions<FieldValues, string>;
}

export interface SignTemplateProps {
  title: string;
  subtitle?: string;
  inputs: InputField[];
  submitText: string;
  onSubmit: (data: FieldValues) => void;
  isLoading?: boolean;
  alternateLink?: {
    text: string;
    linkText: string;
    path: string;
  };
  footerText?: string;
  className?: string;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string; 
  iconPosition?: 'left' | 'right';
  helperText?: string;
  errorMessage?: string;
  fullWidth?: boolean;
  name: string;
  validation?: RegisterOptions<FieldValues, string>
}