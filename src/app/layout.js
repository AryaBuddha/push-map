import { Inter } from "next/font/google";

import "./tailwind.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Purdue PUSH Map",
  description: "Dynamic Map for Purdue PUSH ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
