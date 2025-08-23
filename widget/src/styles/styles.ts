export const styles: {
  id: string;
  hidden?: boolean;
  experimental?: boolean;
}[] = [
    { id: 'normal' },
    { id: 'compact' },
    { id: 'classic' },
    { id: 'custom', experimental: true, hidden: true },
  ];

export const colorSchemes: string[] = [
  'dark',
  'faceit',
  'ctp-latte',
  'ctp-frappe',
  'ctp-macchiato',
  'ctp-mocha',
  'custom',
];
