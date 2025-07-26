'use client';

import { ArrowRight, Microscope, Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            AI-Powered Pneumonia Detection
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Advanced chest X-ray analysis using state-of-the-art artificial intelligence to detect pneumonia with high accuracy.
          </p>
          <Link href="/predict">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Detection System?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-background/50 backdrop-blur">
              <Microscope className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Accurate Analysis</h3>
              <p className="text-muted-foreground">
                High-precision AI model trained on extensive medical datasets for reliable results.
              </p>
            </Card>
            <Card className="p-6 bg-background/50 backdrop-blur">
              <Shield className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your medical data is protected with enterprise-grade security measures.
              </p>
            </Card>
            <Card className="p-6 bg-background/50 backdrop-blur">
              <Clock className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-muted-foreground">
                Get analysis results within seconds of uploading your X-ray image.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Understanding Pneumonia</h2>
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p className="mb-4">
              Pneumonia is an infection that inflames the air sacs in one or both lungs. Early detection
              is crucial for effective treatment and recovery. Common symptoms include:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Chest pain when breathing or coughing</li>
              <li>Confusion or changes in mental awareness (in adults age 65 and older)</li>
              <li>Cough, which may produce phlegm</li>
              <li>Fatigue</li>
              <li>Fever, sweating and shaking chills</li>
              <li>Lower than normal body temperature (in adults older than age 65 and people with weak immune systems)</li>
              <li>Nausea, vomiting or diarrhea</li>
              <li>Shortness of breath</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}