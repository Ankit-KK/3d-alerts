import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ember Strike 3D Alert',
  description: 'Premium 3D donation overlay for OBS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: 'transparent' }}>{children}</body>
    </html>
  );
}
