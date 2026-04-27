"use client";
import { useState } from "react";
import Input from "@/app/components/atoms/Input";
import Image from "next/image";
import logo from "@/public/logo.png";
import Link from "next/link";
import { InputConfig, SignTemplateProps } from "@/app/types/ui";
import { useFormContext } from "react-hook-form";

const SignTemplate = ({
  title,
  subtitle,
  inputs,
  submitText,
  onSubmit,
  isLoading = false,
  alternateLink,
  footerText,
  className = "",
}: SignTemplateProps) => {
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>(
    {},
  );
  const { register, formState: { errors } } = useFormContext();

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPassword((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const getInputType = (input: InputConfig) => {
    if (input.type === "password") {
      return showPassword[input.name] ? "text" : "password";
    }
    return input.type || "text";
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-xl">
        {/* Header */}
        <div className="text-center">
          <div className="w-full flex items-center justify-center">
            <Image width={180} height={180} alt="logo" src={logo} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            {inputs.map((input, index) => (
              <div key={input.name || index} className="relative">
                <Input
                  fullWidth
                  type={getInputType(input)}
                  label={
                    input.label ||
                    input.name.charAt(0).toUpperCase() + input.name.slice(1)
                  }
                  placeholder={
                    input.placeholder ||
                    `Ingresa tu ${input.label?.toLowerCase() || input.name}`
                  }
                  icon={input.icon}
                  required={input.required}
                  disabled={isLoading}
                  className="w-full"
                  errorMessage={errors[input.name]?.message as string}
                  {...register(input.name, input.validation)}
                />

                {/* Botón mostrar/ocultar contraseña */}
                {input.type === "password" && (
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(input.name)}
                    className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <span
                      className={` text-xl ${showPassword[input.name] ? "icon-[mdi--eye-off]" : "icon-[mdi--eye]"}`}
                    ></span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative isolate w-full overflow-hidden flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && (
              <span
                className="absolute inset-0 z-0 bg-black/20"
                aria-hidden="true"
              />
            )}
            {isLoading ? (
              <div className="relative z-10 flex items-center gap-2">
                <span
                  className="h-5 w-5 rounded-full border border-white/70"
                  aria-hidden="true"
                />
                Procesando...
              </div>
            ) : (
              <span className="relative z-10">{submitText}</span>
            )}
          </button>

          
          {/* Alternate Link */}
          {alternateLink && (
            <div className="text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {alternateLink.text}{" "}
              </span>
              <Link
                href={alternateLink.path}
                
                className="font-medium cursor-pointer text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {alternateLink.linkText}
              </Link>
            </div>
          )}

          {/* Footer */}
          {footerText && (
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              {footerText}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignTemplate;
