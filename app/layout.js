import './globals.css';

export const metadata = {
  title: 'VS Code-like HTML Editor',
  description: 'A browser-based HTML editor with live preview',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
