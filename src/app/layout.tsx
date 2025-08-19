"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "./context/WalletContext";


import "@burnt-labs/abstraxion/dist/index.css";
import "@burnt-labs/ui/dist/index.css"
import { AbstraxionProvider } from "@burnt-labs/abstraxion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const abstraxionConfig = {
//   chains: [xion],
//   transports: {
//     [xion.id]: http(),
//   },
// };


const treasuryConfig = {
  treasury: process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS,
  rpcUrl: process.env.NEXT_PUBLIC_XION_RPC,
  restUrl: process.env.NEXT_PUBLIC_XION_REST,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
          <AbstraxionProvider config={treasuryConfig}>
            <WalletProvider>
              {children}
            </WalletProvider>
          </AbstraxionProvider>
      </body>
    </html>
  );
}
