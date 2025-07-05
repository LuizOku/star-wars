import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RadioGroup from '../../components/ui/RadioGroup';

describe('RadioGroup', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const mockProps = {
    options: mockOptions,
    value: 'option1',
    onChange: jest.fn(),
    name: 'test-radio-group',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all radio options', () => {
    render(<RadioGroup {...mockProps} />);

    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 3')).toBeInTheDocument();
  });

  it('shows the correct selected option', () => {
    render(<RadioGroup {...mockProps} value="option2" />);

    expect(screen.getByLabelText('Option 1')).not.toBeChecked();
    expect(screen.getByLabelText('Option 2')).toBeChecked();
    expect(screen.getByLabelText('Option 3')).not.toBeChecked();
  });

  it('calls onChange when an option is selected', async () => {
    const user = userEvent.setup();
    render(<RadioGroup {...mockProps} />);

    await user.click(screen.getByLabelText('Option 2'));

    expect(mockProps.onChange).toHaveBeenCalledWith('option2');
  });

  it('applies correct name attribute to all radio inputs', () => {
    render(<RadioGroup {...mockProps} />);

    const radios = screen.getAllByRole('radio');
    radios.forEach(radio => {
      expect(radio).toHaveAttribute('name', 'test-radio-group');
    });
  });

  it('applies horizontal orientation by default', () => {
    render(<RadioGroup {...mockProps} />);

    const container = screen.getByLabelText('Option 1').closest('div');
    expect(container?.className).toContain('flex');
    expect(container?.className).toContain('gap-6');
    expect(container?.className).not.toContain('flex-col');
  });

  it('applies vertical orientation when specified', () => {
    render(<RadioGroup {...mockProps} orientation="vertical" />);

    const container = screen.getByLabelText('Option 1').closest('div');
    expect(container?.className).toContain('flex');
    expect(container?.className).toContain('flex-col');
    expect(container?.className).toContain('gap-3');
  });

  it('applies custom className', () => {
    render(<RadioGroup {...mockProps} className="custom-class" />);

    const container = screen.getByLabelText('Option 1').closest('div');
    expect(container?.className).toContain('custom-class');
    expect(container?.className).toContain('flex'); // Should still have default classes
  });

  it('handles empty options array', () => {
    render(<RadioGroup {...mockProps} options={[]} />);

    const radios = screen.queryAllByRole('radio');
    expect(radios).toHaveLength(0);
  });

  it('handles single option', () => {
    const singleOption = [{ value: 'single', label: 'Single Option' }];
    render(<RadioGroup {...mockProps} options={singleOption} />);

    expect(screen.getByLabelText('Single Option')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(1);
  });

  it('applies correct styling to radio inputs', () => {
    render(<RadioGroup {...mockProps} />);

    const radios = screen.getAllByRole('radio');
    radios.forEach(radio => {
      expect(radio.className).toContain('w-4');
      expect(radio.className).toContain('h-4');
      expect(radio.className).toContain('text-emerald');
    });
  });

  it('applies correct styling to labels', () => {
    render(<RadioGroup {...mockProps} />);

    const labels = screen.getAllByRole('radio').map(radio => radio.closest('label'));
    labels.forEach(label => {
      expect(label?.className).toContain('flex');
      expect(label?.className).toContain('items-center');
      expect(label?.className).toContain('gap-2');
      expect(label?.className).toContain('cursor-pointer');
    });
  });

  it('applies correct styling to label text', () => {
    render(<RadioGroup {...mockProps} />);

    const labelTexts = screen.getAllByText(/Option \d/);
    labelTexts.forEach(text => {
      expect(text.className).toContain('text-dark-grey');
      expect(text.className).toContain('text-md');
      expect(text.className).toContain('font-bold');
    });
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<RadioGroup {...mockProps} />);

    const firstRadio = screen.getByLabelText('Option 1');
    await user.tab();
    expect(firstRadio).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByLabelText('Option 2')).toHaveFocus();
  });

  it('handles options with special characters', () => {
    const specialOptions = [
      { value: 'special-1', label: 'Option & Test' },
      { value: 'special-2', label: 'Option "Quote"' },
      { value: 'special-3', label: 'Option <HTML>' },
    ];

    render(<RadioGroup {...mockProps} options={specialOptions} />);

    expect(screen.getByLabelText('Option & Test')).toBeInTheDocument();
    expect(screen.getByLabelText('Option "Quote"')).toBeInTheDocument();
    expect(screen.getByLabelText('Option <HTML>')).toBeInTheDocument();
  });

  it('handles rapid option changes', async () => {
    const user = userEvent.setup();
    render(<RadioGroup {...mockProps} value="option1" />);

    await user.click(screen.getByLabelText('Option 2'));
    await user.click(screen.getByLabelText('Option 3'));
    await user.click(screen.getByLabelText('Option 2'));

    expect(mockProps.onChange).toHaveBeenCalledTimes(3);
    expect(mockProps.onChange).toHaveBeenNthCalledWith(1, 'option2');
    expect(mockProps.onChange).toHaveBeenNthCalledWith(2, 'option3');
    expect(mockProps.onChange).toHaveBeenNthCalledWith(3, 'option2');
  });

  it('maintains selection state correctly', () => {
    const { rerender } = render(<RadioGroup {...mockProps} value="option1" />);

    expect(screen.getByLabelText('Option 1')).toBeChecked();
    expect(screen.getByLabelText('Option 2')).not.toBeChecked();

    rerender(<RadioGroup {...mockProps} value="option2" />);

    expect(screen.getByLabelText('Option 1')).not.toBeChecked();
    expect(screen.getByLabelText('Option 2')).toBeChecked();
  });
}); 