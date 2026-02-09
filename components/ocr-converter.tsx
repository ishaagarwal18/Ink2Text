'use client';

import React from "react"

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Copy, Download, RefreshCw, Upload, History, FileDown, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as Tesseract from 'tesseract.js';

interface HistoryItem {
  id: string;
  text: string;
  timestamp: number;
  fileName: string;
}

export default function OCRConverter() {
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('ocr-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('[v0] Failed to load history:', error);
      }
    }
  }, []);

  // Save history to localStorage
  const addToHistory = (text: string, fileName: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      text,
      timestamp: Date.now(),
      fileName,
    };
    const updatedHistory = [newItem, ...history].slice(0, 20); // Keep last 20 items
    setHistory(updatedHistory);
    localStorage.setItem('ocr-history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ocr-history');
    toast({
      title: 'History cleared',
      description: 'All conversion history has been deleted',
    });
  };

  const loadFromHistory = (item: HistoryItem) => {
    setExtractedText(item.text);
    setShowHistory(false);
    toast({
      title: 'Loaded from history',
      description: `Loaded conversion from ${new Date(item.timestamp).toLocaleDateString()}`,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|png|jpg|webp)/)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload JPG, PNG, or WebP images',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload images smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setExtractedText('');
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!image) return;

    setIsProcessing(true);
    try {
      const result = await Tesseract.recognize(image, 'eng', {
        logger: (m) => {
          console.log('[v0] OCR Progress:', m);
        },
      });

      const text = result.data.text;
      setExtractedText(text);
      addToHistory(text, imageFile?.name || 'Untitled');

      if (text.trim().length === 0) {
        toast({
          title: 'No text found',
          description: 'Could not extract any text from the image. Try a clearer image.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success!',
          description: `Extracted ${text.split(/\s+/).length} words from the image`,
        });
      }
    } catch (error) {
      console.error('[v0] OCR Error:', error);
      toast({
        title: 'Processing failed',
        description: 'An error occurred while processing the image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      toast({
        title: 'Copied!',
        description: 'Text copied to clipboard',
      });
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy text to clipboard',
        variant: 'destructive',
      });
    }
  };

  const saveToDownloads = () => {
    const element = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    const fileName = `ink2text-${timestamp}.txt`;
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(extractedText)}`);
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: 'Downloaded!',
      description: 'Text saved to Downloads folder',
    });
  };

  const saveAsFile = async () => {
    try {
      const handle = await (window as any).showSaveFilePicker?.({
        suggestedName: `ink2text-${new Date().toISOString().slice(0, 10)}.txt`,
        types: [
          {
            description: 'Text Files',
            accept: { 'text/plain': ['.txt'] },
          },
        ],
      });

      if (handle) {
        const writable = await handle.createWritable();
        await writable.write(extractedText);
        await writable.close();

        toast({
          title: 'File saved!',
          description: 'Text saved successfully',
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('[v0] Save error:', error);
        toast({
          title: 'Save failed',
          description: 'Your browser may not support file saving. Try downloading instead.',
          variant: 'destructive',
        });
      }
    }
  };

  const reset = () => {
    setImage(null);
    setExtractedText('');
    setImageFile(null);
    setShowHistory(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadText = () => {
    saveToDownloads();
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with History */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex-1 text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Convert Handwritten Text
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload an image of handwritten text and watch it transform into editable digital text in seconds.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="ml-4 gap-2 bg-transparent"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
            {history.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold ml-1">
                {history.length}
              </span>
            )}
          </Button>
        </div>

        {/* History Panel */}
        {showHistory && history.length > 0 && (
          <Card className="mb-8 bg-card border border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Conversion History</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-destructive hover:text-destructive/90"
              >
                Clear All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="p-3 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors border border-border"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate text-sm">
                          {item.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.text.slice(0, 100)}...
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Converter */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Upload & Preview */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Upload Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!image ? (
                <div
                  className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Drag & drop your image here
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    or click to browse (JPG, PNG, WebP - Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative w-full bg-muted rounded-lg overflow-hidden max-h-96">
                    <img
                      src={image || "/placeholder.svg"}
                      alt="Uploaded"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Image
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <Button
                onClick={processImage}
                disabled={!image || isProcessing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    Processing...
                  </>
                ) : (
                  'Convert to Text'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Text Output */}
          <Card className="bg-card border border-border flex flex-col">
            <CardHeader>
              <CardTitle className="text-foreground">Extracted Text</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
              {extractedText ? (
                <>
                  <textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="flex-1 w-full p-4 rounded-lg border border-border bg-muted text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Extracted text will appear here..."
                  />
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className="gap-2 bg-transparent"
                      >
                        <Copy className="w-4 h-4" />
                        <span className="hidden sm:inline">Copy</span>
                      </Button>
                      <Button
                        onClick={saveAsFile}
                        variant="outline"
                        className="gap-2 bg-transparent"
                      >
                        <Save className="w-4 h-4" />
                        <span className="hidden sm:inline">Save As</span>
                      </Button>
                      <Button
                        onClick={saveToDownloads}
                        variant="outline"
                        className="gap-2 bg-transparent"
                      >
                        <FileDown className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                      <Button
                        onClick={reset}
                        variant="outline"
                        className="gap-2 bg-transparent"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline">Reset</span>
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                  <div>
                    <p className="text-lg">Upload and convert an image to see extracted text here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-muted/30 border border-border">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="font-semibold text-foreground">Supported Formats</p>
                <p className="text-sm text-muted-foreground">JPG, PNG, WebP</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Max File Size</p>
                <p className="text-sm text-muted-foreground">5 MB</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Processing</p>
                <p className="text-sm text-muted-foreground">Client-side, No server upload</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
