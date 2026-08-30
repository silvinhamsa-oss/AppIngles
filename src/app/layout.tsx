import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/pwa/PwaRegister";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const newsreaderSerif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#09090e",
};

export const metadata: Metadata = {
  title: "English Lab — Studio Voice & AI English Tutor",
  description: "Tutor particular de inglês de alto padrão. Conversação imersiva por voz, active recall e repetição espaçada.",
  manifest: "/manifest.json",
  applicationName: "English Lab",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "English Lab",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/icon-192x192.svg",
    apple: "/icons/icon-192x192.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${jakartaSans.variable} ${jetbrainsMono.variable} ${newsreaderSerif.variable} h-full antialiased`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('english-lab-theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', saved);
                  if (saved === 'light') {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans transition-colors duration-200 selection:bg-amber-400 selection:text-zinc-950">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
