'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Upload, Zap, FileText } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    number: '1',
    title: 'Upload Image',
    description: 'Upload a photo or document containing handwritten text. JPG, PNG, and PDF formats supported.',
  },
  {
    icon: Zap,
    number: '2',
    title: 'Process Handwriting',
    description: 'Our advanced OCR engine analyzes and recognizes the handwritten text in real-time.',
  },
  {
    icon: FileText,
    number: '3',
    title: 'Get Digital Text',
    description: 'Receive perfectly formatted, editable digital text ready to use, copy, or download.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">How It Works</h2>
          <p className="text-xl text-muted-foreground">
            Three simple steps to transform your handwritten notes into digital text.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="bg-card border border-border h-full">
                  <CardContent className="pt-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-muted-foreground">Step {step.number}</p>
                        <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Connector Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
