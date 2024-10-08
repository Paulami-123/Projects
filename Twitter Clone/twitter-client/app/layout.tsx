import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Provider from "@/util/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
          <body className={inter.className} suppressHydrationWarning={true}>
            <Provider>
              <GoogleOAuthProvider clientId="485996617241-n0vb77nf5u6fm4h59ojhqtt50r0h28nk.apps.googleusercontent.com">
                {children}
                <Toaster />
              </GoogleOAuthProvider>
            </Provider>
          </body>
      </html>
  );
}
