import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../../components/ui/Input';

describe('Input', () => {
  it('renders as a text input by default', () => {
    render(<Input />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    // Default HTML input type is 'text' even if not explicitly set
  });

  it('handles value changes', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello World');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('Hello World');
  });

  it('applies default CSS classes', () => {
    render(<Input />);

    const input = screen.getByRole('textbox');
    expect(input.className).toContain('w-full');
    expect(input.className).toContain('border');
    expect(input.className).toContain('p-3');
    expect(input.className).toContain('rounded-lg');
    expect(input.className).toContain('border-pinkish-grey');
    expect(input.className).toContain('text-dark-grey');
    expect(input.className).toContain('text-md');
    expect(input.className).toContain('focus:outline-none');
    expect(input.className).toContain('focus:ring-1');
    expect(input.className).toContain('focus:ring-dark-grey');
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" />);

    const input = screen.getByRole('textbox');
    expect(input.className).toContain('custom-class');
    expect(input.className).toContain('w-full'); // Should still have default classes
  });

  it('handles placeholder text', () => {
    render(<Input placeholder="Enter your name" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter your name');
  });

  it('handles different input types', () => {
    render(<Input type="email" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('handles password input type', () => {
    render(<Input type="password" data-testid="password-input" />);

    const input = screen.getByTestId('password-input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('handles disabled state', () => {
    render(<Input disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('handles readOnly state', () => {
    render(<Input readOnly />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readOnly');
  });

  it('forwards input props correctly', () => {
    render(<Input id="test-input" name="test" required />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveAttribute('name', 'test');
    expect(input).toHaveAttribute('required');
  });

  it('handles controlled input', () => {
    const { rerender } = render(<Input value="initial" onChange={() => { }} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('initial');

    rerender(<Input value="updated" onChange={() => { }} />);
    expect(input).toHaveValue('updated');
  });

  it('handles uncontrolled input', async () => {
    const user = userEvent.setup();
    render(<Input defaultValue="default" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('default');

    await user.clear(input);
    await user.type(input, 'new value');
    expect(input).toHaveValue('new value');
  });

  it('handles focus and blur events', async () => {
    const user = userEvent.setup();
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');
    await user.click(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    await user.tab();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('handles maxLength attribute', async () => {
    const user = userEvent.setup();
    render(<Input maxLength={5} />);

    const input = screen.getByRole('textbox');
    await user.type(input, '1234567890');

    expect(input).toHaveValue('12345');
  });
}); 