import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";


import localFont from "next/font/local";
import { Inter, IBM_Plex_Serif } from "next/font/google";

const inter= Inter({subsets : ["latin"], variable: '--font-inter'});
const IbmPlexSerif = IBM_Plex_Serif({
  subsets:['latin'],
  weight:['400', '700'],
  variable: '--font-ibm-plex-serif'
})

const ibmPLexSans = localFont({
  src: [
    { path: '/fonts/IBMPlexSans-Regular.ttf', weight: '400', style: 'normal' },
    { path: '/fonts/IBMPlexSans-Medium.ttf', weight: '500', style: 'normal' },
    { path: '/fonts/IBMPlexSans-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '/fonts/IBMPlexSans-Bold.ttf', weight: '700', style: 'normal' },
  ]
});

const bebasNeue = localFont({
  src: [
    { path: '/fonts/BebasNeue-Regular.ttf', weight: "400", style: "normal" },
  ],
  variable: "--bebas-neue",
});

export const metadata: Metadata = {
  title: "Personalized Diet Planning",
  description: "A platform which generates Diet Plan for you according to your health Goals",
  icons: {
    icon: "./img/LOGO.png", // Default favicon
    shortcut: "./img/LOGO.png",
    apple: "./img/LOGO.png", // Apple touch icon
  },
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${IbmPlexSerif.variable}`}
      >
        {children}
      </body>
    </html>
  )
}

export default RootLayout;