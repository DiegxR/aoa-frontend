import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from './Input';

describe('Input Atom', () => {
  it('renders the label correctly', () => {
    render(<Input name="test" label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('shows error message when provided', () => {
    render(<Input name="test" errorMessage="Error occurred" />);
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('renders as a textarea when isTextArea is true', () => {
    render(<Input name="test" isTextArea={true} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('calls onChange handler when value changes', () => {
    const onChange = vi.fn();
    render(<Input name="test" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('displays required asterisk when required is true', () => {
    render(<Input name="test" label="Required Field" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
