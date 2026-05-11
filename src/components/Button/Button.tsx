import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const baseStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '1rem',
  fontWeight: 'bold',
  padding: '0.625rem 1.5rem',
  border: '2px solid currentColor',
  cursor: 'pointer',
  letterSpacing: '0.05em',
  transition: 'opacity 0.15s',
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: '#ffffff', color: '#000000' },
  secondary: { background: 'transparent', color: '#ffffff' },
  danger: { background: '#ff3333', color: '#ffffff' },
}

export function Button({ variant = 'primary', children, style, disabled, ...rest }: ButtonProps) {
  return (
    <button
      data-variant={variant}
      disabled={disabled}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
