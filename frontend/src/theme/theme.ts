// src/theme/theme.ts

export const colors = {
  primary: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    from: 'indigo',
    to: 'cyan',
  },
  success: 'green',
  error: 'red',
  text: {
    primary: 'inherit',
    dimmed: 'dimmed',
  },
};

export const spacing = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
};

export const shadows = {
  card: '0 10px 40px rgba(0, 0, 0, 0.1)',
  button: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
};

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const layout = {
  fullScreen: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  container: {
    small: 420,
    medium: 480,
    large: 600,
  },
};

export const components = {
  paper: {
    radius: 'md',
    padding: 'xl',
    withBorder: true,
    shadow: shadows.card,
  },
  themeIcon: {
    size: 64,
    radius: 'xl',
    variant: 'gradient',
    gradient: { from: colors.primary.from, to: colors.primary.to },
  },
  button: {
    size: 'md',
    fullWidth: true,
    // gradient: { from: colors.primary.from, to: colors.primary.to },
    color: colors.primary.to,
    variant: 'gradient',
  },
  input: {
    size: 'md',
  },
};

// If you're using Mantine's MantineProvider, you can also export a theme object
export const mantineTheme = {
  colors: {
    brand: [
      '#f0f3ff',
      '#dce4f5',
      '#b9c7e2',
      '#94a9ce',
      '#748fbc',
      '#5e7eb8',
      '#5474b4',
      '#44639f',
      '#39588f',
      '#2d4b81'
    ] as const,
  },
  primaryColor: 'brand',
  defaultRadius: 'md' as const,
  shadows: {
    md: shadows.card,
    xl: '0 15px 50px rgba(0, 0, 0, 0.15)',
  },
};

export default {
  colors,
  spacing,
  shadows,
  borderRadius,
  layout,
  components,
  mantineTheme,
};