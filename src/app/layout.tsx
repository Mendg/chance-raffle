import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chance Raffle | Friendship Circle",
  description: "Enter our chance raffle for a chance to win amazing prizes while supporting our nonprofit mission. Every entry helps make a difference!",
  keywords: ["raffle", "nonprofit", "charity", "fundraising", "friendship circle"],
  openGraph: {
    title: "Chance Raffle | Friendship Circle",
    description: "Enter our chance raffle for a chance to win amazing prizes while supporting our nonprofit mission.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
