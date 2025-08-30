import './globals.css'

export const metadata = {
  title: 'Coffee Shop',
  description: 'Your favorite coffee shop',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}