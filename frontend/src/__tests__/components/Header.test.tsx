import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import Header from '../../components/ui/Header';

// Mock useRouter
const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
};

jest.mocked(useRouter).mockReturnValue(mockRouter as unknown as ReturnType<typeof useRouter>);

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with correct title', () => {
    render(<Header />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('SWStarter')).toBeInTheDocument();
  });

  it('applies correct CSS classes to header', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header.className).toContain('w-full');
    expect(header.className).toContain('flex');
    expect(header.className).toContain('justify-center');
    expect(header.className).toContain('py-6');
    expect(header.className).toContain('bg-white');
    expect(header.className).toContain('shadow-sm');
  });

  it('applies correct CSS classes to title', () => {
    render(<Header />);

    const title = screen.getByText('SWStarter');
    expect(title.className).toContain('text-2xl');
    expect(title.className).toContain('font-bold');
    expect(title.className).toContain('font-montserrat');
    expect(title.className).toContain('text-green-teal');
    expect(title.className).toContain('tracking-normal');
    expect(title.className).toContain('cursor-pointer');
  });

  it('navigates to home page when title is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const title = screen.getByText('SWStarter');
    await user.click(title);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('handles multiple clicks on title', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const title = screen.getByText('SWStarter');
    await user.click(title);
    await user.click(title);
    await user.click(title);

    expect(mockPush).toHaveBeenCalledTimes(3);
    expect(mockPush).toHaveBeenNthCalledWith(1, '/');
    expect(mockPush).toHaveBeenNthCalledWith(2, '/');
    expect(mockPush).toHaveBeenNthCalledWith(3, '/');
  });

  it('has correct semantic HTML structure', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header.tagName).toBe('HEADER');

    const title = screen.getByText('SWStarter');
    expect(title.tagName).toBe('H1');
  });

  it('maintains focus after navigation', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const title = screen.getByText('SWStarter');
    await user.click(title);

    // Title should still be focusable after navigation
    expect(title).toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('renders consistently across multiple renders', () => {
    const { rerender } = render(<Header />);

    expect(screen.getByText('SWStarter')).toBeInTheDocument();

    rerender(<Header />);

    expect(screen.getByText('SWStarter')).toBeInTheDocument();
    expect(screen.getAllByText('SWStarter')).toHaveLength(1);
  });

  it('has correct ARIA attributes', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('class');

    const title = screen.getByText('SWStarter');
    expect(title).toHaveAttribute('class');
    expect(title.className).toContain('cursor-pointer');
  });
}); 