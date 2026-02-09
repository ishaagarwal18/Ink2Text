'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Target } from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            About Ink2Text
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transforming handwritten notes into digital text, making knowledge more accessible and searchable.
          </p>
        </div>

        {/* Mission */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Target className="w-6 h-6 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-muted-foreground leading-relaxed">
            At Ink2Text, we believe that handwritten notes should never be lost in a drawer or forgotten in a notebook. Our mission is to help students, teachers, professionals, and creatives preserve, digitize, and instantly access their handwritten work using cutting-edge OCR technology.
          </CardContent>
        </Card>

        {/* Use Cases */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Who Uses Ink2Text?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Students & Educators
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Convert lecture notes and study materials into searchable digital formats. Perfect for creating study guides and preparing for exams without retyping everything.
              </CardContent>
            </Card>

            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Users className="w-6 h-6 text-accent" />
                  Professionals & Creatives
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Quickly digitize meeting notes, brainstorming sessions, and creative sketches. Collaborate with your team by sharing instantly converted digital documents.
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Why Choose Ink2Text?</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                  <span className="text-primary font-bold">✓</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">99% Accuracy</h3>
                <p className="text-muted-foreground">
                  Our advanced AI-powered OCR engine recognizes even messy or cursive handwriting with incredible accuracy.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                  <span className="text-primary font-bold">✓</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Process your handwritten images in seconds, not minutes. Get instant results you can edit and share.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                  <span className="text-primary font-bold">✓</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">100% Private</h3>
                <p className="text-muted-foreground">
                  All processing happens on your device. Your documents are never uploaded or stored on any server.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                  <span className="text-primary font-bold">✓</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Easy to Use</h3>
                <p className="text-muted-foreground">
                  Simple, intuitive interface designed for everyone. Upload, convert, and download in just a few clicks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-12 text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Ready to digitize your handwriting?</h2>
          <p className="text-lg text-muted-foreground">
            Start converting your handwritten notes to digital text right now. It's free and easy!
          </p>
        </div>
      </div>
    </div>
  );
}
