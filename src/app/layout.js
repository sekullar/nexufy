
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import toast, { Toaster } from 'react-hot-toast';
import { UserProvider } from "../Context/UserContext";
import { InterfaceProvider } from "../Context/InterfaceContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nexufy",
  description: "Nexufy, hem oyun için hem günlük hayat kullanımı için iletişim aracıdır.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider>
          <InterfaceProvider>
            {children}
            <Toaster />
          </InterfaceProvider>
        </UserProvider>
      </body>
    </html>
  );
}
