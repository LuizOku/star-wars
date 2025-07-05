import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeDisabled(): R;
      toBeChecked(): R;
      toHaveValue(value: string | number): R;
      toHaveTextContent(text: string): R;
      toBeVisible(): R;
      toBeEnabled(): R;
      toHaveStyle(style: string | object): R;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
      toBeRequired(): R;
      toBeValid(): R;
      toBeInvalid(): R;
      toHaveFocus(): R;
      toHaveFormValues(values: Record<string, unknown>): R;
      toHaveErrorMessage(message: string): R;
      toBeEmptyDOMElement(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(html: string): R;
      toHaveAccessibleDescription(description: string): R;
      toHaveAccessibleName(name: string): R;
      toHaveAccessibleErrorMessage(message: string): R;
    }
  }
} 