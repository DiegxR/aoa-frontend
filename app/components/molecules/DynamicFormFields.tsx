"use client";

import { useFormikContext } from "formik";
import Input from "@/app/components/atoms/Input";
import { InputConfig } from "@/app/types/ui";

interface DynamicFormFieldsProps {
  fields: InputConfig[];
  gridCols?: string;
}

/**
 * Molecule Component: DynamicFormFields
 * Renders a list of form fields based on a configuration array.
 * Integrates with Formik context.
 */
const DynamicFormFields = ({ fields, gridCols = "grid-cols-1 md:grid-cols-2" }: DynamicFormFieldsProps) => {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext<any>();

  return (
    <div className={`grid ${gridCols} gap-5`}>
      {fields.map((field) => (
        <Input
          key={field.name}
          name={field.name}
          label={field.label}
          type={field.type || "text"}
          placeholder={field.placeholder}
          value={values[field.name]}
          onChange={handleChange}
          onBlur={handleBlur}
          errorMessage={touched[field.name] && errors[field.name] ? (errors[field.name] as string) : undefined}
          icon={field.icon}
          iconPosition={field.iconPosition}
          required={field.required}
          helperText={field.helperText}
          fullWidth={field.fullWidth !== false}
          isTextArea={field.type === "textarea"}
          className={field.className}
        />
      ))}
    </div>
  );
};

export default DynamicFormFields;
