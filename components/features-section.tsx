'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Copy, Download, Lock, Sparkles, Share2 } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'High Accuracy OCR',
    description: 'Advanced AI-powered recognition achieves up to 99% accuracy even with messy or cursive handwriting.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Convert your handwritten notes to digital text in seconds, not minutes.',
  },
  {
    icon: Copy,
    title: 'Editable Text',
    description: 'Get fully editable text that you can modify, format, and perfect to your needs.',
  },
  {
    icon: Download,
    title: 'Easy Download',
    description: 'Export your converted text as TXT, PDF, or Word documents with one click.',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'Your documents are processed securely. We never store or share your data.',
  },
  {
    icon: Share2,
    title: 'Copy & Share',
    description: 'Instantly copy converted text to clipboard or share it directly with others.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to convert handwriting to digital text with ease and confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="bg-card border border-border hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
