import { CartProvider } from "@/lib/CartContext";
import "./globals.css";

export const metadata = {
  title: "Yella - Your Everything Supermarket",
  description: "Get everything delivered in Karnataka. Fast, fresh, and premium.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Outfit:wght@700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>
          <div className="max-w-[1920px] mx-auto min-h-screen relative shadow-2xl bg-black">
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
