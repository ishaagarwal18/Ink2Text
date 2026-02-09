import { Metadata } from 'next';
import OCRConverter from '@/components/ocr-converter';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'OCR Converter - Ink2Text',
  description: 'Convert handwritten text to digital text using advanced OCR technology',
};

export default function ConverterPage() {
  return (
    <main className="min-h-screen bg-background">
      <OCRConverter />
      <Footer />
    </main>
  );
}
