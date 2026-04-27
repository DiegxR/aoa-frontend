import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Formik } from 'formik';
import DynamicFormFields from './DynamicFormFields';
import { InputConfig } from '@/app/types/ui';

describe('DynamicFormFields Molecule', () => {
  const mockFields: InputConfig[] = [
    { name: 'firstName', label: 'First Name', placeholder: 'Enter first name' },
    { name: 'lastName', label: 'Last Name', placeholder: 'Enter last name' },
  ];

  it('renders all fields provided in configuration', () => {
    render(
      <Formik initialValues={{ firstName: '', lastName: '' }} onSubmit={() => {}}>
        <DynamicFormFields fields={mockFields} />
      </Formik>
    );

    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter first name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter last name')).toBeInTheDocument();
  });

  it('renders fields in a grid with custom columns', () => {
    const { container } = render(
      <Formik initialValues={{ firstName: '', lastName: '' }} onSubmit={() => {}}>
        <DynamicFormFields fields={mockFields} gridCols="grid-cols-3" />
      </Formik>
    );

    const gridDiv = container.firstChild;
    expect(gridDiv).toHaveClass('grid-cols-3');
  });
});
