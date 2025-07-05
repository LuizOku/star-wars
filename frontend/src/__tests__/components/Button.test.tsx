import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../components/ui/Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies default CSS classes', () => {
    render(<Button>Default</Button>);

    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-green-teal');
    expect(button.className).toContain('text-white');
    expect(button.className).toContain('text-md');
    expect(button.className).toContain('py-2');
    expect(button.className).toContain('px-4');
    expect(button.className).toContain('rounded-3xl');
    expect(button.className).toContain('font-extrabold');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
    expect(button.className).toContain('bg-green-teal'); // Should still have default classes
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.className).toContain('disabled:opacity-50');
    expect(button.className).toContain('disabled:cursor-not-allowed');
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick} disabled>Disabled</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies hover and transition classes', () => {
    render(<Button>Hover me</Button>);

    const button = screen.getByRole('button');
    expect(button.className).toContain('hover:cursor-pointer');
    expect(button.className).toContain('hover:bg-green-teal/90');
    expect(button.className).toContain('transition-colors');
  });

  it('forwards button props correctly', () => {
    render(<Button type="submit" id="test-button">Submit</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('id', 'test-button');
  });

  it('renders with complex children', () => {
    render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
}); 