import './globals.css';
import ClientLayoutWrapper from './providers';

export const metadata = {
  title: "TOPIQ TALENT TEST (TTT) | India's 100-Day MCQ Challenge",
  description: '100 Days • 6000 MCQs • Talent Recognition & Scholarship Challenge - Maharashtra Edition by Balmitra Kids Pvt Ltd.',
  icons: {
    icon: '/logo.png',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-[#01295A] antialiased selection:bg-[#FE7C02] selection:text-white">
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}