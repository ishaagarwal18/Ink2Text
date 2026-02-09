'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Upload, Zap } from 'lucide-react';

export default function LandingHero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted px-4 pt-12">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Turn Handwriting into Digital Text
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {' '}Instantly
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Smart OCR technology that converts your handwritten notes into editable, searchable digital text. Perfect for students, teachers, and professionals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Upload className="w-5 h-5" />
                Get Started Free
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 bg-transparent">
                Learn More
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
            <div>
              <p className="text-3xl font-bold text-primary">99%</p>
              <p className="text-sm text-muted-foreground">Accuracy Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">2s</p>
              <p className="text-sm text-muted-foreground">Average Speed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-secondary">100%</p>
              <p className="text-sm text-muted-foreground">Private & Secure</p>
            </div>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-full h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="inline-flex p-6 bg-white/50 rounded-full">
                  <Zap className="w-16 h-16 text-primary" />
                </div>
                <p className="text-lg font-semibold text-primary">Lightning-fast OCR</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
