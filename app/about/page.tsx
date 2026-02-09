import { Metadata } from 'next';
import AboutSection from '@/components/about-section';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'About - Ink2Text',
  description: 'Learn about Ink2Text - The smart handwriting to digital text converter',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <AboutSection />
      <Footer />
    </main>
  );
}
