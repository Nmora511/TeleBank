import type { Metadata } from "next";
import "./globals.css";
import { Roboto, Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { ModalWrapper } from "@/contexts/ModalContext";
import Modal from "@/components/UtilComponents/Modal";
import "react-toastify/dist/ReactToastify.css";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "TeleBank",
  description: "O Fim dos Caloteiros",
  icons: {
    icon: "/assets/logo.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${roboto.variable} ${poppins.variable} overflow-hidden`}
      lang="pt"
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="TeleBank" />

        <link rel="apple-touch-icon" href="/assets/192x192.png" />

        {/* <link
          href="/splash_screens/iphone5_splash.png"
          media="(device-width: 320px)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splash_screens/iphone6_splash.png"
          media="(device-width: 375px)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splash_screens/iphoneplus_splash.png"
          media="(device-width: 414px)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splash_screens/iphonex_splash.png"
          media="(device-width: 375px) and (device-height: 812px)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splash_screens/iphonexr_splash.png"
          media="(device-width: 414px) and (device-height: 896px)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splash_screens/iphonexsmax_splash.png"
          media="(device-width: 414px) and (device-height: 896px)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splash_screens/ipad_splash.png"
          media="(device-width: 768px) and (device-height: 1024px)"
          rel="apple-touch-startup-image"
        /> */}
      </head>
      <body className="h-full w-full font-roboto overflow-hidden touch-none">
        <ModalWrapper>
          <ToastContainer theme="dark" />
          <Modal />
          {children}
        </ModalWrapper>
      </body>
    </html>
  );
}
