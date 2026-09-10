import type { Metadata } from "next";
import { Mali, Fredoka } from "next/font/google";
import "./globals.css";

const mali = Mali({
  variable: "--font-mali",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Happy Birthday My Princess 🎂💖 | Pond & Special One",
  description: "สุขสันต์วันเกิดคนพิเศษของปอนด์ เว็บไซต์ความทรงจำและความรักสุดพิเศษ สไตล์ Claymorphism ธีม Hello Kitty",
  icons: {
    icon: "/images/kitty-birthday.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${mali.variable} ${fredoka.variable}`}
    >
      <body className="font-mali bg-[#FFF5F8] text-[#4A3E3D] min-h-screen selection:bg-[#FFB6C1] selection:text-[#881337] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
